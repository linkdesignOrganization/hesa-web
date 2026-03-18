import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-192 - Labels y placeholders del formulario de fabricantes en idioma ES
test('REQ-192: Manufacturer form labels are in Spanish when language is ES', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 10000 });

  await expect(page.locator('label:has-text("Nombre de la empresa")')).toBeVisible();
  await expect(page.locator('label:has-text("Pais de origen")')).toBeVisible();
  await expect(page.locator('label:has-text("Nombre de contacto")')).toBeVisible();
  await expect(page.locator('label:has-text("Correo electronico")')).toBeVisible();
  await expect(page.locator('label:has-text("Telefono")')).toBeVisible();
  await expect(page.locator('label:has-text("Tipos de producto")')).toBeVisible();
  await expect(page.locator('label:has-text("Mensaje")')).toBeVisible();

  await expect(page.locator('input[name="companyName"]')).toHaveAttribute('placeholder', 'Nombre de su empresa');
  await expect(page.locator('button[type="submit"]')).toHaveText('Enviar consulta');
});

// test: REQ-192 - Labels y placeholders del formulario de fabricantes en idioma EN
test('REQ-192: Manufacturer form labels are in English when language is EN', async ({ page }) => {
  await page.goto(`${BASE_URL}/en/distributors`);
  await page.waitForSelector('button:has-text("Send Inquiry")', { timeout: 10000 });

  await expect(page.locator('label:has-text("Company Name")')).toBeVisible();
  await expect(page.locator('label:has-text("Country of Origin")')).toBeVisible();
  await expect(page.locator('label:has-text("Contact Name")')).toBeVisible();
  await expect(page.locator('label:has-text("Email")')).toBeVisible();
  await expect(page.locator('label:has-text("Phone")')).toBeVisible();
  await expect(page.locator('label:has-text("Product Types")')).toBeVisible();
  await expect(page.locator('label:has-text("Message")')).toBeVisible();

  await expect(page.locator('input[name="companyName"]')).toHaveAttribute('placeholder', 'Your company name');
  await expect(page.locator('button[type="submit"]')).toHaveText('Send Inquiry');
});
