// Shared steps for the end-to-end tests.
import { expect } from '@playwright/test';

export const PASSWORD = 'Test-password-2026!';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// A new email for every test run, so tests never collide.
export const newEmail = tag => `test-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@roveboard-test.com`;

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The input inside the <label> whose text starts with `label`.
export const field = (scope, label) =>
  scope.locator('label').filter({ hasText: new RegExp(`^\\s*${escape(label)}`) }).locator('input, select, textarea').first();

// The input labelled `label` inside the fieldset titled `legend` (e.g. Deposit → Amount).
export const fieldIn = (page, legend, label) =>
  page.locator('fieldset').filter({ has: page.locator('legend', { hasText: new RegExp(`^${escape(legend)}$`) }) })
    .locator('label').filter({ hasText: new RegExp(`^\\s*${escape(label)}`) }).locator('input').first();

export async function setField(scope, label, value) {
  const el = field(scope, label);
  if ((await el.evaluate(e => e.tagName)) === 'SELECT') await el.selectOption(value);
  else await el.fill(value);
}

export const button = (scope, name) => scope.getByRole('button', { name, exact: true });
export const headerButton = (page, name) => button(page.locator('.ws-head-actions'), name);
export const dialog = page => page.locator('.ws-dialog');

export async function expectToast(page, text) {
  await expect(page.locator('.ws-toast', { hasText: text })).toBeVisible();
}

export async function signUp(page, email, company, password = PASSWORD) {
  await page.goto('/login?mode=signup');
  await setField(page, 'Email', email);
  await setField(page, 'Password', password);
  await button(page, 'Continue').click();
  await setField(page, 'Company name', company);
  await setField(page, 'What best describes', 'Tour operator');
  await setField(page, 'How did you hear', 'Google search');
  await button(page, 'Create workspace').click();
  await expect(page).toHaveURL(/\/trips$/);
}

export async function logIn(page, email, password = PASSWORD) {
  await page.goto('/login');
  await setField(page, 'Email', email);
  await setField(page, 'Password', password);
  await button(page, 'Log in').click();
}

export async function logOut(page) {
  await button(page.locator('.ws-side-foot'), 'Log out').click();
  await expect(page).toHaveURL(/\/$/);
}

// Creates a trip from the Trips page or a trip page; ends on the new trip's page.
export async function createTrip(page, { name, start = '2027-06-01', end = '2027-06-07', travellers = '12' }) {
  await headerButton(page, 'Create trip').click();
  const d = dialog(page);
  await setField(d, 'Trip name', name);
  await setField(d, 'Start date', start);
  await setField(d, 'End date', end);
  await setField(d, 'Travellers', travellers);
  await button(d, 'Create trip').click();
  await expectToast(page, 'Trip created');
  await expect(page.locator('.ws-head h1')).toHaveText(name);
}

export async function addSupplier(page, { name, notes, contact, deposit, balance }) {
  await headerButton(page, 'Add supplier').click();
  const d = dialog(page);
  await setField(d, 'Supplier name', name);
  if (contact) await setField(d, 'Contact', contact);
  if (notes) await setField(d, 'Notes', notes);
  if (deposit) {
    await fieldIn(page, 'Deposit', 'Amount').fill(deposit.amount);
    if (deposit.due) await fieldIn(page, 'Deposit', 'Due date').fill(deposit.due);
    if (deposit.paid) await fieldIn(page, 'Deposit', 'Paid').check();
  }
  if (balance) {
    await fieldIn(page, 'Final balance', 'Amount').fill(balance.amount);
    if (balance.due) await fieldIn(page, 'Final balance', 'Due date').fill(balance.due);
  }
  await button(d, 'Add supplier').click();
  await expectToast(page, 'Supplier added');
  await expect(d).toBeHidden();
}

export const moneyCell = (page, label) => page.locator('.ws-money-grid > div', { has: page.locator('dt', { hasText: new RegExp(`^${label}$`) }) }).locator('dd');

// Talks to Supabase directly (as a signed-in user would) to check what the app saved.
export async function supabaseToken(email, password = PASSWORD) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  return r.ok ? (await r.json()).access_token : null;
}

// Creates a login with no company yet (someone who quit sign-up halfway).
export async function supabaseSignUpOnly(email, password = PASSWORD) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  return r.ok;
}

export async function supabaseSelect(token, path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } });
  return { status: r.status, body: await r.json() };
}
