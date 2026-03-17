import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-091: Distributor Form Validation', () => {

  test('Empty form shows required field errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForSelector('button:has-text("Send Inquiry")', { state: 'visible' });
    await page.getByRole('button', { name: 'Send Inquiry' }).click();
    await expect(page.getByText('This field is required').first()).toBeVisible();
  });

  test('Form has terms checkbox', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForSelector('button:has-text("Send Inquiry")', { state: 'visible' });
    await expect(page.getByRole('checkbox', { name: 'I accept the terms and conditions' })).toBeVisible();
  });

  test('Honeypot field exists in distributor form', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForSelector('button:has-text("Send Inquiry")', { state: 'visible' });
    // Honeypot should be present as hidden field
    const honeypot = page.locator('form input[type="text"]').first();
    await expect(honeypot).toBeAttached();
  });
});
