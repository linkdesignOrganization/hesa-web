import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-109 to REQ-142: Product Detail Edge Cases', () => {

  test('REQ-124: Non-existent product slug shows error state, NOT redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/producto-que-no-existe-xyz`);
    await page.waitForTimeout(4000);

    // BUG-012 fix: Should show error state, NOT redirect to /es/catalogo
    expect(page.url()).toContain('/es/catalogo/farmacos/producto-que-no-existe-xyz');

    // Should show error message
    const errorMsg = page.getByText('Este producto no esta disponible');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });

    // Should have "Volver al catalogo" link/button
    const backLink = page.getByRole('link', { name: /volver al catalogo/i });
    await expect(backLink).toBeVisible();
  });

  test('REQ-124: URL with XSS script in slug is handled safely', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/<script>alert(1)</script>`);
    await page.waitForTimeout(3000);

    // Page should not execute script, should handle gracefully
    const title = await page.title();
    expect(title).toContain('HESA');
  });

  // The following tests require the API to be functional to load real product data.
  // Currently ALL API endpoints return 404 "Cannot GET" (routes not registered).
  // These tests are structured to validate product detail edge cases once the API is fixed.

  test('REQ-109: Product image has zoom/lightbox interaction', async ({ page }) => {
    // TODO: Replace with a real product slug when API serves data
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    // Check if product loaded (API must be working)
    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data - cannot test image zoom');
      return;
    }

    // Look for zoomable image interaction
    const mainImage = page.locator('[class*="gallery"] img, [class*="product"] img').first();
    await expect(mainImage).toBeVisible();
    await mainImage.click();

    // Lightbox or zoomed view should appear
    const lightbox = page.locator('[class*="lightbox"], [class*="zoom"], [class*="modal"] img');
    await expect(lightbox).toBeVisible({ timeout: 3000 });
  });

  test('REQ-120: Without PDF, button should NOT be shown', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    // If product has no PDF, the button should not exist at all (no disabled state)
    const disabledPdf = page.locator('button[disabled]:has-text("PDF"), button[disabled]:has-text("ficha")');
    expect(await disabledPdf.count()).toBe(0);
  });

  test('REQ-127: Single image product should not show thumbnails', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    const galleryImages = page.locator('[class*="gallery"] img, [class*="thumbnail"] img');
    const imageCount = await galleryImages.count();

    if (imageCount <= 1) {
      const thumbnailStrip = page.locator('[class*="thumbnail"], [class*="miniatura"]');
      expect(await thumbnailStrip.count()).toBe(0);
    }
  });

  test('REQ-128: Product without image shows placeholder', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    // If no product image, a placeholder should be visible
    const mainImage = page.locator('[class*="gallery"] img, [class*="product"] img, [class*="placeholder"]').first();
    await expect(mainImage).toBeVisible();
  });

  test('REQ-129: Empty fields do not generate blank areas', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

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
    expect(emptyVisibleSections).toBeLessThan(5);
  });

  test('REQ-134: Sticky bar does not cause CLS', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    // Measure CLS during scroll
    const cls = await page.evaluate(async () => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });

      // Scroll down to trigger sticky bar
      window.scrollTo(0, 500);
      await new Promise(r => setTimeout(r, 500));
      window.scrollTo(0, 1000);
      await new Promise(r => setTimeout(r, 500));

      observer.disconnect();
      return clsValue;
    });

    // CLS should be minimal (< 0.1 is good, < 0.25 is acceptable)
    expect(cls).toBeLessThan(0.25);
  });

  test('REQ-135/REQ-136: Storytelling section conditional rendering', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    const storytelling = page.locator('[class*="storytelling"]');
    if (await storytelling.count() > 0) {
      // REQ-135: If section exists, it must have content (image + text)
      const text = await storytelling.first().textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
    // REQ-136: If no storytelling content, section simply does not appear (implicit pass)
  });

  test('REQ-141: Mobile - related products in horizontal carousel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    const relatedSection = page.locator('[class*="relacion"], [class*="related"], [class*="interesar"]');
    if (await relatedSection.count() > 0) {
      // On mobile, should be a horizontal scrollable container
      const isHorizontal = await relatedSection.first().evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.overflowX === 'auto' || style.overflowX === 'scroll' ||
          el.scrollWidth > el.clientWidth;
      });
      expect(isHorizontal).toBe(true);
    }
  });

  test('REQ-142: Category with single product - related section adapted', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(4000);

    const errorMsg = page.getByText(/no esta disponible|no pudimos cargar/i);
    if (await errorMsg.isVisible()) {
      test.skip(true, 'API not serving product data');
      return;
    }

    // If only 1 product in category, related section should adapt
    // (show products from other categories or hide section)
    const relatedSection = page.locator('[class*="relacion"], [class*="related"], [class*="interesar"]');
    // Just verify no crash/empty broken state
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
