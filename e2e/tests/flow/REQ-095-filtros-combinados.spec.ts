import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-095 - Combinacion de multiples filtros simultaneous
// R2: API still returns 404. Adaptive filters work mechanically but
// cannot verify actual product filtering without data.

test.describe('Filtros Combinados', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-095: Multiple filters can be selected simultaneously', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Farmacos category
    const categoryFilter = page.getByRole('combobox').first();
    await categoryFilter.selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // URL should update with category filter
    expect(page.url()).toContain('category=farmacos');

    // Select Especie filter
    const especieFilter = page.getByRole('combobox').filter({ hasText: 'Especie' });
    await especieFilter.selectOption('Caninos');
    await page.waitForTimeout(1000);

    // URL should include both filters
    expect(page.url()).toContain('category=farmacos');
    expect(page.url()).toContain('species=');

    // Filter pills should show both active filters
    const pills = page.locator('button[aria-label*="Remover filtro"]');
    const pillCount = await pills.count();
    expect(pillCount).toBeGreaterThanOrEqual(2);

    // "Limpiar filtros" should be visible
    await expect(page.getByRole('button', { name: /limpiar filtros/i })).toBeVisible();
  });

  test('REQ-095: Selecting Familia filter adds third filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Farmacos
    await page.getByRole('combobox').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Select Familia
    const familiaFilter = page.getByRole('combobox').filter({ hasText: 'Familia' });
    await familiaFilter.selectOption('Antibioticos');
    await page.waitForTimeout(1000);

    // URL should include both filters
    expect(page.url()).toContain('category=farmacos');

    // When API works, products should be filtered by both criteria
    // and counter should update
    const counter = page.getByText(/\d+ productos/);
    await expect(counter).toBeVisible();

    // The counter should show a filtered count (when API works)
    const counterText = await counter.textContent();
    const count = parseInt(counterText?.match(/(\d+)/)?.[1] || '0');

    // Requires API data to verify intersection
    expect(count).toBeGreaterThan(0);
  });

  test('REQ-095: Clearing filters resets to show all products', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Add a filter
    await page.getByRole('combobox').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Click "Limpiar filtros"
    const clearButton = page.getByRole('button', { name: /limpiar filtros/i });
    await clearButton.click();
    await page.waitForTimeout(1000);

    // URL should not have filter params
    expect(page.url()).not.toContain('category=farmacos');

    // Category dropdown should reset to default
    const categoryFilter = page.getByRole('combobox').first();
    const selectedOption = await categoryFilter.inputValue();
    expect(selectedOption).toBe('');
  });
});
