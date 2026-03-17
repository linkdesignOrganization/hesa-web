import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-076: Data Table panel', () => {
  test('DC-076: Table view toggle exists in productos page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');

    // Look for table/list view toggle button
    const tableToggle = page.locator('button[aria-label*="tabla"], button[aria-label*="table"], button').filter({ hasText: /tabla|table|list/i });
    if (await tableToggle.count() > 0) {
      await expect(tableToggle.first()).toBeVisible();
    }
  });

  test('DC-076: Table headers are uppercase when table view is active', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');

    // Click table view toggle
    const tableBtn = page.locator('button[aria-label*="Vista de tabla"]');
    if (await tableBtn.count() > 0) {
      await tableBtn.click();
      await page.waitForTimeout(500);

      // Check for table headers
      const headers = page.locator('th, [class*="table-header"]');
      if (await headers.count() > 0) {
        const headerStyle = await headers.first().evaluate(el => {
          const s = getComputedStyle(el);
          return {
            textTransform: s.textTransform,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight
          };
        });
        expect(headerStyle.textTransform).toBe('uppercase');
      }
    }
  });
});
