import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-185: Blur validation on manufacturer form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 15000 });
  });

  test('blur on each required field shows error indicator', async ({ page }) => {
    // Company name
    await page.click('input[name="companyName"]');
    await page.click('input[name="contactName"]');
    await expect(page.locator('.form-group').filter({ has: page.locator('#company') }).locator('.form-error')).toBeVisible();

    // Contact name
    await page.click('input[name="contactEmail"]');
    await expect(page.locator('.form-group').filter({ has: page.locator('#contact-name') }).locator('.form-error')).toBeVisible();

    // Email
    await page.click('textarea[name="mfrMessage"]');
    await expect(page.locator('.form-group').filter({ has: page.locator('#contact-email') }).locator('.form-error')).toBeVisible();

    // Message
    await page.click('input[name="companyName"]');
    await expect(page.locator('.form-group').filter({ has: page.locator('#mfr-message') }).locator('.form-error')).toBeVisible();
  });

  test('invalid email on blur shows email format error', async ({ page }) => {
    await page.fill('input[name="contactEmail"]', 'notanemail');
    await page.click('textarea[name="mfrMessage"]');

    const emailError = page.locator('.form-group').filter({ has: page.locator('#contact-email') }).locator('.form-error');
    await expect(emailError).toHaveText('Formato de email invalido');
  });

  test('fields with form-control--error class are marked visually', async ({ page }) => {
    await page.click('input[name="companyName"]');
    await page.click('input[name="contactName"]');

    // The input should have error class
    await expect(page.locator('#company')).toHaveClass(/form-control--error/);
  });
});
