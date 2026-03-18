import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('REQ-127: Product with single image has no thumbnails', () => {
  test('Monitor (1 image) shows main image but no thumbnail strip', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/equipos/monitor-signos-vitales-vet`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Monitor');

    // Should NOT have thumbnail buttons (only shown when images.length > 1)
    const thumbs = page.locator('.product-detail__thumbs, .product-detail__thumb');
    await expect(thumbs).not.toBeVisible();
  });

  test('Amoxicilina (3 images) shows thumbnail strip', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Amoxicilina');

    // Should have thumbnail buttons (3 images)
    const thumbs = page.locator('.product-detail__thumb');
    await expect(thumbs.first()).toBeVisible({ timeout: 5000 });
    expect(await thumbs.count()).toBe(3);
  });
});

test.describe('REQ-128: Product without image shows placeholder visual', () => {
  test('Royal Canin Kitten (0 images) shows category-specific placeholder', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/alimentos/royal-canin-kitten`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Royal Canin Kitten');

    // Should show placeholder visual (SVG), not broken image icon
    const placeholder = page.locator('.product-detail__image-visual, .product-detail__main-image svg');
    await expect(placeholder).toBeVisible({ timeout: 5000 });

    // Should NOT have a broken <img> tag
    const brokenImages = page.locator('.product-detail__main-image img[src]');
    expect(await brokenImages.count()).toBe(0);
  });

  test('API confirms Royal Canin Kitten has empty images array', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/products`);
    const data = await response.json();
    const products = data.data || data;
    const kitten = products.find((p: any) =>
      (typeof p.slug === 'object' ? p.slug.es : p.slug) === 'royal-canin-kitten'
    );
    expect(kitten).toBeDefined();
    expect(kitten.images).toBeDefined();
    expect(kitten.images.length).toBe(0);
  });
});

test.describe('REQ-129: Empty type-specific fields do not generate blank areas', () => {
  test('Farmaco product hides absent alimentos fields (ingredients, nutritionalInfo)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/meloxicam-inyectable`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Meloxicam');

    // Farmaco should NOT show alimentos-specific fields
    const ingredients = page.locator('text=/[Ii]ngredientes principales/');
    await expect(ingredients).not.toBeVisible();

    const nutritional = page.locator('text=/[Ii]nformacion nutricional/');
    await expect(nutritional).not.toBeVisible();

    // But should show farmaco-specific fields
    const composition = page.locator('text=/[Cc]omposicion/');
    await expect(composition).toBeVisible({ timeout: 5000 });
  });

  test('Alimento product hides absent farmaco fields (composition, sanitaryRegistry)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/alimentos/royal-canin-kitten`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Royal Canin Kitten');

    // Alimento should NOT show farmaco-specific fields
    const composition = page.locator('text=/[Cc]omposicion$/');
    await expect(composition).not.toBeVisible();

    const sanitaryRegistry = page.locator('text=/[Rr]egistro sanitario/');
    await expect(sanitaryRegistry).not.toBeVisible();

    // But should show alimentos-specific fields
    const ingredients = page.locator('text=/[Ii]ngredientes/');
    await expect(ingredients).toBeVisible({ timeout: 5000 });
  });

  test('Equipo product hides absent farmaco and alimento fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/equipos/monitor-signos-vitales-vet`);
    await page.waitForSelector('h1', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Monitor');

    // Should NOT show farmaco fields
    const composition = page.locator('text=/[Cc]omposicion$/');
    await expect(composition).not.toBeVisible();

    // Should NOT show alimento fields
    const ingredients = page.locator('text=/[Ii]ngredientes principales/');
    await expect(ingredients).not.toBeVisible();

    // Should show equipo-specific fields
    const specs = page.locator('text=/[Ee]specificaciones/');
    await expect(specs).toBeVisible({ timeout: 5000 });
  });

  test('Source template uses @if guards for all type-specific fields', async () => {
    // Verify at code level that all fields are conditionally rendered
    const fs = require('fs');
    const templatePath = 'src/app/public/pages/product-detail/product-detail.component.html';
    const template = fs.readFileSync(templatePath, 'utf8');

    // All type-specific fields should be guarded
    expect(template).toContain('@if (product()!.composition)');
    expect(template).toContain('@if (product()!.sanitaryRegistry)');
    expect(template).toContain('@if (product()!.indications)');
    expect(template).toContain('@if (product()!.ingredients)');
    expect(template).toContain('@if (product()!.nutritionalInfo)');
    expect(template).toContain('@if (product()!.specifications)');
    expect(template).toContain('@if (product()!.recommendedUses)');
    expect(template).toContain('@if (product()!.warranty)');
  });
});
