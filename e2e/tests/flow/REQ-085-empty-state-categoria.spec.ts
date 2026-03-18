import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-085 - Estado vacio si categoria sin productos
// STATUS: PASA - La pagina de categoria muestra "No hay productos disponibles actualmente" cuando no hay productos.
// El catalogo general muestra "Aun no hay productos en el catalogo" con icono y texto descriptivo.

test.describe('REQ-085: Empty state en catalogo de categoria', () => {

  test('REQ-085: Categoria sin productos muestra empty state correcto en ES', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);

    // Esperar a que cargue el titulo de la categoria
    const heading = page.locator('h1');
    await expect(heading).toContainText('Farmacos', { timeout: 10000 });

    // Verificar que muestra "0 productos"
    await expect(page.getByText('0 productos')).toBeVisible();

    // Verificar empty state message
    const emptyMessage = page.getByText('No hay productos disponibles actualmente');
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });

  test('REQ-085: Catalogo general sin productos muestra empty state con icono', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);

    const heading = page.locator('h1');
    await expect(heading).toContainText('Catalogo de Productos', { timeout: 10000 });

    // Verificar empty state
    const emptyTitle = page.getByText('Aun no hay productos en el catalogo');
    await expect(emptyTitle).toBeVisible({ timeout: 5000 });

    const emptyDesc = page.getByText('Vuelve pronto, estamos preparando nuestro catalogo');
    await expect(emptyDesc).toBeVisible();

    // Verificar que hay un icono/imagen en el empty state
    const emptyIcon = page.locator('h2:has-text("Aun no hay productos")').locator('..').locator('img, svg');
    await expect(emptyIcon).toBeVisible();
  });

  test('REQ-085: Empty state en EN muestra texto en ingles', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog/pharmaceuticals`);

    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Verificar empty state en ingles
    const emptyMessage = page.getByText(/no products available|no hay productos/i);
    await expect(emptyMessage).toBeVisible({ timeout: 5000 });
  });
});
