// Runs before every other test. The Supabase address is baked into the site when it's built, so a
// site built with the live keys (.env.local) would send test sign-ups to the live database.
// This opens the built site and stops everything unless it talks to the local test Supabase.
import { test as setup, expect } from '@playwright/test';

setup('the site under test uses the local Supabase, not the live one', async ({ page, request }) => {
  await page.goto('/login');
  const scripts = await page.locator('script[src]').evaluateAll(els => els.map(e => e.src));
  let code = '';
  for (const src of scripts) code += await (await request.get(src)).text();
  // A hosted project address looks like https://abcdefgh.supabase.co (the library itself mentions "*.supabase.co").
  expect(/https:\/\/[a-z0-9-]+\.supabase\.co/.test(code),'The site was built with the LIVE Supabase keys. Rebuild it with the local ones (see playwright.config.js).').toBe(false);
  expect(code.includes(process.env.NEXT_PUBLIC_SUPABASE_URL), 'The site was built without the local Supabase address. Rebuild it (see playwright.config.js).').toBe(true);
});
