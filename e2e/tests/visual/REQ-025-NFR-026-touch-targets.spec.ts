import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-025: WhatsApp FAB Touch Target', () => {

  test('REQ-025: WhatsApp button has area >= 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const waButton = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';
        if (text.includes('WhatsApp') || ariaLabel.includes('WhatsApp')) {
          const rect = btn.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }
      }
      // Also try finding by class
      const fab = document.querySelector('[class*="whatsapp"], [class*="wa-fab"]');
      if (fab) {
        const rect = fab.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }
      return null;
    });

    expect(waButton).not.toBeNull();
    expect(waButton!.width).toBeGreaterThanOrEqual(44);
    expect(waButton!.height).toBeGreaterThanOrEqual(44);
  });

  test('REQ-025: WhatsApp button is present on multiple pages', async ({ page }) => {
    const pages = ['/es/', '/es/catalogo', '/es/nosotros', '/es/contacto', '/es/distribuidores'];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });

      const hasWhatsApp = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).some(btn =>
          (btn.textContent || '').includes('WhatsApp') ||
          (btn.getAttribute('aria-label') || '').includes('WhatsApp')
        );
      });

      expect(hasWhatsApp, `WhatsApp button missing on ${pagePath}`).toBe(true);
    }
  });
});

test.describe('NFR-026: Mobile Touch Targets >= 44x44px', () => {

  test('NFR-026: Header navigation buttons meet 44x44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const headerButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.header__search-btn, .header__menu-btn, [class*="header"] button');
      return Array.from(buttons)
        .map(btn => {
          const rect = btn.getBoundingClientRect();
          const style = getComputedStyle(btn);
          if (style.display === 'none' || rect.width === 0) return null;
          return {
            text: (btn.textContent || btn.getAttribute('aria-label') || '').trim().substring(0, 30),
            width: rect.width,
            height: rect.height
          };
        })
        .filter(Boolean);
    });

    for (const btn of headerButtons) {
      if (!btn) continue;
      expect(btn.width, `Button "${btn.text}" width ${btn.width}px < 44px`).toBeGreaterThanOrEqual(44);
      expect(btn.height, `Button "${btn.text}" height ${btn.height}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('NFR-026: CTA buttons meet 44x44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const ctaLinks = await page.evaluate(() => {
      const ctas = document.querySelectorAll('.hero__cta, [class*="cta"], .btn, a[class*="btn"]');
      return Array.from(ctas)
        .map(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (style.display === 'none' || rect.width === 0) return null;
          return {
            text: (el.textContent || '').trim().substring(0, 30),
            width: rect.width,
            height: rect.height
          };
        })
        .filter(Boolean);
    });

    for (const cta of ctaLinks) {
      if (!cta) continue;
      expect(cta.height, `CTA "${cta.text}" height ${cta.height}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('NFR-026: Footer links meet 44x44px minimum height on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const footerLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('.footer__link, footer a');
      return Array.from(links)
        .map(link => {
          const rect = link.getBoundingClientRect();
          const style = getComputedStyle(link);
          if (style.display === 'none' || rect.width === 0) return null;
          return {
            text: (link.textContent || '').trim().substring(0, 30),
            width: rect.width,
            height: rect.height
          };
        })
        .filter(Boolean);
    });

    for (const link of footerLinks) {
      if (!link) continue;
      expect(link.height, `Footer link "${link.text}" height ${link.height}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('NFR-026: Filter controls meet 44x44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/catalogo`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/catalogo**');

    const filterControls = await page.evaluate(() => {
      const controls = document.querySelectorAll('.filter-bar__dropdown, [class*="filter"] select, [class*="filter"] button');
      return Array.from(controls)
        .map(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (style.display === 'none' || rect.width === 0) return null;
          return {
            text: (el.textContent || el.getAttribute('aria-label') || '').trim().substring(0, 30),
            width: rect.width,
            height: rect.height
          };
        })
        .filter(Boolean);
    });

    for (const control of filterControls) {
      if (!control) continue;
      expect(control.height, `Filter "${control.text}" height ${control.height}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });

  test('NFR-026: Social media links meet 44x44px minimum on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle' });

    const socialLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('.footer__social-link, [class*="social"] a');
      return Array.from(links)
        .map(link => {
          const rect = link.getBoundingClientRect();
          return {
            text: (link.textContent || link.getAttribute('aria-label') || '').trim().substring(0, 20),
            width: rect.width,
            height: rect.height
          };
        });
    });

    for (const link of socialLinks) {
      expect(link.width, `Social link "${link.text}" width ${link.width}px < 44px`).toBeGreaterThanOrEqual(44);
      expect(link.height, `Social link "${link.text}" height ${link.height}px < 44px`).toBeGreaterThanOrEqual(44);
    }
  });
});
