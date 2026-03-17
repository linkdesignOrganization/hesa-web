import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-032: Seccion Marcas Destacadas visible en homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('seccion marcas es visible (opacity != 0, no hidden)', async ({ page }) => {
    // Scroll hasta la seccion de marcas
    const marcasHeading = page.getByRole('heading', { name: 'Marcas Destacadas', level: 2 });
    await expect(marcasHeading).toBeVisible({ timeout: 15000 });

    // Verificar que la seccion existe y es visible
    const marcasSection = marcasHeading.locator('..');
    await expect(marcasSection).toBeVisible();
  });

  test('seccion marcas muestra 8 logos de marcas', async ({ page }) => {
    const marcasHeading = page.getByRole('heading', { name: 'Marcas Destacadas', level: 2 });
    await marcasHeading.scrollIntoViewIfNeeded();

    // Verificar que existen 8 items de marcas
    const brandsList = page.locator('text=Marcas Destacadas').locator('..').locator('ul li, [role="listitem"]');

    // Esperar a que los logos aparezcan
    await expect(brandsList.first()).toBeVisible({ timeout: 10000 });

    // Debe haber al menos 8 marcas
    const count = await brandsList.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('marcas tienen nombres correctos', async ({ page }) => {
    const expectedBrands = [
      'Zoetis',
      'Royal Canin',
      'MSD Animal Health',
      'Purina Pro Plan',
      'Boehringer Ingelheim',
      'Hills Pet Nutrition',
      'Bayer Animal Health',
      'Virbac'
    ];

    for (const brand of expectedBrands) {
      await expect(page.getByText(brand).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('seccion tiene link "Ver todas las marcas"', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Ver todas las marcas' });
    await expect(link).toBeVisible({ timeout: 10000 });
    await expect(link).toHaveAttribute('href', '/es/marcas');
  });

  test('seccion tiene subtitulo descriptivo', async ({ page }) => {
    await expect(
      page.getByText('Distribuimos las mejores marcas internacionales de salud animal')
    ).toBeVisible({ timeout: 10000 });
  });

  test('logos de marcas son clickables', async ({ page }) => {
    const firstBrand = page.getByRole('listitem', { name: /Ver productos de Zoetis/ });
    await expect(firstBrand).toBeVisible({ timeout: 10000 });
    // Verificar que tiene cursor pointer (es interactivo)
    const cursor = await firstBrand.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });

  test('IntersectionObserver no bloquea la seccion (opacity check)', async ({ page }) => {
    // Scroll hacia la seccion de marcas
    await page.getByRole('heading', { name: 'Marcas Destacadas' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Esperar animacion IntersectionObserver

    // Verificar que la seccion tiene opacity > 0
    const section = page.locator('text=Marcas Destacadas').locator('..').locator('..');
    const opacity = await section.evaluate(el => {
      return getComputedStyle(el).opacity;
    });
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });
});
