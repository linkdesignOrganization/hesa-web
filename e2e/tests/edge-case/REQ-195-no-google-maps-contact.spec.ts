import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-195: Contact page does NOT have Google Maps embedded', () => {
  test('no Google Maps iframe on contact page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    // No Google Maps iframe
    const googleMapsIframe = page.locator('iframe[src*="google.com/maps"], iframe[src*="maps.google"]');
    expect(await googleMapsIframe.count()).toBe(0);

    // No map container or map element
    const mapElement = page.locator('[class*="map"], #map');
    const mapCount = await mapElement.count();
    // Even if .map classes exist (e.g., .about-coverage__map on nosotros), they should NOT be on contact
    for (let i = 0; i < mapCount; i++) {
      const isGoogleMap = await mapElement.nth(i).evaluate((el) => {
        return el.querySelector('iframe') !== null;
      });
      expect(isGoogleMap).toBe(false);
    }
  });

  test('contact page shows info blocks with phone, email, address', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.locator('text=+506 2260-9020')).toBeVisible();
    await expect(page.locator('text=info@hesa.co.cr')).toBeVisible();
    await expect(page.locator('text=Heredia, Costa Rica')).toBeVisible();
  });
});
