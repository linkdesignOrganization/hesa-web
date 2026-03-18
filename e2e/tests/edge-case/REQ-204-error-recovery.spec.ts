import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-204: Error recovery without losing data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 15000 });
  });

  test('error state shows retry message', async ({ page }) => {
    // Fill valid form data
    await page.fill('input[name="name"]', 'Error Recovery Test');
    await page.fill('input[name="email"]', 'error@test.com');
    await page.selectOption('select[name="consultationType"]', 'info');
    await page.fill('textarea[name="message"]', 'Testing error recovery');

    // Block API calls to simulate network failure
    await page.route('**/api/public/contact/general', route => {
      route.abort('failed');
    });

    await page.click('button:has-text("Enviar mensaje")');

    // Wait for error state
    await expect(page.locator('.contact-form__error-msg')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.contact-form__error-msg')).toContainText('No pudimos enviar tu mensaje');
  });

  test('data is preserved after error', async ({ page }) => {
    const testName = 'Data Preservation Test';
    const testEmail = 'preserve@test.com';
    const testMessage = 'This data should be preserved after error';

    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.selectOption('select[name="consultationType"]', 'soporte');
    await page.fill('textarea[name="message"]', testMessage);

    // Block API
    await page.route('**/api/public/contact/general', route => {
      route.abort('failed');
    });

    await page.click('button:has-text("Enviar mensaje")');
    await expect(page.locator('.contact-form__error-msg')).toBeVisible({ timeout: 10000 });

    // Verify data is still in the fields
    await expect(page.locator('input[name="name"]')).toHaveValue(testName);
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);
    await expect(page.locator('textarea[name="message"]')).toHaveValue(testMessage);
  });

  test('interacting with field after error resets error state for retry', async ({ page }) => {
    await page.fill('input[name="name"]', 'Reset Test');
    await page.fill('input[name="email"]', 'reset@test.com');
    await page.selectOption('select[name="consultationType"]', 'otro');
    await page.fill('textarea[name="message"]', 'Testing reset');

    // Block API
    await page.route('**/api/public/contact/general', route => {
      route.abort('failed');
    });

    await page.click('button:has-text("Enviar mensaje")');
    await expect(page.locator('.contact-form__error-msg')).toBeVisible({ timeout: 10000 });

    // Unblock API
    await page.unroute('**/api/public/contact/general');

    // Click on a field - should reset error state
    await page.click('input[name="name"]');

    // Error message should disappear (formState resets to idle on blur interaction)
    await expect(page.locator('.contact-form__error-msg')).not.toBeVisible({ timeout: 5000 });

    // Submit button should be re-enabled for retry
    await expect(page.locator('button:has-text("Enviar mensaje")')).toBeEnabled();
  });
});
