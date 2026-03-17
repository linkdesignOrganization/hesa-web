import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-003 - Deep linking rutas EN deben renderizar la pagina correcta
test.describe('UX-003: Deep linking rutas EN', () => {

  test('EN brands via deep link', async ({ page }) => {
    await page.goto(`${BASE}/en/brands`);
    await expect(page.getByRole('heading', { name: 'Our Brands', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('EN catalog pharmaceuticals via deep link', async ({ page }) => {
    await page.goto(`${BASE}/en/catalog/pharmaceuticals`);
    await expect(page.getByRole('heading', { name: 'Veterinary Pharmaceuticals', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('EN about via deep link', async ({ page }) => {
    await page.goto(`${BASE}/en/about`);
    await expect(page.getByRole('heading', { name: 'Herrera y Elizondo S.A.', level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('EN distributors via deep link', async ({ page }) => {
    await page.goto(`${BASE}/en/distributors`);
    await expect(page.getByText('Become Our Distribution Partner')).toBeVisible({ timeout: 10000 });
  });

  test('EN contact via deep link', async ({ page }) => {
    await page.goto(`${BASE}/en/contact`);
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
