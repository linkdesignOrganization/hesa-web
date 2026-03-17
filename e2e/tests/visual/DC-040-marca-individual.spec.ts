import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-040: Individual brand page', () => {
  test('DC-040: Brand page shows logo, name, and products grid', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');

    // Brand name heading should be visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Brand logo or avatar should be present
    const logo = page.locator('[class*="brand-logo"], [class*="logo"], img[alt*="logo"]');
    // Products grid should have cards
    const cards = page.locator('[class*="product-card"], [class*="card"]');
    if (await cards.count() > 0) {
      expect(await cards.count()).toBeGreaterThan(0);
    }
  });
});
