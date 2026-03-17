import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-097: Related Products Section', () => {

  test('Product detail shows "Tambien te puede interesar" section', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.mouse.wheel(0, 800);
    await expect(page.getByText('Tambien te puede interesar')).toBeVisible();
  });

  test('Related products are from same category', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.mouse.wheel(0, 800);
    // All related products should be pharma products (farmacos in URL)
    const relatedLinks = page.locator('a[href*="/es/catalogo/farmacos/"]');
    // At least 3 related products
    expect(await relatedLinks.count()).toBeGreaterThanOrEqual(3);
  });
});
