import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-205 - Labels y mensajes del formulario en idioma seleccionado (ES)
test('REQ-205: Contact form labels are in Spanish when language is ES', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 10000 });

  // Verify Spanish labels
  await expect(page.locator('label:has-text("Nombre")')).toBeVisible();
  await expect(page.locator('label:has-text("Correo electronico")')).toBeVisible();
  await expect(page.locator('label:has-text("Telefono")')).toBeVisible();
  await expect(page.locator('label:has-text("Tipo de consulta")')).toBeVisible();
  await expect(page.locator('label:has-text("Producto de interes")')).toBeVisible();
  await expect(page.locator('label:has-text("Mensaje")')).toBeVisible();

  // Verify placeholders
  await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Tu nombre completo');
  await expect(page.locator('textarea[name="message"]')).toHaveAttribute('placeholder', 'Describe tu consulta...');

  // Verify submit button text
  await expect(page.locator('button[type="submit"]')).toHaveText('Enviar mensaje');

  // Verify heading
  await expect(page.locator('h1')).toHaveText('Contactenos');
});

// test: REQ-205 - Labels y mensajes del formulario en idioma seleccionado (EN)
test('REQ-205: Contact form labels are in English when language is EN', async ({ page }) => {
  await page.goto(`${BASE_URL}/en/contact`);
  await page.waitForSelector('button:has-text("Send message")', { timeout: 10000 });

  // Verify English labels
  await expect(page.locator('label:has-text("Name")')).toBeVisible();
  await expect(page.locator('label:has-text("Email")')).toBeVisible();
  await expect(page.locator('label:has-text("Phone")')).toBeVisible();
  await expect(page.locator('label:has-text("Inquiry type")')).toBeVisible();
  await expect(page.locator('label:has-text("Product of interest")')).toBeVisible();
  await expect(page.locator('label:has-text("Message")')).toBeVisible();

  // Verify placeholders
  await expect(page.locator('input[name="name"]')).toHaveAttribute('placeholder', 'Your full name');
  await expect(page.locator('textarea[name="message"]')).toHaveAttribute('placeholder', 'Describe your inquiry...');

  // Verify submit button text
  await expect(page.locator('button[type="submit"]')).toHaveText('Send message');

  // Verify heading
  await expect(page.locator('h1')).toHaveText('Contact Us');
});
