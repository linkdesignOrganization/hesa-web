import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-097: Marcas Destacadas responsive', () => {
  test('seccion marcas visible en mobile 375px', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle', timeout: 30000 });

    const marcasHeading = page.getByRole('heading', { name: 'Marcas Destacadas', level: 2 });
    await marcasHeading.scrollIntoViewIfNeeded();
    await expect(marcasHeading).toBeVisible({ timeout: 15000 });

    // Verificar que al menos las primeras marcas son visibles
    await expect(page.getByText('Zoetis').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Royal Canin').first()).toBeVisible({ timeout: 5000 });

    await context.close();
  });

  test('seccion marcas visible en tablet 768px', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle', timeout: 30000 });

    const marcasHeading = page.getByRole('heading', { name: 'Marcas Destacadas', level: 2 });
    await marcasHeading.scrollIntoViewIfNeeded();
    await expect(marcasHeading).toBeVisible({ timeout: 15000 });

    // Verificar 8 marcas visibles
    const expectedBrands = ['Zoetis', 'Royal Canin', 'MSD Animal Health', 'Purina Pro Plan'];
    for (const brand of expectedBrands) {
      await expect(page.getByText(brand).first()).toBeVisible({ timeout: 5000 });
    }

    await context.close();
  });

  test('seccion marcas visible en desktop 1440px', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle', timeout: 30000 });

    const marcasHeading = page.getByRole('heading', { name: 'Marcas Destacadas', level: 2 });
    await marcasHeading.scrollIntoViewIfNeeded();
    await expect(marcasHeading).toBeVisible({ timeout: 15000 });

    // Todas las 8 marcas deben ser visibles en desktop
    const expectedBrands = [
      'Zoetis', 'Royal Canin', 'MSD Animal Health', 'Purina Pro Plan',
      'Boehringer Ingelheim', 'Hills Pet Nutrition', 'Bayer Animal Health', 'Virbac'
    ];
    for (const brand of expectedBrands) {
      await expect(page.getByText(brand).first()).toBeVisible({ timeout: 5000 });
    }

    await context.close();
  });

  test('link "Ver todas las marcas" visible en todos los breakpoints', async ({ browser }) => {
    for (const viewport of [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle', timeout: 30000 });

      const link = page.getByRole('link', { name: 'Ver todas las marcas' });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible({ timeout: 10000 });

      await context.close();
    }
  });
});
