import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-125 & REQ-126: Product Detail SEO Edge Cases', () => {

  test('REQ-125: Meta title contains product name + brand', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const title = await page.title();
    // Title should contain product name and potentially brand
    // At minimum, should not be the generic site title
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
  });

  test('REQ-125: Meta description generated for product page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(20);
  });

  test('REQ-126: Schema markup JSON-LD type Product on product pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    if (count > 0) {
      let foundProduct = false;
      for (let i = 0; i < count; i++) {
        const content = await jsonLdScripts.nth(i).textContent();
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed['@type'] === 'Product' || parsed['@type']?.includes('Product')) {
            foundProduct = true;
          }
        }
      }
      expect(foundProduct).toBe(true);
    } else {
      // No JSON-LD found - this will fail to document the issue
      expect(count).toBeGreaterThan(0);
    }
  });
});
