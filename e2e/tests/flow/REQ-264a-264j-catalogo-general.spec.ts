import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-264a - Catalogo general muestra TODOS los productos
// test: REQ-264b - Filtro de "Categoria" adicional en catalogo general
// test: REQ-264c - Todos los filtros disponibles segun categoria
// test: REQ-264d - Filtros secundarios se adaptan dinamicamente
// test: REQ-264e - Breadcrumb: Inicio > Catalogo
// test: REQ-264f - Meta titulo y descripcion SEO optimizados
// test: REQ-264g - Link "Catalogo" en header enlaza a pagina general
// test: REQ-264h - Contador de productos se actualiza con filtros
// test: REQ-264i - Paginacion con 24 productos por pagina
// test: REQ-264j - Mobile: grid 1-2 cols, filtros colapsados

// R2 UPDATE: API still returns 404. Frontend calls production API (BUG-001 FIXED).
// Structural elements (breadcrumb, filters, title, counter) verified working.
// Data-dependent elements (products, pagination) still blocked by API.

test.describe('Catalogo General', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-264e: Breadcrumb shows Inicio > Catalogo', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(breadcrumb.getByText('Catalogo')).toBeVisible();
  });

  test('REQ-264b: General catalog has Categoria filter with correct options', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const categoryFilter = page.getByRole('combobox').first();
    await expect(categoryFilter).toBeVisible();

    const options = categoryFilter.getByRole('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('Farmacos');
    expect(optionTexts).toContain('Alimentos');
    expect(optionTexts).toContain('Equipos');
  });

  test('REQ-264c/REQ-264d: Filters adapt dynamically when selecting Farmacos', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Before selecting category: should have Categoria, Marca, Especie
    const comboboxes = page.getByRole('combobox');
    const initialCount = await comboboxes.count();
    expect(initialCount).toBe(3); // Categoria, Marca, Especie

    // Select Farmacos
    await comboboxes.first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // After selecting Farmacos: should have Categoria, Marca, Especie, Familia
    const updatedCount = await page.getByRole('combobox').count();
    expect(updatedCount).toBe(4);

    // Familia filter should be present with correct options
    const familiaFilter = page.getByRole('combobox').filter({ hasText: 'Familia' });
    await expect(familiaFilter).toBeVisible();

    const familiaOptions = familiaFilter.getByRole('option');
    const texts = await familiaOptions.allTextContents();
    expect(texts).toContain('Antibioticos');
    expect(texts).toContain('Desparasitantes');
    expect(texts).toContain('Vitaminas');
  });

  test('REQ-264d: Filters adapt for Alimentos category', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Alimentos
    await page.getByRole('combobox').first().selectOption('Alimentos');
    await page.waitForTimeout(1000);

    // Should show Etapa de vida filter instead of Familia
    const etapaFilter = page.getByRole('combobox').filter({ hasText: /etapa/i });
    await expect(etapaFilter).toBeVisible();
  });

  test('REQ-264d: Filters adapt for Equipos category', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Equipos
    await page.getByRole('combobox').first().selectOption('Equipos');
    await page.waitForTimeout(1000);

    // Should show Tipo filter
    const tipoFilter = page.getByRole('combobox').filter({ hasText: /tipo/i });
    await expect(tipoFilter).toBeVisible();
  });

  test('REQ-264f: Meta titulo for general catalog is SEO optimized', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const title = await page.title();
    expect(title).toContain('Catalogo');
    expect(title).toContain('HESA');
  });

  test('REQ-264f: English catalog meta title is SEO optimized', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const title = await page.title();
    expect(title).toContain('Catalog');
    expect(title).toContain('HESA');
  });

  test('REQ-264g: Header Catalogo link goes to general catalog page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const catalogLink = page.getByRole('navigation', { name: 'Navegacion principal' })
      .getByRole('link', { name: 'Catalogo' }).first();
    await expect(catalogLink).toHaveAttribute('href', '/es/catalogo');
  });

  test('REQ-264g: English header Catalog link goes to general catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');

    const catalogLink = page.getByRole('navigation', { name: 'Navegacion principal' })
      .getByRole('link', { name: 'Catalog' }).first();
    await expect(catalogLink).toHaveAttribute('href', '/en/catalog');
  });

  test('REQ-264h: Product counter shows number of products', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Counter should be visible showing "X productos"
    await expect(page.getByText(/\d+ productos/)).toBeVisible();

    // When API works, counter should show > 0
    const counterText = await page.getByText(/(\d+) productos/).textContent();
    const count = parseInt(counterText?.match(/(\d+)/)?.[1] || '0');
    // This will fail when API is down (shows 0 products)
    expect(count).toBeGreaterThan(0);
  });

  test('REQ-264a: General catalog shows all products', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should show products (requires API data)
    const productCards = page.locator('[class*="product-card"], [class*="card"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('REQ-264i: Pagination with 24 products per page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When there are more than 24 products, pagination should appear
    // Requires API data
    const pagination = page.locator('[class*="pagination"], nav[aria-label*="paginacion"]');
    const hasPagination = await pagination.isVisible().catch(() => false);

    // If enough products exist, pagination should be visible
    // This depends on having > 24 products in the API
    if (hasPagination) {
      // Verify max 24 products per page
      const productCards = page.locator('[class*="product-card"]');
      const count = await productCards.count();
      expect(count).toBeLessThanOrEqual(24);
    }
  });

  test('REQ-264j: Mobile - filters collapsed into Filtrar button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // On mobile, filters should be collapsed into a single "Filtrar" button
    const filtrarButton = page.getByText(/filtrar/i);
    await expect(filtrarButton).toBeVisible();
  });

  test('REQ-264j: Desktop - filters visible as dropdowns', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // On desktop, filter dropdowns should be directly visible
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });

  test('REQ-264e: English breadcrumb shows Home > Catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumb.getByText('Catalog')).toBeVisible();
  });

  test('REQ-264c/REQ-264d: Filter pills appear and can be removed', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Farmacos
    await page.getByRole('combobox').first().selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Should show filter pill with X to remove
    const pill = page.getByText('farmacos').first();
    await expect(pill).toBeVisible();

    // Should have remove button
    const removeButton = page.getByRole('button', { name: /remover filtro/i });
    await expect(removeButton).toBeVisible();

    // Should have "Limpiar filtros" button
    await expect(page.getByRole('button', { name: /limpiar filtros/i })).toBeVisible();

    // URL should have query params
    expect(page.url()).toContain('category=farmacos');
  });
});
