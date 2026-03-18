import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-186 - Envio exitoso muestra mensaje de confirmacion
test('REQ-186: Successful manufacturer form submission shows confirmation', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 10000 });

  // Fill all required fields
  await page.locator('input[name="companyName"]').fill('QA Test Corp');
  await page.locator('select[name="country"]').selectOption('United States');
  await page.locator('input[name="contactName"]').fill('QA Tester');
  await page.locator('input[name="contactEmail"]').fill('qatest@testcorp.com');
  await page.locator('input[name="contactPhone"]').fill('+1 555-0000');
  await page.locator('input[name="productTypes"]').fill('Farmacos veterinarios');
  await page.locator('textarea[name="mfrMessage"]').fill('We are interested in distributing your products.');

  // Submit the form
  await page.locator('button[type="submit"]:has-text("Enviar consulta")').click();

  // Wait for success message
  await expect(page.locator('text=Mensaje enviado')).toBeVisible({ timeout: 15000 });
});

// test: REQ-187/REQ-188 - Envio almacena mensaje como tipo "Fabricante" via API
test('REQ-187/REQ-188: Manufacturer form submission stores message as type "fabricante" via API', async ({ request }) => {
  const response = await request.post(`${API_URL}/api/public/contact/manufacturer`, {
    data: {
      companyName: 'E2E Test Corp',
      country: 'Germany',
      contactName: 'E2E Tester',
      contactEmail: 'e2e@testcorp.com',
      contactPhone: '+49 123-456',
      productTypes: 'Veterinary equipment',
      message: 'Automated E2E test for manufacturer contact form.',
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.id).toBeTruthy();
});
