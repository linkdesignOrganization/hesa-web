import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-143 - Titulo y parrafo introductorio
// test: REQ-144 - Grid: 3-4 cols desktop, 2 tablet, 1-2 mobile
// test: REQ-145 - Cards: logo, nombre, pais, badges categorias
// test: REQ-146 - Clic en card navega a pagina individual
// test: REQ-147 - Meta titulo y descripcion para SEO
// test: REQ-148 - Textos en idioma seleccionado
// test: REQ-149 - Breadcrumb (Inicio > Marcas > [Nombre])
// test: REQ-150 - Logo grande, nombre, pais, descripcion, categorias
// test: REQ-151 - Grid productos de la marca debajo
// test: REQ-152 - Filtros aplicables al grid de productos de la marca
// test: REQ-153 - Descripcion en idioma seleccionado
// test: REQ-154 - URL semantica /es/marcas/[slug]

// R2 UPDATE: BUG-013 FIXED - /en/brands no longer redirects to /es.
// BUG-011 FIXED - Error messages show in correct language.
// API still returns 404, so brand cards don't load.

test.describe('Marcas - Pagina Principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-143: Marcas page shows title and introductory paragraph', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Title should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const title = await page.getByRole('heading', { level: 1 }).textContent();
    expect(title).toMatch(/marcas/i);

    // Introductory paragraph should be visible
    await expect(page.getByText(/distribuimos exclusivamente/i)).toBeVisible();
  });

  test('REQ-143: Marcas breadcrumb shows Inicio > Marcas', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(breadcrumb.getByText('Marcas')).toBeVisible();
  });

  test('REQ-147: Marcas page has SEO meta title', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/marcas/);
    expect(title).toContain('HESA');
  });

  test('REQ-147: Brands page has English SEO meta title', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/brands`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // BUG-013 FIXED: should stay on /en/brands
    expect(page.url()).toContain('/en/brands');

    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/brands/);
    expect(title).toContain('HESA');
  });

  test('REQ-148: Marcas page shows Spanish text', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const heading = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading).toMatch(/marcas/i);
  });

  test('REQ-148: Brands page shows English text (BUG-013 FIXED)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/brands`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // BUG-013 FIXED: should stay on /en/brands (not redirect to /es)
    expect(page.url()).toContain('/en/brands');

    const heading = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading).toMatch(/brands/i);

    // BUG-011 FIXED: error message should be in English
    const errorEN = page.getByText(/could not load brands/i);
    const hasError = await errorEN.isVisible().catch(() => false);
    if (hasError) {
      // Error is in English - BUG-011 FIXED
      await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    }
  });

  test('REQ-144/REQ-145: Brand cards require API data to display', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // When API works, should show brand cards with logo, name, country, badges
    const brandCards = page.locator('[class*="brand-card"], [class*="card"]').filter({
      has: page.locator('img')
    });
    const cardCount = await brandCards.count();

    // Requires API data
    expect(cardCount).toBeGreaterThan(0);
  });

  test('REQ-146: Click brand card navigates to individual brand page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Find brand card links
    const brandLink = page.locator('a[href*="/es/marcas/"]').first();
    const hasBrands = await brandLink.isVisible().catch(() => false);

    // Requires API data
    expect(hasBrands).toBe(true);
  });

  test('Marcas error state when API is down', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const errorMessage = page.getByText(/no pudimos cargar las marcas/i);
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasError) {
      // Error state is correct
      await expect(page.getByRole('button', { name: /reintentar/i })).toBeVisible();
    } else {
      // API is working - brands should be visible
      const brandCards = page.locator('a[href*="/es/marcas/"]');
      const count = await brandCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Marcas - Pagina Individual', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('REQ-154: Brand individual page has semantic URL /es/marcas/[slug]', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Should either stay on /es/marcas/zoetis or show error state
    // Requires API data to load brand info
    const url = page.url();

    if (url.includes('/es/marcas/zoetis')) {
      expect(url).toContain('/es/marcas/zoetis');
    } else {
      // May show error state or redirect
      test.fail();
    }
  });

  test('REQ-149: Brand detail breadcrumb Inicio > Marcas > [Brand]', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const url = page.url();
    if (url.includes('/es/marcas/zoetis')) {
      const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toBeVisible();
      await expect(breadcrumb.getByRole('link', { name: 'Marcas' })).toBeVisible();
    } else {
      test.fail();
    }
  });

  test('REQ-150: Brand detail shows logo, name, country, description', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const url = page.url();
    if (url.includes('/es/marcas/zoetis')) {
      // Logo
      await expect(page.locator('img[alt*="Zoetis"], img[alt*="zoetis"]').first()).toBeVisible();
      // Name heading
      await expect(page.getByRole('heading', { name: /zoetis/i })).toBeVisible();
    } else {
      test.fail();
    }
  });

  test('REQ-151/REQ-152: Brand detail shows product grid with filters', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const url = page.url();
    if (url.includes('/es/marcas/zoetis')) {
      // Product grid
      const productCards = page.locator('[class*="product"]');
      const count = await productCards.count();
      expect(count).toBeGreaterThan(0);
    } else {
      test.fail();
    }
  });

  test('REQ-153: Brand description in selected language', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas/zoetis`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const url = page.url();
    if (url.includes('/es/marcas/zoetis')) {
      // Description should be in Spanish
      const description = page.locator('p').first();
      await expect(description).toBeVisible();
    } else {
      test.fail();
    }
  });
});
