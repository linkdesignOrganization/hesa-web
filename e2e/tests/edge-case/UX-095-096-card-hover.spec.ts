import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-095/UX-096: Product and Brand Card Hover', () => {

  test('Product cards have links that navigate to product detail', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    const firstCard = page.getByRole('link', { name: /Ver Amoxicilina/ });
    await expect(firstCard).toHaveAttribute('href', /\/es\/catalogo\/farmacos\/amoxicilina-250ml/);
  });

  test('Brand logos on home are clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const brandItem = page.getByRole('listitem', { name: /Ver productos de Zoetis/ });
    await expect(brandItem).toBeVisible();
  });

  test('Product cards show "Ver producto" text', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await expect(page.getByText('Ver producto').first()).toBeVisible();
  });
});
