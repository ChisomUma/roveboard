// The product itself: a travel company signs up and manages trips, suppliers and payments.
import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import {
  addSupplier, button, createTrip, dialog, expectToast, field, headerButton, logIn, logOut, moneyCell,
  newEmail, PASSWORD, setField, signUp, supabaseSelect, supabaseSignUpOnly, supabaseToken,
} from './helpers';

// Trip deletion asks "Are you sure?" with the browser's confirm box: say yes.
test.beforeEach(({ page }) => page.on('dialog', d => d.accept()));

test('a new company runs a trip end to end, and the data is saved', async ({ page }) => {
  const email = newEmail('flow');
  await signUp(page, email, 'Flow Test Co');
  await expect(page.locator('.ws-empty h3')).toHaveText('No trips yet');
  await expect(page.locator('.ws-card')).toHaveCount(0);
  await expect(page.locator('.ws-side-foot')).toContainText('Flow Test Co');
  await expect(page.locator('.ws-side-foot')).toContainText(email);

  await createTrip(page, { name: 'Italy Group 2027' });
  await addSupplier(page, {
    name: 'Hotel Alpha', contact: 'alpha@hotel.test',
    deposit: { amount: '1000', due: '2027-05-01' }, balance: { amount: '2500.50', due: '2027-05-20' },
  });
  await page.reload();
  await expect(page.locator('.ws-sup b', { hasText: 'Hotel Alpha' })).toBeVisible();
  await expect(moneyCell(page, 'Still owed')).toHaveText('€3,500.50');

  // Mark the deposit paid from the Deadlines tab
  await page.getByRole('tab', { name: 'Deadlines' }).click();
  await page.locator('.ws-pay', { hasText: 'Hotel Alpha' }).first().getByRole('button', { name: 'Mark paid' }).click();
  await expectToast(page, 'Marked as paid');
  await page.reload();
  await expect(moneyCell(page, 'Paid')).toHaveText('€1,000');

  // Paste two suppliers from a spreadsheet
  await headerButton(page, 'Import').click();
  await dialog(page).locator('textarea').fill('Supplier\tType\tDeposit\nBeta Coaches\tcoach\t400\nGamma Guides\tguide\t150');
  await page.locator('.ws-dialog').getByRole('button', { name: /^Continue/ }).click();
  await button(dialog(page), 'Import 2 suppliers').click();
  await page.reload();
  await expect(page.locator('.ws-sup b')).toHaveCount(3);

  // Edit the trip
  await headerButton(page, 'Edit trip').click();
  await setField(dialog(page), 'Travellers', '14');
  await button(dialog(page), 'Save changes').click();
  await expectToast(page, 'Trip saved');
  await page.reload();
  await expect(page.locator('.ws-meta')).toContainText('14 travellers');

  // Team notes save automatically
  await page.goto('/notes');
  await page.locator('.ws-notepad').fill('A private note');
  await page.waitForTimeout(1500); // notes save shortly after you stop typing
  await page.reload();
  await expect(page.locator('.ws-notepad')).toHaveValue('A private note');

  // Log out, log back in: everything is still there
  await logOut(page);
  await page.goto('/trips');
  await expect(page).toHaveURL(/\/login/);
  await logIn(page, email);
  await expect(page).toHaveURL(/\/trips$/);
  await expect(page.locator('.ws-card h2', { hasText: 'Italy Group 2027' })).toBeVisible();
});

