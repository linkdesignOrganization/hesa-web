import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-054: Product Card (public)', () => {

  test('DC-054: Product card has white bg, 12px radius, shadow sm', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const card = await page.evaluate(() => {
      const el = document.querySelector('.product-card');
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        borderRadius: s.borderRadius,
        boxShadow: s.boxShadow,
        transition: s.transition
      };
    });
    expect(card).not.toBeNull();
    expect(card!.bg).toBe('rgb(255, 255, 255)');
    expect(card!.borderRadius).toBe('12px');
    expect(card!.boxShadow).toContain('rgba(0, 0, 0, 0.08)');
    expect(card!.transition).toContain('0.3s');
  });

  test('DC-054: Product card name is 16px Bold', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const name = await page.evaluate(() => {
      const card = document.querySelector('.product-card');
      if (!card) return null;
      const nameEl = card.querySelector('h3, h4, [class*="name"], [class*="title"]');
      if (!nameEl) return null;
      const s = getComputedStyle(nameEl);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight };
    });
    expect(name).not.toBeNull();
    expect(name!.fontSize).toBe('16px');
    expect(name!.fontWeight).toBe('700');
  });

  test('DC-054: Product card brand is 14px grey', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const brand = await page.evaluate(() => {
      const card = document.querySelector('.product-card');
      if (!card) return null;
      const brandEl = card.querySelector('[class*="brand"], [class*="marca"]');
      if (!brandEl) return null;
      const s = getComputedStyle(brandEl);
      return { fontSize: s.fontSize, color: s.color };
    });
    expect(brand).not.toBeNull();
    expect(brand!.fontSize).toBe('14px');
    expect(brand!.color).toBe('rgb(107, 114, 128)');
  });

  test('BVC-008: No prices shown on product cards', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const priceCheck = await page.evaluate(() => {
      const priceEls = document.querySelectorAll('[class*="price"], [class*="Price"]');
      const bodyText = document.body.textContent || '';
      const dollarPattern = bodyText.match(/\$\s*\d/g);
      return {
        priceElements: priceEls.length,
        dollarSigns: dollarPattern ? dollarPattern.length : 0
      };
    });
    expect(priceCheck.priceElements).toBe(0);
    expect(priceCheck.dollarSigns).toBe(0);
  });

  test('BVC-025: No prices visible anywhere on the site', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForSelector('.product-card', { timeout: 10000 });
    const priceEls = await page.evaluate(() =>
      document.querySelectorAll('[class*="price"], [class*="Price"], [class*="cost"]').length
    );
    expect(priceEls).toBe(0);
  });

  test('BVC-026: No cart or checkout elements', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/catalogo`);
    const cartEls = await page.evaluate(() =>
      document.querySelectorAll('[class*="cart"], [class*="Cart"], [class*="checkout"], [class*="Checkout"]').length
    );
    expect(cartEls).toBe(0);
  });
});
