import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-076: Catalog Filters Edge Cases', () => {

  test('Filter by category updates product count and URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('47 productos')).toBeVisible();

    await page.getByRole('combobox').first().selectOption('Farmacos');
    await expect(page).toHaveURL(/category=farmacos/);
    await expect(page.getByText('27 productos')).toBeVisible();
  });

  test('Filter pills appear with remove button', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.getByRole('combobox').first().selectOption('Farmacos');
    await expect(page.getByText('farmacos')).toBeVisible();
    await expect(page.getByRole('button', { name: /Remover filtro/ })).toBeVisible();
  });

  test('Clear filters button resets all filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.getByRole('combobox').first().selectOption('Farmacos');
    await expect(page.getByText('27 productos')).toBeVisible();

    await page.getByRole('button', { name: 'Limpiar filtros' }).click();
    await expect(page.getByText('47 productos')).toBeVisible();
  });

  test('Adaptive filters appear for category (Familia for Farmacos)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    // Initially no Familia filter
    const familiaDropdown = page.getByRole('combobox').filter({ hasText: 'Familia' });
    await expect(familiaDropdown).not.toBeVisible();

    // Select Farmacos
    await page.getByRole('combobox').first().selectOption('Farmacos');
    // Familia filter should now appear
    await expect(page.locator('select').filter({ hasText: 'Familia' })).toBeVisible();
  });

  test('Brand dropdown filters adaptively when Farmacos selected (BUG-011 fix)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.getByText('Catalogo de Productos').waitFor({ state: 'visible' });

    // Initially Marca dropdown should have all 13 brands
    const marcaDropdown = page.locator('select').nth(1);
    const allBrandOptions = await marcaDropdown.locator('option').allTextContents();
    expect(allBrandOptions.length).toBeGreaterThanOrEqual(12); // 13 brands + "Marca" header

    // Select Farmacos category
    await page.getByRole('combobox').first().selectOption('Farmacos');

    // Now Marca dropdown should show only pharma brands (5 brands + header)
    const filteredBrandOptions = await marcaDropdown.locator('option').allTextContents();
    expect(filteredBrandOptions).toContain('Zoetis');
    expect(filteredBrandOptions).toContain('Virbac');
    expect(filteredBrandOptions).toContain('Bayer Animal Health');
    expect(filteredBrandOptions).toContain('Boehringer Ingelheim');
    expect(filteredBrandOptions).toContain('MSD Animal Health');
    // Equipment-only brands should NOT be present
    expect(filteredBrandOptions).not.toContain('Heine');
    expect(filteredBrandOptions).not.toContain('IMV Technologies');
    expect(filteredBrandOptions).not.toContain('Welch Allyn');
  });

  test('Pagination updates with filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('Mostrando 1-12 de 47 productos')).toBeVisible();

    await page.getByRole('combobox').first().selectOption('Farmacos');
    await expect(page.getByText('Mostrando 1-12 de 27 productos')).toBeVisible();
  });
});
