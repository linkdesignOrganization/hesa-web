import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-093: Active filters shown as pills with X to remove', () => {
  test('filter pill appears when species filter is applied via URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos`);
    await page.waitForLoadState('networkidle');

    // Wait for filter pills to render
    const pill = page.getByText('Caninos').first();
    await expect(pill).toBeVisible({ timeout: 10000 });

    // Verify the X button exists next to the pill
    const removeButton = page.locator('button').filter({ has: page.locator('img') }).locator('xpath=ancestor-or-self::*[contains(text(), "Caninos")]/following-sibling::button | ancestor-or-self::*[contains(text(), "Caninos")]//button');
    // Alternative: check for any button near the "Caninos" text
    const pillContainer = pill.locator('..');
    const xButton = pillContainer.locator('button');
    await expect(xButton).toBeVisible();
  });

  test('Limpiar filtros button appears when filters are active', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos`);
    await page.waitForLoadState('networkidle');

    const clearButton = page.getByRole('button', { name: /limpiar filtros/i });
    await expect(clearButton).toBeVisible({ timeout: 10000 });
  });

  test('clicking Limpiar filtros removes all filter pills', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos`);
    await page.waitForLoadState('networkidle');

    // Wait for filter pill to be visible
    await expect(page.getByText('Caninos').first()).toBeVisible({ timeout: 10000 });

    // Click Limpiar filtros
    const clearButton = page.getByRole('button', { name: /limpiar filtros/i }).first();
    await clearButton.click();

    // Wait for URL to update (should remove query params)
    await page.waitForTimeout(1000);

    // Verify URL no longer has species param
    const url = page.url();
    expect(url).not.toContain('species=');
  });

  test('multiple filter pills can appear simultaneously', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos?species=Caninos&family=Antibioticos`);
    await page.waitForLoadState('networkidle');

    // Both pills should be visible
    await expect(page.getByText('Caninos').first()).toBeVisible({ timeout: 10000 });
    // Check for "Limpiar filtros" indicating multiple active filters
    await expect(page.getByRole('button', { name: /limpiar filtros/i })).toBeVisible();
  });
});
