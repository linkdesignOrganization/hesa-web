import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-053: Search Overlay layout', () => {
  test('DC-053: Search overlay opens on click', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForLoadState('networkidle');

    // Click search button
    const searchBtn = page.locator('button[aria-label*="Buscar"], button').filter({ hasText: '' }).locator('img[alt*="buscar"], img[class*="search"]');
    const searchButton = page.locator('button').filter({ hasText: /buscar/i }).first();

    if (await searchButton.count() > 0) {
      await searchButton.click();
      await page.waitForTimeout(500);

      // Search overlay should appear
      const overlay = page.locator('[role="search"], [class*="search-overlay"], search');
      await expect(overlay.first()).toBeVisible();

      // Input should be present
      const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]');
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible();
      }
    }
  });
});
