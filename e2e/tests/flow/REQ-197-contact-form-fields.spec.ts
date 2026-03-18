import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-197 - Formulario de contacto general incluye todos los campos requeridos
test('REQ-197: Contact form has all required fields (Nombre, Correo, Telefono, Tipo, Producto, Mensaje)', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 10000 });

  // Required fields with asterisk
  await expect(page.locator('label:has-text("Nombre")')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();

  await expect(page.locator('label:has-text("Correo electronico")')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();

  // Optional phone field
  await expect(page.locator('label:has-text("Telefono")')).toBeVisible();
  await expect(page.locator('input[name="phone"]')).toBeVisible();

  // Dropdown for consultation type
  await expect(page.locator('label:has-text("Tipo de consulta")')).toBeVisible();
  await expect(page.locator('select[name="consultationType"]')).toBeVisible();

  // Verify dropdown options
  const select = page.locator('select[name="consultationType"]');
  const options = await select.locator('option').allTextContents();
  expect(options).toContain('Informacion de productos');
  expect(options).toContain('Condiciones comerciales');
  expect(options).toContain('Soporte');
  expect(options).toContain('Otro');

  // Optional product of interest
  await expect(page.locator('label:has-text("Producto de interes")')).toBeVisible();
  await expect(page.locator('input[name="productOfInterest"]')).toBeVisible();

  // Required message field
  await expect(page.locator('label:has-text("Mensaje")')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();

  // Submit button
  await expect(page.locator('button[type="submit"]:has-text("Enviar mensaje")')).toBeVisible();

  // Honeypot field (hidden)
  const honeypot = page.locator('input[name="website"]');
  await expect(honeypot).toBeAttached();
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
});
