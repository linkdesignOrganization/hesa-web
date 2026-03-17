import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-026 - Catalogo por categoria via deep link
test.describe('UX-026: Catalogo por categoria', () => {

  test('farmacos muestra breadcrumb y filtros especificos', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    // Breadcrumb
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Catalogo' })).toBeVisible();
    // Filtros especificos por tipo
    await expect(page.getByRole('combobox').nth(0)).toBeVisible(); // Marca
    await expect(page.getByRole('combobox').nth(1)).toBeVisible(); // Especie
    await expect(page.getByRole('combobox').nth(2)).toBeVisible(); // Familia
    // Productos
    await expect(page.getByText('27 productos')).toBeVisible();
  });

  test('alimentos muestra productos y filtros', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/alimentos`);
    await expect(page.getByRole('heading', { name: 'Alimentos para Animales', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('productos')).toBeVisible();
  });

  test('equipos muestra productos y filtros', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/equipos`);
    await expect(page.getByRole('heading', { name: 'Equipos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('productos')).toBeVisible();
  });
});
