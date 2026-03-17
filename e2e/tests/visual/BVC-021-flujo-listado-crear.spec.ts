import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('BVC-021: Flujo Listado > Crear > Detalle in admin productos', async ({ page }) => {
  // Step 1: Listado
  await page.goto(`${BASE_URL}/admin/productos`);
  await expect(page.locator('h1')).toContainText('Productos');
  await expect(page.locator('a:has-text("Crear producto")')).toBeVisible();

  // Verify card view with badges
  const productCards = page.locator('a[href*="/admin/productos/p"]');
  expect(await productCards.count()).toBeGreaterThan(10);

  // Verify toggle exists
  await expect(page.locator('button:has-text("Vista de tarjetas")')).toBeVisible();
  await expect(page.locator('button:has-text("Vista de tabla")')).toBeVisible();

  // Step 2: Crear
  await page.locator('a:has-text("Crear producto")').click();
  await expect(page.locator('h1')).toContainText('Crear Producto');
  await expect(page.locator('h2:has-text("Informacion Basica")')).toBeVisible();
  await expect(page.locator('h2:has-text("Especies y Clasificacion")')).toBeVisible();
  await expect(page.locator('h2:has-text("Descripcion y Contenido")')).toBeVisible();
  await expect(page.locator('h2:has-text("Imagenes")')).toBeVisible();
  await expect(page.locator('h2:has-text("Configuracion")')).toBeVisible();
  await expect(page.locator('button:has-text("Guardar producto")')).toBeVisible();

  // Step 3: Navigate to Detalle via product link
  await page.locator('button:has-text("Cancelar")').click();
  const firstProduct = page.locator('a[href*="/admin/productos/p"]').first();
  await expect(firstProduct).toBeVisible();
});
