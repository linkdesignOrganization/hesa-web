import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: NFR-027 - GA4 code exists but is NOT active; prepared for activation via config
test('NFR-027: GA4 is not active (no gtag script loaded) but config exists in API', async ({ page, request }) => {
  // 1. Verify API has ga4 config fields
  const configResponse = await request.get(`${API_URL}/api/public/config`);
  expect(configResponse.status()).toBe(200);
  const config = await configResponse.json();

  // ga4Enabled should be false and ga4Id should be empty (not active)
  expect(config.ga4Enabled).toBe(false);
  expect(config.ga4Id).toBeFalsy();

  // 2. Verify no GA script is loaded on the page
  await page.goto(`${BASE_URL}/es`);
  await page.waitForTimeout(3000);

  // Check that no Google Analytics script is loaded
  const gaScripts = await page.locator('script[src*="googletagmanager.com/gtag"]').count();
  expect(gaScripts).toBe(0);

  // Check no dataLayer or gtag function is active
  const hasGtag = await page.evaluate(() => typeof (window as Record<string, unknown>)['gtag'] === 'function');
  expect(hasGtag).toBe(false);
});
