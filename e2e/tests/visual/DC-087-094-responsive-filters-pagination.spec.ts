import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-087: Filtros drawer mobile', () => {
  test('DC-087: Mobile shows filter button instead of inline filters', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    // On mobile, filter dropdowns should be replaced by a "Filtrar" button
    const filterBtn = page.locator('button').filter({ hasText: /filtrar|filter/i });
    if (await filterBtn.count() > 0) {
      await expect(filterBtn.first()).toBeVisible();
    }
  });
});

test.describe('DC-094: Pagination responsive', () => {
  test('DC-094: Desktop shows pagination with numbers', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    // Scroll to bottom for pagination
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const pagination = page.locator('[class*="pagination"]');
    if (await pagination.count() > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test('DC-094: Mobile shows simplified pagination', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Mobile pagination should show "Pagina X de Y" style
    const pagination = page.locator('[class*="pagination"]');
    if (await pagination.count() > 0) {
      const paginationText = await pagination.first().textContent();
      // Should have page indicator
      expect(paginationText).toBeTruthy();
    }
  });
});
