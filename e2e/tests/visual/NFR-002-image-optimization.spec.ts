import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-002: Image Optimization', () => {

  test('Product detail images should have loading="lazy" for below-fold content', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/amoxicilina**');

    const imgData = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.src.substring(0, 100),
        loading: img.loading || 'auto',
        alt: img.alt || ''
      }));
    });

    // At least some images should have lazy loading
    const lazyImages = imgData.filter(i => i.loading === 'lazy');
    expect(lazyImages.length).toBeGreaterThan(0);
  });

  test('Team member photos should have loading="lazy"', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/nosotros**');

    const imgData = await page.evaluate(() => {
      const imgs = document.querySelectorAll('.team-card__photo-img, img[class*="team"]');
      return Array.from(imgs).map(img => ({
        loading: img.loading || 'auto',
        alt: img.alt || ''
      }));
    });

    // Team photos should use lazy loading (they are below fold)
    for (const img of imgData) {
      expect(img.loading).toBe('lazy');
    }
  });

  test('Images should serve WebP format for optimization', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    const imageInfo = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const pictures = document.querySelectorAll('picture');
      const webpSources = document.querySelectorAll('source[type="image/webp"]');
      return {
        totalImgs: imgs.length,
        webpImgs: Array.from(imgs).filter(i => i.src.includes('.webp')).length,
        pictureElements: pictures.length,
        webpSources: webpSources.length
      };
    });

    // At least some images should use WebP or have picture elements with WebP sources
    const hasWebpOptimization = imageInfo.webpImgs > 0 || imageInfo.webpSources > 0;
    expect(hasWebpOptimization).toBe(true);
  });

  test('Brand logos should load without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    // Check for logo loading errors
    const logoErrors = consoleErrors.filter(e =>
      e.includes('clearbit') || e.includes('logo') || e.includes('ERR_NAME_NOT_RESOLVED')
    );
    expect(logoErrors.length).toBe(0);
  });

  test('Product images from Blob Storage should load successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).filter(img =>
        img.complete && img.naturalWidth === 0 && img.src !== '' && !img.src.includes('data:')
      ).map(img => img.src.substring(0, 100));
    });

    expect(brokenImages.length).toBe(0);
  });
});
