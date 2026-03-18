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

test.describe('Catalogo General', () => {
  test('REQ-264e: Breadcrumb shows Inicio > Catalogo (no category)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(breadcrumb.getByText('Catalogo')).toBeVisible();
  });

  test('REQ-264b: General catalog has Categoria filter dropdown', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    // General catalog should have a "Categoria" dropdown with Farmacos, Alimentos, Equipos
    const categoryFilter = page.getByRole('combobox').filter({ hasText: 'Categoria' });
    await expect(categoryFilter).toBeVisible();

    // Check options exist
    const options = categoryFilter.getByRole('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('Farmacos');
    expect(optionTexts).toContain('Alimentos');
    expect(optionTexts).toContain('Equipos');
  });

  test('REQ-264f: Meta titulo for general catalog is SEO optimized', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toContain('Catalogo');
    expect(title).toContain('HESA');
  });

  test('REQ-264g: Header Catalogo link goes to general catalog page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    // The header "Catalogo" link should point to /es/catalogo
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

    // Counter should be visible showing "X productos"
    await expect(page.getByText(/\d+ productos/)).toBeVisible();
  });

  test('REQ-264j: Mobile - filters collapsed into Filtrar button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    // On mobile, filters should be collapsed into a single "Filtrar" button
    await expect(page.getByText('Filtrar')).toBeVisible();
  });

  test('REQ-264j: Desktop - filters visible as dropdowns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');

    // On desktop, filter dropdowns should be directly visible
    await expect(page.getByRole('combobox').filter({ hasText: 'Categoria' })).toBeVisible();
    await expect(page.getByRole('combobox').filter({ hasText: 'Marca' })).toBeVisible();
    await expect(page.getByRole('combobox').filter({ hasText: 'Especie' })).toBeVisible();
  });

  test('REQ-264e: English breadcrumb shows Home > Catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog`);
    await page.waitForLoadState('networkidle');

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumb.getByText('Catalog')).toBeVisible();
  });
});
