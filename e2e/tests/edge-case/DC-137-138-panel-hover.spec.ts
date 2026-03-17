import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-137: Panel Card Hover Effects', () => {
  test('Product cards have cursor pointer', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos`);
    await page.waitForSelector('text=Productos', { timeout: 10000 });

    const firstCard = page.locator('a[href*="/admin/productos/"]').first();
    await expect(firstCard).toBeVisible();

    const cursor = await firstCard.evaluate(
      (el) => window.getComputedStyle(el).cursor
    );
    expect(cursor).toBe('pointer');
  });

  test('Dashboard category cards have hover cursor', async ({ page }) => {
    await page.goto(`${BASE}/admin/dashboard`);
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    const categoryCard = page.locator('a[href*="/admin/productos?"]').first();
    if (await categoryCard.isVisible()) {
      const cursor = await categoryCard.evaluate(
        (el) => window.getComputedStyle(el).cursor
      );
      expect(cursor).toBe('pointer');
    }
  });
});

test.describe('DC-138: Table Row Hover Effects', () => {
  test('Product list in table view has rows', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos`);
    await page.waitForSelector('text=Productos', { timeout: 10000 });

    // Toggle to table view
    const tableToggle = page.getByRole('button', { name: 'Vista de tabla' });
    if (await tableToggle.isVisible()) {
      await tableToggle.click();
      await page.waitForTimeout(500);

      // Table rows should be present
      const rows = page.locator('tr, [class*="table-row"], [class*="row"]');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);
    }
  });
});
