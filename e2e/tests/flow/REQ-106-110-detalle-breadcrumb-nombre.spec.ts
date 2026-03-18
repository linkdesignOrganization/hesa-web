import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-106 - Breadcrumb Inicio > Cat > Producto
// test: REQ-110 - Nombre del producto visible
// STATUS: FALLA - No hay productos en la base de datos. Los slugs del homepage son hardcoded y retornan
// "Product not found" de la API. El frontend redirige a /es/marcas en vez de mostrar un error state.

test.describe('REQ-106/110: Detalle producto - breadcrumb y nombre', () => {

  test('REQ-106: Producto existente muestra breadcrumb Inicio > Cat > Producto', async ({ page }) => {
    // Intentar navegar a un producto real
    // Actualmente no hay productos en la DB
    const response = await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);

    // La pagina deberia mostrar contenido del producto o error state
    // BUG: El frontend redirige silenciosamente a /es/marcas cuando el producto no se encuentra
    await page.waitForTimeout(8000);

    // Verificar si fue redirigido
    const currentUrl = page.url();
    if (currentUrl.includes('/marcas') || !currentUrl.includes('amoxicilina')) {
      // BUG: Auto-navegacion/redirect en lugar de error state
      expect(currentUrl).toContain('amoxicilina-250ml');
    }

    // Si permanece en la pagina, verificar breadcrumb
    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('Inicio')).toBeVisible();
    await expect(breadcrumb.getByText('Farmacos')).toBeVisible();
  });

  test('REQ-110: Nombre del producto es visible y prominente', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);

    // Esperar carga
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    if (!currentUrl.includes('amoxicilina')) {
      test.skip(true, 'Producto no existe en DB y el frontend redirige automaticamente');
      return;
    }

    const productName = page.locator('h1');
    await expect(productName).toBeVisible();
    await expect(productName).not.toBeEmpty();
  });
});
