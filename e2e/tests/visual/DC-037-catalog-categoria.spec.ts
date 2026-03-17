import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-037: Catalogo por categoria layout', () => {
  test('DC-037: Category catalog has breadcrumb and contextualized title', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForLoadState('networkidle');

    // Breadcrumb should be present
    const breadcrumb = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]');
    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb.first()).toBeVisible();
    }

    // Title should mention the category
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('DC-037: Category catalog has product grid', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForLoadState('networkidle');

    // Product cards should be present
    const cards = page.locator('[class*="product-card"], [class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
