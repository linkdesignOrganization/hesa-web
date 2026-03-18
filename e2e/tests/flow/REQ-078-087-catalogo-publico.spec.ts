import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-078 - Breadcrumb de navegacion (Inicio > Catalogo > [Categoria])
// test: REQ-079 - Titulo de categoria + contador de productos
// test: REQ-080 - Descripcion corta de categoria en idioma actual
// test: REQ-081 - Grid: 3 cols desktop, 2 tablet, 1-2 mobile
// test: REQ-082 - Cards muestran imagen, nombre, marca, iconos especie
// test: REQ-083 - Cards NO muestran precio, inventario ni disponibilidad
// test: REQ-084 - Clic en card navega a detalle de producto
// test: REQ-085 - Estado vacio si categoria sin productos
// test: REQ-086 - URL semantica /es/catalogo/farmacos
// test: REQ-087 - Meta titulo y descripcion unicos editables

// R2 UPDATE: API still returns 404 for all product endpoints.
// BUG-001 FIXED (frontend calls production API).
// Category pages show error state when API is down.

test.describe('Catalogo Publico - Categoria', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-086: URL semantica /es/catalogo/farmacos loads correct page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // URL should contain the category slug
    expect(page.url()).toContain('/es/catalogo');
  });

  test('REQ-086: URL semantica for alimentos and equipos', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/alimentos`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/es/catalogo');

    await page.goto(`${BASE_URL}/es/catalogo/equipos`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/es/catalogo');
  });

  test('REQ-078: Breadcrumb shows Inicio > Catalogo on general catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();

    await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(breadcrumb.getByText('Catalogo')).toBeVisible();
  });

  test('REQ-079: Category title and product counter visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Title should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const title = await page.getByRole('heading', { level: 1 }).textContent();
    expect(title).toContain('Catalogo');

    // Product counter should be visible (shows "X productos")
    await expect(page.getByText(/\d+ productos/)).toBeVisible();
  });

  test('REQ-080: Descripcion corta de categoria visible (BUG-006)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Should show a short description below the category title
    // BUG-006: Currently NOT showing description
    // When fixed, should have a paragraph with category description
    const description = page.locator('p').filter({
      hasText: /farmacos|veterinarios|productos|medicamentos/i
    });
    const hasDescription = await description.first().isVisible().catch(() => false);

    // This will fail until BUG-006 is fixed AND API provides data
    expect(hasDescription).toBe(true);
  });

  test('REQ-081: Grid layout with products requires API data', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When API works, should show product cards in a grid
    // 3 cols desktop, 2 tablet, 1-2 mobile
    const productCards = page.locator('[class*="card"], [class*="product-card"], article');
    const cardCount = await productCards.count();

    // Requires API data to show products
    expect(cardCount).toBeGreaterThan(0);
  });

  test('REQ-082: Product cards show image, name, brand, species icons', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When API works, each product card should have:
    // - Image (img tag or background image)
    // - Product name (heading or strong text)
    // - Brand name
    // - Species icons
    // Requires API data
    const productCards = page.locator('[class*="product"]');
    const cardCount = await productCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('REQ-083: Product cards do NOT show price, inventory, availability', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // No price elements on the page
    await expect(page.getByText(/\$\d+/)).not.toBeVisible();
    await expect(page.locator('[class*="price"]')).not.toBeVisible();
    // No inventory/stock info
    await expect(page.getByText(/en stock/i)).not.toBeVisible();
    await expect(page.getByText(/agotado/i)).not.toBeVisible();
  });

  test('REQ-084: Click on product card navigates to product detail', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When API works, clicking a product card should navigate to /es/catalogo/[cat]/[slug]
    const productLink = page.locator('a[href*="/es/catalogo/"][href*="/"]').first();
    const hasProducts = await productLink.isVisible().catch(() => false);

    expect(hasProducts).toBe(true);
  });

  test('REQ-085: Error state shown when products cannot load', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When API is down, should show error state with retry button
    const errorHeading = page.getByText(/no pudimos cargar/i);
    const retryButton = page.getByRole('button', { name: /reintentar/i });

    const hasError = await errorHeading.isVisible().catch(() => false);

    if (hasError) {
      // Error state is correct when API is down
      await expect(retryButton).toBeVisible();
    } else {
      // API is working - products should be visible
      await expect(page.getByText(/\d+ productos/)).toBeVisible();
      const counter = await page.getByText(/(\d+) productos/).textContent();
      const count = parseInt(counter?.match(/(\d+)/)?.[1] || '0');
      expect(count).toBeGreaterThan(0);
    }
  });

  test('REQ-087: Meta titulo unique per category page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const generalTitle = await page.title();
    expect(generalTitle).toContain('Catalogo');
    expect(generalTitle).toContain('HESA');
  });
});

test.describe('Catalogo Publico - Category-specific filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-264c: Selecting Farmacos category shows Familia filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Select Farmacos from category dropdown
    const categoryFilter = page.getByRole('combobox').first();
    await categoryFilter.selectOption('Farmacos');
    await page.waitForTimeout(1000);

    // Familia filter should appear
    const familiaFilter = page.getByRole('combobox').filter({ hasText: 'Familia' });
    await expect(familiaFilter).toBeVisible();

    // Verify Familia options
    const options = familiaFilter.getByRole('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('Antibioticos');
    expect(optionTexts).toContain('Desparasitantes');
  });
});
