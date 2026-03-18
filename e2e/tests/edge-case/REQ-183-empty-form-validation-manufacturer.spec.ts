import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-183: Manufacturer contact form - required field validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 15000 });
  });

  test('submitting empty manufacturer form shows all required field errors', async ({ page }) => {
    await page.click('button:has-text("Enviar consulta")');

    // Verify all 5 required fields show error messages
    // Company, Country, Contact Name, Email, Message
    await expect(page.locator('.form-error').filter({ hasText: 'Este campo es obligatorio' })).toHaveCount(5);
  });

  test('blur on empty company name shows error', async ({ page }) => {
    await page.click('input[name="companyName"]');
    await page.click('input[name="contactName"]');

    const companyError = page.locator('.form-group').filter({ has: page.locator('#company') }).locator('.form-error');
    await expect(companyError).toBeVisible();
    await expect(companyError).toHaveText('Este campo es obligatorio');
  });

  test('blur on empty contact name shows error', async ({ page }) => {
    await page.click('input[name="contactName"]');
    await page.click('input[name="contactEmail"]');

    const contactError = page.locator('.form-group').filter({ has: page.locator('#contact-name') }).locator('.form-error');
    await expect(contactError).toBeVisible();
    await expect(contactError).toHaveText('Este campo es obligatorio');
  });

  test('blur on empty email shows required error', async ({ page }) => {
    await page.click('input[name="contactEmail"]');
    await page.click('textarea[name="mfrMessage"]');

    const emailError = page.locator('.form-group').filter({ has: page.locator('#contact-email') }).locator('.form-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Este campo es obligatorio');
  });
});
