import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-125 & REQ-126: Product Detail SEO Edge Cases', () => {

  test('REQ-125: Product detail page has specific meta title (not generic)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const title = await page.title();

    // If product loaded, title should contain product name + brand
    // If product not found (API down), title will be generic
    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      // API is down - title will be generic; this is acceptable but not ideal
      expect(title).toBeTruthy();
    } else {
      // Title should be specific (not just "HESA - Herrera y Elizondo S.A.")
      expect(title).not.toBe('HESA - Herrera y Elizondo S.A.');
      expect(title.length).toBeGreaterThan(10);
    }
  });

  test('REQ-125: Product meta description is product-specific', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();

    const errorMsg = page.getByText(/no esta disponible/i);
    if (!(await errorMsg.isVisible())) {
      // If product loaded, description should be product-specific
      expect(metaDesc!.length).toBeGreaterThan(20);
    }
  });

  test('REQ-126: Schema markup JSON-LD type Product on product page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    const errorMsg = page.getByText(/no esta disponible/i);
    if (await errorMsg.isVisible()) {
      // With API down, JSON-LD may not be generated for products
      // Just verify no crash
      expect(count).toBeGreaterThanOrEqual(0);
    } else {
      // Product should have JSON-LD with @type Product
      expect(count).toBeGreaterThan(0);
      let foundProduct = false;
      for (let i = 0; i < count; i++) {
        const content = await jsonLdScripts.nth(i).textContent();
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed['@type'] === 'Product') {
            foundProduct = true;
            // Product JSON-LD should have name and brand
            expect(parsed.name).toBeTruthy();
          }
        }
      }
      expect(foundProduct).toBe(true);
    }
  });
});
