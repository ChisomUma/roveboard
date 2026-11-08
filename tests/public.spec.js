// The public website and the sign-up/log-in screens, before anyone has an account.
import { test, expect } from '@playwright/test';
import { button, field, newEmail, PASSWORD, setField, supabaseToken } from './helpers';

test('landing page: "Sign up" is the main call to action', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.lp-nav');
  await expect(nav.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
  await expect(nav.getByRole('link', { name: 'Log in' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Sign up free' })).toHaveAttribute('href', '/login?mode=signup');
  await expect(page.locator('.lp-hero-copy .lp-btn')).toHaveAttribute('href', '/login?mode=signup');
  await expect(page.locator('body')).not.toContainText('Join the waitlist');
  await expect(page.locator('body')).not.toContainText('Try the demo');
  await expect(page.locator('.lp-faq details p').filter({ hasText: /^Plans start at £29/ })).toHaveCount(1);
  await expect(page.locator('.lp-foot a[href="/pricing"]')).toHaveCount(1);

  await page.locator('.lp-hero-copy .lp-btn').click();
  await expect(page).toHaveURL(/\/login\?mode=signup$/);
  await expect(page.locator('h1')).toHaveText('Create your account');
});

test('landing page: "Get product updates" saves an email', async ({ page }) => {
  await page.goto('/');
  const box = page.locator('.lp-updates');
  await expect(box).toContainText('Not ready yet?');
  await page.locator('#wl-email').fill(newEmail('updates'));
  await button(box, 'Get updates').click();
  await expect(page.locator('.lp-wl-done')).toContainText('You’re subscribed');
});

test('pricing: yearly first, monthly option, 20-day trial', async ({ page }) => {
  await page.goto('/pricing');
  const prices = () => page.locator('.pr-plan').evaluateAll(plans =>
    plans.map(p => `${p.querySelector('h3').textContent} ${p.querySelector('.pr-price b').textContent} ${p.querySelector('.pr-billed').textContent}`));

  await expect(page.locator('.pr-toggle .on')).toContainText('Yearly');
  await expect(page.locator('.pr-toggle .on')).toContainText('2 months free');
  expect(await prices()).toEqual(['Starter £29 Billed yearly at £350', 'Growth £70 Billed yearly at £840', 'Business £149 Billed yearly at £1,790']);
  await expect(page.locator('.pr-plan.is-popular h3')).toHaveText('Growth');
  await expect(page.locator('.pr-trips')).toHaveText(['Up to 10 trips a year', 'Up to 50 trips a year', 'Up to 200 trips a year']);
  const ctas = page.locator('.pr-cta');
  await expect(ctas).toHaveText(Array(3).fill('Start 20-day free trial'));
  for (const cta of await ctas.all()) await expect(cta).toHaveAttribute('href', '/login?mode=signup');

  const heights = await page.locator('.pr-plan').evaluateAll(plans => plans.map(p => Math.round(p.getBoundingClientRect().height)));
  expect(new Set(heights).size, `card heights ${heights}`).toBe(1);

  await button(page.locator('.pr-toggle'), 'Monthly').click();
  expect(await prices()).toEqual(['Starter £35 Billed monthly', 'Growth £84 Billed monthly', 'Business £179 Billed monthly']);
  await expect(page.locator('body')).toContainText('No credit card required');
  await expect(page.locator('body')).toContainText('won’t be charged automatically');
});

test('phone-sized screens have no sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/pricing', '/login?mode=signup']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} is ${overflow}px too wide`).toBeLessThanOrEqual(0);
  }
});

test('logged-out visitors are sent to log in', async ({ page }) => {
  for (const path of ['/trips', '/dashboard', '/deadlines', '/suppliers', '/notes', '/onboarding']) {
    await page.goto(path);
    await expect(page, `${path} should need login`).toHaveURL(/\/login/);
  }
});

test('log-in page shows only known error messages', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toHaveText('Welcome back');
  await expect(page.locator('.au-google')).toHaveCount(0); // Google appears once it's switched on in Supabase
  await page.goto('/login?error=signin');
  await expect(page.locator('.au-error')).toContainText('Sign-in didn’t complete');
  await page.goto('/login?error=constructor'); // a made-up code must not show anything
  await expect(page.locator('.au-error')).toHaveCount(0);
});

test('sign-up step 1 creates nothing; "Previous" keeps the details; required questions are enforced', async ({ page }) => {
  const email = newEmail('wizard');
  await page.goto('/login?mode=signup');
  await expect(page.locator('.au-step')).toHaveText('Step 1 of 2');
  await setField(page, 'Email', email);
  await setField(page, 'Password', PASSWORD);
  await button(page, 'Continue').click();

  await expect(page.locator('.au-step')).toHaveText('Step 2 of 2');
  await expect(page.locator('h1')).toHaveText('Tell us about your business');
  await expect(page.locator('.au-check em')).toHaveCount(3); // "Coming soon" labels
  expect(await supabaseToken(email), 'no account after step 1').toBeNull();

  await page.getByRole('button', { name: '← Previous' }).click();
  await expect(page.locator('.au-step')).toHaveText('Step 1 of 2');
  await expect(field(page, 'Email')).toHaveValue(email);

  await setField(page, 'Password', PASSWORD);
  await button(page, 'Continue').click();
  await setField(page, 'Company name', 'Half Filled Co');
  await button(page, 'Create workspace').click();
  await expect(page.locator('.au-step')).toHaveText('Step 2 of 2');
  expect(await supabaseToken(email), 'missing answers must not create an account').toBeNull();
});
