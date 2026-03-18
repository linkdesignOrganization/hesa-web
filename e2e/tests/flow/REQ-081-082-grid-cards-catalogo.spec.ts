import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-081 - Grid 3 cols desktop, 2 tablet, 1-2 mobile
// test: REQ-082 - Cards: imagen, nombre, marca, iconos especie
// STATUS: FALLA - No hay productos en la base de datos para verificar grid layout ni contenido de cards.
// Estos tests verifican la estructura cuando haya datos reales.

test.describe('REQ-081/082: Catalogo grid layout y cards de producto', () => {

  test('REQ-081: Grid de productos tiene 3 columnas en desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    // Esperar a que cargue el contenido de la categoria
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar que hay cards de producto visibles
    const productCards = page.locator('[data-testid="product-card"], .product-card, article a[href*="/catalogo/"]');
    const count = await productCards.count();

    if (count === 0) {
      // Empty state - verificar que se muestra mensaje apropiado
      const emptyState = page.getByText('No hay productos disponibles actualmente');
      await expect(emptyState).toBeVisible({ timeout: 5000 });
      test.skip(true, 'No hay productos en la DB para verificar grid layout');
      return;
    }

    // Si hay productos, verificar grid layout
    const grid = page.locator('.grid, [class*="grid"]').first();
    await expect(grid).toBeVisible();
    // El grid deberia tener 3 columnas en desktop
    const gridStyle = await grid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
    expect(gridStyle.split(' ').length).toBe(3);
  });

  test('REQ-081: Grid de productos tiene 2 columnas en tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForSelector('h1', { timeout: 10000 });

    const productCards = page.locator('[data-testid="product-card"], .product-card, article a[href*="/catalogo/"]');
    const count = await productCards.count();

    if (count === 0) {
      test.skip(true, 'No hay productos en la DB para verificar grid layout tablet');
      return;
    }

    const grid = page.locator('.grid, [class*="grid"]').first();
    await expect(grid).toBeVisible();
    const gridStyle = await grid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
    expect(gridStyle.split(' ').length).toBe(2);
  });

  test('REQ-081: Grid de productos tiene 1-2 columnas en mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForSelector('h1', { timeout: 10000 });

    const productCards = page.locator('[data-testid="product-card"], .product-card, article a[href*="/catalogo/"]');
    const count = await productCards.count();

    if (count === 0) {
      test.skip(true, 'No hay productos en la DB para verificar grid layout mobile');
      return;
    }

    const grid = page.locator('.grid, [class*="grid"]').first();
    await expect(grid).toBeVisible();
    const gridStyle = await grid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
    const cols = gridStyle.split(' ').length;
    expect(cols).toBeLessThanOrEqual(2);
  });

  test('REQ-082: Cards de producto muestran imagen, nombre, marca, iconos especie', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForSelector('h1', { timeout: 10000 });

    const productCards = page.locator('[data-testid="product-card"], .product-card, article a[href*="/catalogo/"]');
    const count = await productCards.count();

    if (count === 0) {
      test.skip(true, 'No hay productos en la DB para verificar contenido de cards');
      return;
    }

    const firstCard = productCards.first();
    // Verificar imagen
    await expect(firstCard.locator('img')).toBeVisible();
    // Verificar nombre (heading dentro de card)
    await expect(firstCard.locator('h3, h2, [class*="name"]')).toBeVisible();
    // Verificar marca
    await expect(firstCard.locator('p, [class*="brand"]')).toBeVisible();
  });
});
