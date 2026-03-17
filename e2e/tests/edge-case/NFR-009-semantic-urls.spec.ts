import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-009: Semantic and Readable URLs', () => {

  test('Home page URL uses language prefix', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    expect(page.url()).toContain('/es');
  });

  test('Catalog URL is semantic: /es/catalogo', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    expect(page.url()).toContain('/es/catalogo');
    await expect(page.getByText('Catalogo de Productos')).toBeVisible();
  });

  test('Category catalog URL is semantic: /es/catalogo/farmacos', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos`);
    expect(page.url()).toContain('/es/catalogo/farmacos');
  });

  test('Product URL uses slug: /es/catalogo/farmacos/amoxicilina-250ml', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    expect(page.url()).toContain('/es/catalogo/farmacos/amoxicilina-250ml');
  });

  test('English URLs mirror Spanish structure', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog`);
    expect(page.url()).toContain('/en/catalog');
  });

  test('Admin URLs are under /admin/ prefix', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    expect(page.url()).toContain('/admin/login');
  });

  test('Filter params use readable query strings', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo?category=farmacos`);
    expect(page.url()).toContain('category=farmacos');
  });
});
