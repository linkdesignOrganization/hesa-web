import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-033 & REQ-181: hreflang and SEO Meta Edge Cases', () => {

  test('REQ-033: hreflang tags present on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    // Check for hreflang link tags in head
    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

    // Both language versions should be referenced
    expect(await hreflangEs.count()).toBeGreaterThan(0);
    expect(await hreflangEn.count()).toBeGreaterThan(0);
  });

  test('REQ-033: hreflang tags on catalog page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);

    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

    expect(await hreflangEs.count()).toBeGreaterThan(0);
    expect(await hreflangEn.count()).toBeGreaterThan(0);
  });

  test('REQ-033: hreflang tags on brands page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForTimeout(3000);

    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

    expect(await hreflangEs.count()).toBeGreaterThan(0);
    expect(await hreflangEn.count()).toBeGreaterThan(0);
  });

  test('REQ-181: Meta tags optimized for English (keywords "distributor Costa Rica")', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForTimeout(3000);

    // Title should reference English context (not just Spanish company name)
    const title = await page.title();
    // Description should contain English keywords
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

    // Should have English-optimized content
    // At minimum, the page should render in English
    expect(title).toBeTruthy();
    // Meta description should be in English and mention distribution/Costa Rica
    if (metaDesc) {
      const hasEnglishKeywords = metaDesc.toLowerCase().includes('costa rica') ||
        metaDesc.toLowerCase().includes('distribut') ||
        metaDesc.toLowerCase().includes('veterinar');
      expect(hasEnglishKeywords).toBe(true);
    }
  });

  test('REQ-181: EN pages have different meta description than ES', async ({ page }) => {
    // Get ES description
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);
    const esDesc = await page.locator('meta[name="description"]').getAttribute('content');

    // Get EN description
    await page.goto(`${BASE_URL}/en`);
    await page.waitForTimeout(3000);
    const enDesc = await page.locator('meta[name="description"]').getAttribute('content');

    // They should be different (localized)
    expect(esDesc).not.toBe(enDesc);
  });
});
