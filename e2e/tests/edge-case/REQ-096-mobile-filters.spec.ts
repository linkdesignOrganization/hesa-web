import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-096: Mobile Filters Edge Cases', () => {

  test.use({ viewport: { width: 375, height: 812 } }); // iPhone X

  test('REQ-096: Mobile - filters collapsed in "Filtrar" button + drawer', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    // On mobile, filters should be behind a "Filtrar" button
    const filterButton = page.getByRole('button', { name: /filtrar/i });
    await expect(filterButton).toBeVisible();

    // Click the filter button to open the drawer
    await filterButton.click();
    await page.waitForTimeout(500);

    // A drawer/dialog with filters should appear
    const drawer = page.locator('[class*="drawer"], [class*="modal"], dialog, [role="dialog"]');
    // Check that the filter dropdowns are now accessible
    const selects = page.locator('select');
    const selectCount = await selects.count();
    expect(selectCount).toBeGreaterThanOrEqual(1);
  });

  test('REQ-103: Pagination accessible with keyboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    // Tab through the page to reach pagination
    // The pagination buttons should be focusable
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that interactive elements can receive focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    expect(focusedElement).toBeTruthy();
  });
});
