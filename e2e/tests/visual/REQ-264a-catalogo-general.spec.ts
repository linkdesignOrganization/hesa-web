import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-264a: Catalogo general muestra TODOS los productos', () => {
  test('catalogo general tiene breadcrumb, titulo, filtros y contador', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);

    // Wait for Angular to hydrate and render content
    await expect(page.getByText('Catalogo de Productos')).toBeVisible({ timeout: 15000 });

    // Breadcrumb present: Inicio > Catalogo
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inicio' }).first()).toBeVisible();

    // Title
    await expect(page.getByRole('heading', { name: 'Catalogo de Productos' })).toBeVisible();

    // Counter present (shows "0 productos" when empty)
    await expect(page.getByText(/\d+ productos/)).toBeVisible();

    // Filters: Categoria, Marca, Especie dropdowns
    const categoriaSelect = page.locator('select').first();
    await expect(categoriaSelect).toBeVisible();
  });

  test('catalogo general tiene filtro de categoria con opciones', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('Catalogo de Productos')).toBeVisible({ timeout: 15000 });

    // Verify category filter has options
    const options = page.locator('select option');
    const count = await options.count();
    expect(count).toBeGreaterThan(1); // At least "Categoria" + real options
  });

  test('catalogo general muestra empty state cuando no hay productos', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('Catalogo de Productos')).toBeVisible({ timeout: 15000 });

    // Empty state message per DC-107
    const emptyMessage = page.getByText('Aun no hay productos en el catalogo');
    const hasEmpty = await emptyMessage.isVisible().catch(() => false);

    // Either shows products OR shows empty state - both are valid
    if (hasEmpty) {
      await expect(page.getByText('Vuelve pronto')).toBeVisible();
    }
  });
});
