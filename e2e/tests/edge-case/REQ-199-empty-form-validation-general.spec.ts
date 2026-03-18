import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-199: General contact form - required field validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });
  });

  test('submitting empty form shows all required field errors', async ({ page }) => {
    await page.click('button:has-text("Enviar mensaje")');

    // Verify all 4 required fields show error messages
    await expect(page.locator('.form-error').filter({ hasText: 'Este campo es obligatorio' })).toHaveCount(4);

    // Name error
    const nameGroup = page.locator('.form-group').filter({ has: page.locator('label:has-text("Nombre")') });
    await expect(nameGroup.locator('.form-error')).toBeVisible();

    // Email error
    const emailGroup = page.locator('.form-group').filter({ has: page.locator('label:has-text("Correo electronico")') });
    await expect(emailGroup.locator('.form-error')).toBeVisible();

    // Consultation type error
    const typeGroup = page.locator('.form-group').filter({ has: page.locator('label:has-text("Tipo de consulta")') });
    await expect(typeGroup.locator('.form-error')).toBeVisible();

    // Message error
    const msgGroup = page.locator('.form-group').filter({ has: page.locator('label:has-text("Mensaje")') });
    await expect(msgGroup.locator('.form-error')).toBeVisible();
  });

  test('blur on empty required field shows error', async ({ page }) => {
    // Click on Name, then tab away
    await page.click('input[name="name"]');
    await page.click('input[name="email"]');

    // Name should show error
    const nameError = page.locator('.form-group').filter({ has: page.locator('#name') }).locator('.form-error');
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveText('Este campo es obligatorio');
  });

  test('filling a required field clears its error', async ({ page }) => {
    // Submit empty to trigger errors
    await page.click('button:has-text("Enviar mensaje")');
    await expect(page.locator('.form-error').first()).toBeVisible();

    // Fill name and blur
    await page.fill('input[name="name"]', 'Test User');
    await page.click('input[name="email"]');

    // Name error should be gone
    const nameError = page.locator('.form-group').filter({ has: page.locator('#name') }).locator('.form-error');
    await expect(nameError).not.toBeVisible();
  });

  test('form does not submit with validation errors', async ({ page }) => {
    // Fill only name, leave other required fields empty
    await page.fill('input[name="name"]', 'Only Name');
    await page.click('button:has-text("Enviar mensaje")');

    // Should still be on form, not success state
    await expect(page.locator('button:has-text("Enviar mensaje")')).toBeVisible();
    await expect(page.locator('.form-error')).toHaveCount(3); // email, type, message
  });
});
