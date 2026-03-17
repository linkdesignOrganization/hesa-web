import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC Negative Checks - Anti-patterns', () => {

  test('BVC-025: No prices visible on any page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pages = ['/es', '/es/catalogo', '/es/marcas', '/es/contacto'];
    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      const priceCheck = await page.evaluate(() => {
        const priceEls = document.querySelectorAll('[class*="price"], [class*="Price"]');
        return priceEls.length;
      });
      expect(priceCheck).toBe(0);
    }
  });

  test('BVC-026: No cart or checkout elements', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const cartCheck = await page.evaluate(() => {
      const els = document.querySelectorAll(
        '[class*="cart"], [class*="Cart"], [class*="checkout"], [class*="Checkout"], [class*="basket"]'
      );
      return els.length;
    });
    expect(cartCheck).toBe(0);
  });

  test('BVC-027: No public login/register on public site', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const loginCheck = await page.evaluate(() => {
      const header = document.querySelector('.header, header, app-header');
      if (!header) return false;
      const text = header.textContent || '';
      return text.includes('Iniciar sesion') || text.includes('Registrar') ||
             text.includes('Login') || text.includes('Sign') ||
             text.includes('Mi cuenta') || text.includes('Account');
    });
    expect(loginCheck).toBe(false);
  });

  test('BVC-028: No offers, discounts, reviews or blog', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const antiPatternCheck = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return {
        hasOffers: /oferta|descuento|promo|sale|deal/i.test(text),
        hasReviews: /resena|review|estrella|stars|calificacion/i.test(text),
        hasBlog: /blog|articulo|article|post/i.test(text)
      };
    });
    expect(antiPatternCheck.hasOffers).toBe(false);
    expect(antiPatternCheck.hasReviews).toBe(false);
    expect(antiPatternCheck.hasBlog).toBe(false);
  });

  test('BVC-029: No live chat widget (only WhatsApp)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const chatWidgetCheck = await page.evaluate(() => {
      const chatEls = document.querySelectorAll(
        '[id*="intercom"], [id*="zendesk"], [id*="crisp"], [id*="tawk"], [id*="drift"], [class*="live-chat"], [class*="chat-widget"]'
      );
      return chatEls.length;
    });
    expect(chatWidgetCheck).toBe(0);
  });
});