test('companies can never see each other’s data', async ({ page, browser }) => {
  await signUp(page, newEmail('owner'), 'Private Co');
  await createTrip(page, { name: 'Secret Trip' });
  await addSupplier(page, { name: 'Secret Hotel', deposit: { amount: '500' } });
  const secretTripUrl = page.url();
  await page.goto('/notes');
  await page.locator('.ws-notepad').fill('Confidential note');
  await page.waitForTimeout(1500);

  // A second company in a separate browser
  const other = await (await browser.newContext()).newPage();
  const otherEmail = newEmail('outsider');
  await signUp(other, otherEmail, 'Nosy Co');
  await expect(other.locator('.ws-card h2', { hasText: 'Secret Trip' })).toHaveCount(0);
  await other.goto(secretTripUrl);
  await expect(other.locator('.ws-empty h3')).toHaveText('Trip not found');
  await other.goto('/suppliers');
  await expect(other.locator('.ws-sup b', { hasText: 'Secret Hotel' })).toHaveCount(0);
  await other.goto('/notes');
  await expect(other.locator('.ws-notepad')).toHaveValue('');

  // Going around the app and asking the database directly returns nothing either
  const token = await supabaseToken(otherEmail);
  for (const table of ['trips', 'suppliers']) {
    const { body } = await supabaseSelect(token, `${table}?select=name`);
    expect(body.map(r => r.name), `${table} visible to another company`).toEqual([]);
  }
  const { body: orgs } = await supabaseSelect(token, 'organizations?select=name');
  expect(orgs.map(o => o.name)).toEqual(['Nosy Co']);
  // …and logged-out visitors get nothing at all
  const anon = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/trips?select=name`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } });
  expect(anon.ok ? await anon.json() : []).toEqual([]);
});

test('trip cards: cover photo, ⋯ menu to edit and delete', async ({ page }) => {
  await signUp(page, newEmail('cards'), 'Card Menu Co');

  // A trip with a cover photo
  await headerButton(page, 'Create trip').click();
  await page.locator('.ws-cover-field input[type=file]').setInputFiles('public/images/lake-varenna.jpg');
  const cover = page.locator('.ws-cover-field img');
  await expect(cover).toBeVisible();
  expect(await cover.evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([720, 300]);
  await button(dialog(page), 'Cancel').click();
  await createTrip(page, { name: 'Trip To Keep' });
  await headerButton(page, 'Edit trip').click();
  await page.locator('.ws-cover-field input[type=file]').setInputFiles('public/images/lake-varenna.jpg');
  await button(dialog(page), 'Save changes').click();
  await expectToast(page, 'Cover photo saved');

  await page.goto('/trips');
  await createTrip(page, { name: 'Trip To Delete' });
  await page.goto('/trips');
  const card = name => page.locator('.ws-card', { has: page.locator('h2', { hasText: name }) });
  await expect(card('Trip To Keep').locator('.ws-card-cover')).toBeVisible();

  // The ⋯ button opens the menu instead of the trip
  await card('Trip To Delete').getByRole('button', { name: 'Options for Trip To Delete' }).click();
  await expect(page).toHaveURL(/\/trips$/);
  await expect(page.locator('.ws-card-menu-list button')).toHaveText(['Edit trip', 'Delete trip']);
  await page.keyboard.press('Escape');
  await expect(page.locator('.ws-card-menu-list')).toHaveCount(0);

  // Edit from the menu
  await card('Trip To Keep').getByRole('button', { name: 'Options for Trip To Keep' }).click();
  await page.getByRole('menuitem', { name: 'Edit trip' }).click();
  await expect(field(dialog(page), 'Trip name')).toHaveValue('Trip To Keep');
  await setField(dialog(page), 'Travellers', '12');
  await button(dialog(page), 'Save changes').click();
  await expectToast(page, 'Trip saved');
  await expect(card('Trip To Keep')).toContainText('12 travellers');

  // Delete from the menu, for good
  await card('Trip To Delete').getByRole('button', { name: 'Options for Trip To Delete' }).click();
  await page.getByRole('menuitem', { name: 'Delete trip' }).click();
  await expectToast(page, 'Trip deleted');
  await page.reload();
  await expect(card('Trip To Delete')).toHaveCount(0);
  await expect(card('Trip To Keep')).toBeVisible();

  // Clicking anywhere else on a card (here: the progress bar) opens the trip
  const bar = await card('Trip To Keep').locator('.ws-progress').boundingBox();
  await page.mouse.click(bar.x + bar.width / 2, bar.y + bar.height / 2);
  await expect(page).toHaveURL(/\/trips\/[0-9a-f-]+$/);
});

test('export to CSV, then re-import the file into another trip', async ({ page }) => {
  await signUp(page, newEmail('export'), 'Export Test Co');
  await createTrip(page, { name: 'Export Trip' });
  await addSupplier(page, { name: 'Hotel Alpha', notes: 'Sea view, 10 rooms', deposit: { amount: '1000', due: '2027-05-01', paid: true }, balance: { amount: '2500.50' } });
  await addSupplier(page, { name: 'Beta Coaches', notes: 'Airport pickup', deposit: { amount: '400', due: '2027-05-01' } });

  // One trip, from its page
  let download = page.waitForEvent('download');
  await headerButton(page, 'Export').click();
  const tripFile = await download;
  expect(tripFile.suggestedFilename()).toMatch(/^roveboard-export-trip-\d{4}-\d{2}-\d{2}\.csv$/);
  await expectToast(page, 'Exported Export Trip (2 suppliers)');
  const csv = await readFile(await tripFile.path(), 'utf8');
  expect(csv.startsWith('﻿Trip,Trip start,Trip end,Travellers,Currency,Supplier name')).toBe(true);
  expect(csv).toContain('"Sea view, 10 rooms"');
  expect(csv).toContain(',1000,2027-05-01,Yes,2500.5,');

  // All trips, from the Trips page
  await page.goto('/trips');
  await createTrip(page, { name: 'Copy Trip' });
  await page.goto('/trips');
  download = page.waitForEvent('download');
  await headerButton(page, 'Export').click();
  const all = await readFile(await (await download).path(), 'utf8');
  expect(all).toContain('Export Trip');
  expect(all).toContain('Copy Trip');
  await expectToast(page, 'Exported 2 trips and 2 suppliers');

  // Re-import the first file into Copy Trip
  await page.locator('.ws-card h2', { hasText: 'Copy Trip' }).getByRole('link').click();
  await expect(page.locator('.ws-head h1')).toHaveText('Copy Trip');
  await headerButton(page, 'Import').click();
  await dialog(page).locator('textarea').fill(csv);
  await page.locator('.ws-dialog').getByRole('button', { name: /^Continue/ }).click();
  await expect(page.locator('.ws-import-summary b')).toHaveText('2 suppliers ready to import');
  await button(dialog(page), 'Import 2 suppliers').click();
  await expect(dialog(page)).toBeHidden();
  await page.reload();
  await expect(page.locator('.ws-sup b', { hasText: 'Hotel Alpha' })).toBeVisible();
  await expect(page.locator('.ws-sup b', { hasText: 'Beta Coaches' })).toBeVisible();
  await expect(moneyCell(page, 'Paid')).toHaveText('€1,000');
  await expect(moneyCell(page, 'Still owed')).toHaveText('€2,900.50');
});

test('sign-up answers are saved, and half-finished sign-ups can recover', async ({ page }) => {
  // Full wizard, with the optional answers
  const email = newEmail('answers');
  await page.goto('/login?mode=signup');
  await setField(page, 'Email', email);
  await setField(page, 'Password', PASSWORD);
  await button(page, 'Continue').click();
  await setField(page, 'Company name', 'Answers Co');
  await setField(page, 'What best describes', 'DMC');
  await setField(page, 'Group trips per year', '11–50');
  await setField(page, 'How did you hear', 'LinkedIn');
  await page.locator('.au-check', { hasText: 'Deposits and payment deadlines' }).locator('input').check();
  await page.locator('.au-check', { hasText: 'AI reading' }).locator('input').check();
  await button(page, 'Create workspace').click();
  await expect(page).toHaveURL(/\/trips$/);
  const { body: [org] } = await supabaseSelect(await supabaseToken(email), 'organizations?select=name,business_type,trips_per_year,interests,heard_from');
  expect(org).toEqual({ name: 'Answers Co', business_type: 'DMC', trips_per_year: '11–50', interests: ['Deposits and payment deadlines', 'AI reading of emails and contracts'], heard_from: 'LinkedIn' });
  await logOut(page);

  // Someone who quit after creating a login: signing up again finishes setup
  const halfway = newEmail('halfway');
  expect(await supabaseSignUpOnly(halfway)).toBe(true);
  await signUp(page, halfway, 'Recovered Co');
  await expect(page.locator('.ws-side-foot')).toContainText('Recovered Co');
  await logOut(page);

  // Same email with the wrong password: back to step 1 with a clear message
  await page.goto('/login?mode=signup');
  await setField(page, 'Email', halfway);
  await setField(page, 'Password', 'wrong-password-123');
  await button(page, 'Continue').click();
  await setField(page, 'Company name', 'Should Not Exist');
  await setField(page, 'What best describes', 'DMC');
  await setField(page, 'How did you hear', 'LinkedIn');
  await button(page, 'Create workspace').click();
  await expect(page.locator('.au-step')).toHaveText('Step 1 of 2');
  await expect(page.locator('.au-error')).toContainText('already an account with this email');

  // Someone who quit halfway and logs in instead: sent to step 2
  const loginHalfway = newEmail('login-halfway');
  expect(await supabaseSignUpOnly(loginHalfway)).toBe(true);
  await logIn(page, loginHalfway);
  await expect(page).toHaveURL(/\/onboarding$/);
  await setField(page, 'Company name', 'Late Finisher Co');
  await setField(page, 'What best describes', 'Travel agency');
  await setField(page, 'How did you hear', 'Other');
  await button(page, 'Create workspace').click();
  await expect(page).toHaveURL(/\/trips$/);
  await expect(page.locator('.ws-side-foot')).toContainText('Late Finisher Co');
});
