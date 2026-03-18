import { test, expect } from '@playwright/test';

/**
 * Admin Login Page — Visual Verification
 * Verifies DC-045 (Panel Login) and DC-099 (Login responsive)
 * These are the only admin panel visuals observable without authentication.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Login Page — Visual (DC-045, DC-099)', () => {

  test('DC-045: Login page shows centered card with logo, title, Microsoft button', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    // Wait for login card to appear (the page redirects to /admin/login)
    await page.waitForSelector('.login-card', { timeout: 10000 });

    // Verify login card elements
    const card = page.locator('.login-card');
    await expect(card).toBeVisible();

    // Logo HESA text
    const logo = page.locator('.login-card__logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('HESA');

    // Title
    const title = page.locator('.login-card__title, h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Panel de Administracion');

    // Subtitle
    const subtitle = page.locator('.login-card__subtitle, p');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Inicia sesion con tu cuenta de Microsoft');

    // Microsoft login button
    const btn = page.locator('.login-card__btn, button');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Iniciar sesion con Microsoft');

    // Verify card computed styles against DC-045
    const cardStyles = await card.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        textAlign: styles.textAlign,
      };
    });

    // DC-045: card white bg, border-radius 16px, shadow elevated
    expect(cardStyles.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(cardStyles.borderRadius).toBe('16px');
    expect(cardStyles.boxShadow).not.toBe('none');
    expect(cardStyles.textAlign).toBe('center');
  });

  test('DC-045: Login card typography matches design system', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForSelector('.login-card', { timeout: 10000 });

    // h1 should be 24px/700 per DC-014 panel scale
    const h1Styles = await page.locator('h1').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: styles.fontFamily,
        color: styles.color,
      };
    });

    expect(h1Styles.fontSize).toBe('24px');
    expect(h1Styles.fontWeight).toBe('700');
    expect(h1Styles.fontFamily).toContain('Inter');
    // DC-004: neutral-900 = #1F2937 = rgb(31, 41, 55)
    expect(h1Styles.color).toBe('rgb(31, 41, 55)');
  });

  test('DC-045: Microsoft login button has correct styling', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForSelector('.login-card__btn', { timeout: 10000 });

    const btnStyles = await page.locator('.login-card__btn').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        border: styles.border,
        cursor: styles.cursor,
      };
    });

    // DC-045: white bg, border #E5E7EB, Microsoft icon
    expect(btnStyles.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(btnStyles.borderRadius).toBe('8px');
    expect(btnStyles.border).toContain('rgb(229, 231, 235)');
    expect(btnStyles.cursor).toBe('pointer');

    // Verify Microsoft icon is present
    const hasIcon = await page.locator('.login-card__btn img').count();
    expect(hasIcon).toBeGreaterThan(0);
  });

  test('DC-099: Login card is centered at desktop 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForSelector('.login-card', { timeout: 10000 });

    // DC-045/DC-099: card max-width 420px centered on #F7F8FA background
    const cardBox = await page.locator('.login-card').boundingBox();
    expect(cardBox).not.toBeNull();
    if (cardBox) {
      // Card should be max 420px wide per spec (tolerance: check < 500px)
      // NOTE: Currently card is 724px which is a bug — max-width not constrained to 420px
      expect(cardBox.width).toBeLessThanOrEqual(500);
    }
  });

  test('DC-099: Login card responsive at mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForSelector('.login-card', { timeout: 10000 });

    // DC-099: card full-width with padding 20px on mobile
    const cardStyles = await page.locator('.login-card').evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        width: el.offsetWidth,
        padding: styles.padding,
      };
    });

    // Card should fill the viewport width (minus padding)
    expect(cardStyles.width).toBeLessThanOrEqual(375);
  });
});
