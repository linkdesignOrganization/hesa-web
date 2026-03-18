import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-191: Manufacturer form shows error with retry option', () => {
  test('Error message appears when API fails and data is preserved', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForTimeout(5000);

    // Block API endpoint to simulate failure
    await page.route('**/api/public/contact/**', (route) => {
      route.abort('failed');
    });

    // Fill in manufacturer form
    await page.fill('#company', 'Test Company');
    await page.selectOption('#country', 'United States');
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@test.com');
    await page.fill('#mfr-message', 'Test message for error testing');

    // Scroll to submit button and click
    const submitBtn = page.locator('button:has-text("Enviar consulta")');
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Wait for error state
    await page.waitForTimeout(2000);

    // Verify error message appears
    const errorMsg = page.locator('.contact-form__error-msg');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('No pudimos enviar tu mensaje');

    // Verify form data is preserved
    await expect(page.locator('#company')).toHaveValue('Test Company');
    await expect(page.locator('#contact-name')).toHaveValue('Test User');
    await expect(page.locator('#contact-email')).toHaveValue('test@test.com');
    await expect(page.locator('#mfr-message')).toHaveValue('Test message for error testing');

    // Verify submit button is enabled (allowing retry)
    await expect(submitBtn).toBeEnabled();
  });
});
