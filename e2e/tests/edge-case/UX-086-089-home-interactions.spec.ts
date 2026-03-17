import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-086: Brand Logos Home', () => {

  test('Brand logos are clickable and navigate to brand page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('link', { name: 'Ver todas las marcas' })).toHaveAttribute('href', '/es/marcas');
  });

  test('8 brand logos are displayed', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const brandItems = page.getByRole('listitem').filter({ hasText: /Ver productos de/ });
    await expect(brandItems).toHaveCount(8);
  });
});

test.describe('UX-089: CTA Fabricantes Home', () => {

  test('CTA navigates to distribuidores page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const ctaLink = page.getByRole('link', { name: 'Conocer mas' });
    await expect(ctaLink).toHaveAttribute('href', '/es/distribuidores');
  });
});
