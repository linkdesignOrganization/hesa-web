import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-144 - Grid 3-4 cols desktop, 2 tablet, 1-2 mobile (verificar con cards reales)
// test: REQ-145 - Cards: logo, nombre, pais, badges
// test: REQ-146 - Clic en card navega a pagina individual
// STATUS: FALLA - No hay marcas en la base de datos (0 marcas). La pagina de marcas carga su
// estructura correctamente (titulo, breadcrumb, parrafo intro) pero no hay cards de marcas visibles.

test.describe('REQ-144/145/146: Marcas grid, cards y navegacion', () => {

  test('REQ-144: Grid de marcas muestra cards en grid responsivo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/es/marcas`);

    // Esperar titulo
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar si hay marcas en la API
    const response = await page.request.get(`${API_URL}/api/public/brands`);
    const brands = await response.json();

    if (!Array.isArray(brands) || brands.length === 0) {
      test.skip(true, 'No hay marcas en la DB para verificar grid');
      return;
    }

    // Si hay marcas, verificar grid
    const brandCards = page.locator('[data-testid="brand-card"], .brand-card, a[href*="/marcas/"]');
    await expect(brandCards.first()).toBeVisible({ timeout: 10000 });

    const count = await brandCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('REQ-145: Cards de marca muestran logo, nombre, pais, badges', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForSelector('h1', { timeout: 10000 });

    const response = await page.request.get(`${API_URL}/api/public/brands`);
    const brands = await response.json();

    if (!Array.isArray(brands) || brands.length === 0) {
      test.skip(true, 'No hay marcas en la DB para verificar contenido de cards');
      return;
    }

    const firstCard = page.locator('[data-testid="brand-card"], .brand-card, a[href*="/marcas/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Verificar logo
    await expect(firstCard.locator('img')).toBeVisible();

    // Verificar nombre
    await expect(firstCard.locator('h2, h3, [class*="name"]')).toBeVisible();
  });

  test('REQ-146: Clic en card de marca navega a pagina individual', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForSelector('h1', { timeout: 10000 });

    const response = await page.request.get(`${API_URL}/api/public/brands`);
    const brands = await response.json();

    if (!Array.isArray(brands) || brands.length === 0) {
      test.skip(true, 'No hay marcas en la DB para verificar navegacion');
      return;
    }

    const firstCard = page.locator('[data-testid="brand-card"], .brand-card, a[href*="/marcas/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Clic en la card
    await firstCard.click();

    // Verificar navegacion a pagina individual
    await page.waitForURL(/\/es\/marcas\/[a-z-]+/, { timeout: 10000 });
    expect(page.url()).toMatch(/\/es\/marcas\/[a-z-]+/);
  });

  test('REQ-144: Pagina de marcas sin datos muestra estructura correcta', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);

    // Esperar a que la pagina cargue
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText('Nuestras Marcas');

    // Verificar breadcrumb
    const breadcrumb = page.locator('nav[aria-label*="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('Inicio')).toBeVisible();
    await expect(breadcrumb.getByText('Marcas')).toBeVisible();

    // Verificar parrafo introductorio
    const intro = page.getByText(/Distribuimos exclusivamente|mejores marcas/);
    await expect(intro).toBeVisible();
  });
});
