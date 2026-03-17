import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-038 - Busqueda sin resultados
// test: UX-039 - Busqueda cargando
test.describe('UX-038/039: Busqueda overlay', () => {

  test('search overlay opens and shows min chars message', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    // Wait for home content to load
    await page.waitForTimeout(2000);
    // Click search button
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    // Search overlay visible
    await expect(page.getByPlaceholder('Buscar productos, marcas...')).toBeVisible();
    await expect(page.getByText('Escribe al menos 3 caracteres')).toBeVisible();
  });

  test('search with valid term shows results', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    const searchInput = page.getByPlaceholder('Buscar productos, marcas...');
    await searchInput.fill('Amox');
    // Should show results (products containing "Amox")
    await expect(page.getByText('Amoxicilina').first()).toBeVisible({ timeout: 5000 });
  });

  test('search with no matching term shows empty message', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Buscar productos y marcas' }).click();
    const searchInput = page.getByPlaceholder('Buscar productos, marcas...');
    await searchInput.fill('zzzzzznonexistent');
    // Should show no results message
    await expect(page.getByText(/no se encontr|sin resultados/i)).toBeVisible({ timeout: 5000 });
  });
});
