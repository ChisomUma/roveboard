// Roveboard on a phone: bottom tab bar, account menu, no sideways scrolling, tables as cards.
import { test, expect } from '@playwright/test';
import { addSupplier, createTrip, dialog, headerButton, newEmail, signUp } from './helpers';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('the workspace works on a phone', async ({ page }) => {
  await signUp(page, newEmail('phone'), 'Phone Test Co');

  // Bottom tab bar with labels; sidebar account details hidden until the account button is tapped
  const tabs = page.getByRole('navigation', { name: 'Workspace' });
  await expect(tabs.getByRole('link')).toHaveText(['Trips', 'Suppliers', 'Documents', 'Deadlines', 'Notes']);
  const box = await tabs.boundingBox();
  expect(box.y + box.height, 'tab bar sits at the bottom of the screen').toBeGreaterThan(800);
  await expect(page.locator('.ws-side-foot')).toBeHidden();

  // A trip with a supplier (long email to check wrapping)
  await createTrip(page, { name: 'Phone Trip' });
  await addSupplier(page, { name: 'Hotel With A Long Name', contact: 'reservations.department@a-very-long-hotel-domain.example.com', deposit: { amount: '500', due: '2027-05-01' } });

  // Supplier list becomes cards: labelled values, nothing wider than the screen
  await page.getByRole('tab', { name: 'Suppliers' }).click();
  const row = page.locator('.ws-stack tbody tr').first();
  await expect(row.locator('td[data-label="Contact"]')).toBeVisible();
  expect(await page.locator('.ws-stack').first().evaluate(t => t.scrollWidth - t.clientWidth)).toBeLessThanOrEqual(0);
  expect(await overflow(page)).toBeLessThanOrEqual(0);

  // Dialog buttons are on screen without scrolling (bottom sheet)
  await headerButton(page, 'Add supplier').click();
  const save = dialog(page).getByRole('button', { name: 'Add supplier', exact: true });
  await expect(save).toBeInViewport();
  await dialog(page).getByRole('button', { name: 'Cancel', exact: true }).click();

  // Every page fits the screen and the tab bar navigates
  for (const [label, url] of [['Suppliers', /\/suppliers$/], ['Deadlines', /\/deadlines$/], ['Documents', /\/documents$/], ['Notes', /\/notes$/], ['Trips', /\/trips$/]]) {
    await tabs.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(url);
    await expect(tabs.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    expect(await overflow(page), `${label} is wider than the screen`).toBeLessThanOrEqual(0);
  }

  // Account menu: company, email, Log out
  await page.getByRole('button', { name: 'Account' }).click();
  const menu = page.locator('.ws-side-foot');
  await expect(menu).toBeVisible();
  await expect(menu).toContainText('Phone Test Co');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: 'Account' }).click();
  await menu.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('form fields are 16px so iPhones don’t zoom in when tapped', async ({ page }) => {
  await page.goto('/login?mode=signup');
  for (const el of await page.locator('.au-form input, .au-form select').all()) {
    expect(await el.evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  }
});
