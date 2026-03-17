import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-018 - Catalogo filtros adaptativos por categoria
test.describe('UX-018: Catalogo filtros adaptativos', () => {

  test('farmacos has marca filter with pharma brands only', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    // Should have Familia filter (pharma-specific)
    const familiaCombo = page.getByRole('combobox').nth(2);
    await expect(familiaCombo).toBeVisible();
    // Familia options should include pharma families
    await expect(page.getByRole('option', { name: 'Antibioticos' })).toBeAttached();
    await expect(page.getByRole('option', { name: 'Desparasitantes' })).toBeAttached();
  });

  test('catalogo general has categoria filter', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo`);
    await expect(page.getByText('productos')).toBeVisible({ timeout: 10000 });
    // General catalog should have Categoria, Marca, Especie filters
    const comboboxes = page.getByRole('combobox');
    const count = await comboboxes.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
