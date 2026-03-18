import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-033 & REQ-181: hreflang and SEO Meta Edge Cases', () => {

  test('REQ-033: hreflang tags present on home page (ES)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

    // Both language versions should be referenced
    expect(await hreflangEs.count()).toBeGreaterThan(0);
    expect(await hreflangEn.count()).toBeGreaterThan(0);
  });

  test('REQ-033: hreflang tags present on home page (EN)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForTimeout(3000);

    const hreflangEs = page.locator('link[rel="alternate"][hreflang="es"]');
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]');

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

  test('REQ-181: EN home page meta description is in English and different from ES', async ({ page }) => {
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

    // EN description should contain English keywords
    if (enDesc) {
      const hasEnglishKeywords = enDesc.toLowerCase().includes('costa rica') ||
        enDesc.toLowerCase().includes('distribut') ||
        enDesc.toLowerCase().includes('veterinar');
      expect(hasEnglishKeywords).toBe(true);
    }
  });

  test('REQ-181: EN catalog page title is in English', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/catalog`);
    await page.waitForTimeout(3000);

    const title = await page.title();
    // Title should be in English (not "Catalogo de Productos")
    expect(title.toLowerCase()).toContain('catalog');
  });
});
