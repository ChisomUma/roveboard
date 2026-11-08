// End-to-end tests: a real browser clicks through Roveboard like a customer would.
// They run automatically on GitHub for every push and pull request (.github/workflows/tests.yml).
//
// The tests create accounts and data, so they must only ever run against a throwaway LOCAL
// Supabase (started with `npx supabase@2.122.0 start`), never the live database. The check below and
// tests/safety.setup.js enforce it.
//
// Run them on your computer (Docker must be running):
//   npx supabase@2.122.0 start
//   export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
//   export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<PUBLISHABLE_KEY from `npx supabase@2.122.0 status`>
//   npm run build && npm test
import { defineConfig, devices } from '@playwright/test';

const PORT = 3123; // 3000 is `npm run dev`; 3000–3002 can be taken by other local tools
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!/^http:\/\/(127\.0\.0\.1|localhost):54321\/?$/.test(url)) {
  throw new Error(
    `Tests must use a local Supabase (http://127.0.0.1:54321), not "${url || 'nothing'}". ` +
    'See the comment at the top of playwright.config.js.'
  );
}

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'safety', testMatch: /safety\.setup\.js/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['safety'] },
  ],
  webServer: {
    command: `npx next start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
