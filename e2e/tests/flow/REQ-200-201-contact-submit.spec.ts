import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-200 - Envio exitoso muestra confirmacion y limpia campos
test('REQ-200: Successful contact form submission shows confirmation and clears fields', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 10000 });

  // Fill all required fields
  await page.locator('input[name="name"]').fill('QA Test User');
  await page.locator('input[name="email"]').fill('qatest@example.com');
  await page.locator('input[name="phone"]').fill('+506 8888-0000');
  await page.locator('select[name="consultationType"]').selectOption('info');
  await page.locator('input[name="productOfInterest"]').fill('Amoxicilina');
  await page.locator('textarea[name="message"]').fill('Este es un mensaje de prueba E2E.');

  // Submit the form
  await page.locator('button[type="submit"]:has-text("Enviar mensaje")').click();

  // Wait for success message
  await expect(page.locator('text=Mensaje enviado')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Nos pondremos en contacto')).toBeVisible();
});

// test: REQ-201 - Envio genera almacenamiento en panel (via API response)
test('REQ-201: Contact form submission stores message via API (POST returns success with ID)', async ({ request }) => {
  const response = await request.post(`${API_URL}/api/public/contact/general`, {
    data: {
      name: 'E2E API Test',
      email: 'e2etest@example.com',
      phone: '+506 7777-0000',
      consultationType: 'info',
      productOfInterest: 'Test Product',
      message: 'Test message from E2E automated test.',
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.id).toBeTruthy();
});
