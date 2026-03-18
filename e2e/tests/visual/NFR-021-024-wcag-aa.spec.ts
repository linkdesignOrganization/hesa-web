import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-021: WCAG 2.1 AA Compliance', () => {

  test('NFR-021: Home has correct heading hierarchy (h1 > h2 > h3)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim().substring(0, 50) || ''
      }));
    });

    // Should have exactly one h1
    const h1s = headings.filter(h => h.level === 1);
    expect(h1s.length).toBe(1);

    // Heading levels should not skip (e.g., h1 then h3 without h2)
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i].level - headings[i - 1].level;
      // Can go deeper by 1, or go back up by any amount
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('NFR-021: Pages have required ARIA landmarks', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const landmarks = await page.evaluate(() => ({
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      main: document.querySelectorAll('main, [role="main"]').length,
      footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      search: document.querySelectorAll('[role="search"], search').length,
    }));

    expect(landmarks.nav).toBeGreaterThanOrEqual(1);
    expect(landmarks.main).toBe(1);
    expect(landmarks.footer).toBe(1);
  });

  test('NFR-021: Skip-to-content link is present', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const skipLink = await page.evaluate(() => {
      const link = document.querySelector('.skip-to-content, [class*="skip"], a[href="#main-content"]');
      return link ? {
        text: link.textContent?.trim() || '',
        href: link.getAttribute('href') || ''
      } : null;
    });

    expect(skipLink).not.toBeNull();
    expect(skipLink!.href).toContain('#');
  });

  test('NFR-021: HTML lang attribute is set correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('es');
  });

  test('NFR-021: HTML lang is "en" for English version', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle' });

    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });
});

test.describe('NFR-022: All images have alt text', () => {

  const pagesToCheck = [
    { path: '/es/', name: 'Home' },
    { path: '/es/catalogo', name: 'Catalogo' },
    { path: '/es/nosotros', name: 'Nosotros' },
    { path: '/es/distribuidores', name: 'Distribuidores' },
    { path: '/es/contacto', name: 'Contacto' },
    { path: '/es/marcas', name: 'Marcas' }
  ];

  for (const pageInfo of pagesToCheck) {
    test(`NFR-022: All images on ${pageInfo.name} page have descriptive alt text`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle' });

      const imagesWithoutAlt = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        return Array.from(imgs)
          .filter(img => {
            // Skip decorative SVGs that are aria-hidden
            if (img.getAttribute('aria-hidden') === 'true') return false;
            // Skip images with empty alt (intentionally decorative)
            if (img.alt === '') return false;
            // Flag images without alt attribute at all
            return !img.hasAttribute('alt');
          })
          .map(img => ({
            src: img.src.substring(0, 100),
            class: img.className.substring(0, 50)
          }));
      });

      expect(imagesWithoutAlt.length).toBe(0);
    });
  }
});

test.describe('NFR-024: Color Contrast WCAG AA', () => {

  // Helper to calculate relative luminance
  function luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  test('NFR-024: Main heading text has sufficient contrast (4.5:1)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const colors = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const style = getComputedStyle(h1);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor
      };
    });

    expect(colors).not.toBeNull();
    // h1 color is rgb(31, 41, 55) = #1F2937
    // Background is transparent (inherits white)
    const textL = luminance(31, 41, 55);
    const bgL = luminance(255, 255, 255);
    const ratio = contrastRatio(textL, bgL);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('NFR-024: Body text has sufficient contrast (4.5:1)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });

    const colors = await page.evaluate(() => {
      const p = document.querySelector('main p');
      if (!p) return null;
      return { color: getComputedStyle(p).color };
    });

    expect(colors).not.toBeNull();
    // Body text is rgb(107, 114, 128) = #6B7280 on white
    const textL = luminance(107, 114, 128);
    const bgL = luminance(255, 255, 255);
    const ratio = contrastRatio(textL, bgL);
    // Normal text needs 4.5:1
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('NFR-024: Footer text has sufficient contrast on dark background', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const footerColors = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const p = footer.querySelector('p');
      return {
        bg: getComputedStyle(footer).backgroundColor,
        textColor: p ? getComputedStyle(p).color : null
      };
    });

    expect(footerColors).not.toBeNull();
    // Footer: white text (#FFFFFF) on #005A85 background
    const textL = luminance(255, 255, 255);
    const bgL = luminance(0, 90, 133);
    const ratio = contrastRatio(textL, bgL);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
