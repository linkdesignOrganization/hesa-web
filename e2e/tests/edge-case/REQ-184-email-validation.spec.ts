import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-184: Email format validation', () => {
  test.describe('General contact form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/es/contacto`);
      await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });
    });

    test('email without domain shows invalid format error', async ({ page }) => {
      await page.fill('input[name="email"]', 'test@');
      await page.click('textarea[name="message"]'); // blur

      const emailError = page.locator('.form-group').filter({ has: page.locator('#email') }).locator('.form-error');
      await expect(emailError).toBeVisible();
      await expect(emailError).toHaveText('Formato de email invalido');
    });

    test('email without @ shows invalid format error', async ({ page }) => {
      await page.fill('input[name="email"]', 'invalidemail');
      await page.click('textarea[name="message"]');

      const emailError = page.locator('.form-group').filter({ has: page.locator('#email') }).locator('.form-error');
      await expect(emailError).toBeVisible();
      await expect(emailError).toHaveText('Formato de email invalido');
    });

    test('email with spaces shows invalid format error', async ({ page }) => {
      await page.fill('input[name="email"]', 'test @test.com');
      await page.click('textarea[name="message"]');

      const emailError = page.locator('.form-group').filter({ has: page.locator('#email') }).locator('.form-error');
      await expect(emailError).toBeVisible();
      await expect(emailError).toHaveText('Formato de email invalido');
    });

    test('valid email clears error', async ({ page }) => {
      // First trigger error
      await page.fill('input[name="email"]', 'bad');
      await page.click('textarea[name="message"]');
      await expect(page.locator('.form-group').filter({ has: page.locator('#email') }).locator('.form-error')).toBeVisible();

      // Now fix it
      await page.fill('input[name="email"]', 'valid@email.com');
      await page.click('textarea[name="message"]');
      await expect(page.locator('.form-group').filter({ has: page.locator('#email') }).locator('.form-error')).not.toBeVisible();
    });
  });

  test.describe('Manufacturer contact form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/es/distribuidores`);
      await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 15000 });
    });

    test('manufacturer email without domain shows invalid format error', async ({ page }) => {
      await page.fill('input[name="contactEmail"]', 'test@');
      await page.click('textarea[name="mfrMessage"]');

      const emailError = page.locator('.form-group').filter({ has: page.locator('#contact-email') }).locator('.form-error');
      await expect(emailError).toBeVisible();
      await expect(emailError).toHaveText('Formato de email invalido');
    });
  });
});
