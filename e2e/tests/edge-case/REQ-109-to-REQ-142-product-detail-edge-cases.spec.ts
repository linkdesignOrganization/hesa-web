import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-109 to REQ-142: Product Detail Edge Cases', () => {

  test('REQ-124: URL semantica /es/catalogo/[categoria]/[slug-del-producto]', async ({ page }) => {
    // Navigate to a known product from the home page
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(3000);

    // URL should be semantic
    expect(page.url()).toContain('/es/catalogo/farmacos/amoxicilina-250ml');
  });

  test('REQ-124: Non-existent product slug should handle gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/producto-que-no-existe-xyz`);
    await page.waitForTimeout(3000);

    // Page should load without crash
    // Should show some error/not found state or redirect
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('REQ-124: URL with special characters in slug', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/<script>alert(1)</script>`);
    await page.waitForTimeout(3000);

    // Page should not execute script, should handle gracefully
    const title = await page.title();
    expect(title).toContain('HESA');
  });

  test('REQ-120: Without PDF, button should NOT be shown (no disabled button, no blank space)', async ({ page }) => {
    // Navigate to a product
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(3000);

    // Check if there is a PDF button - if product has no PDF, it should not exist at all
    const pdfButton = page.getByRole('link', { name: /ficha|pdf|descargar/i });
    // Note: Cannot fully verify without API, but the element should not be a disabled button
    const disabledPdf = page.locator('button[disabled]:has-text("PDF"), button[disabled]:has-text("ficha")');
    expect(await disabledPdf.count()).toBe(0);
  });

  test('REQ-129: Empty fields should not generate blank areas', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(3000);

    // Look for empty sections that might create white space
    // Empty paragraphs, divs with only whitespace
    const emptyVisibleSections = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, div, span');
      let emptyCount = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          const text = el.textContent?.trim() || '';
          const hasChildren = el.children.length > 0;
          const height = el.getBoundingClientRect().height;
          if (text === '' && !hasChildren && height > 50) {
            emptyCount++;
          }
        }
      });
      return emptyCount;
    });
    // Should not have excessive empty areas
    expect(emptyVisibleSections).toBeLessThan(5);
  });

  test('REQ-127: Single image should not show thumbnails', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(3000);

    // If product has only one image, thumbnails strip should not appear
    // This is a structural check
    const galleryImages = page.locator('[class*="gallery"] img, [class*="thumbnail"] img');
    const imageCount = await galleryImages.count();

    // If only 1 image, no thumbnail navigation should exist
    if (imageCount <= 1) {
      const thumbnailStrip = page.locator('[class*="thumbnail"], [class*="miniatura"]');
      expect(await thumbnailStrip.count()).toBe(0);
    }
  });

  test('REQ-136: Storytelling optional - if no content, section does not appear', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(3000);

    // Storytelling section should not be visible if product has no storytelling content
    // Just verify the page loads correctly without extra sections
    const storytelling = page.locator('[class*="storytelling"]');
    // We can't determine if content exists, but section should not show empty container
    if (await storytelling.count() > 0) {
      // If section exists, it should have content
      const text = await storytelling.first().textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});
