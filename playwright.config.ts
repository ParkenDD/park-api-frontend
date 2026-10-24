import { defineConfig, devices } from '@playwright/test';

// Without BASE_URL, the tests run against the production build served by vite preview. CI sets it to the container
// image instead, so that the nginx configuration is tested along with the app. Either way, every request to ParkAPI and
// to the tile server is answered by the fixtures in tests/fixtures.ts, so the tests need no network.
const port = 4173;
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    // The browser asks for German unless a test says otherwise; tests/language.spec.ts covers English.
    locale: 'de-DE',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run preview -- --port ${port} --strictPort`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
