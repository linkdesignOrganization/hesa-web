import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'https://gray-field-02ba8410f.2.azurestaticapps.net',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
