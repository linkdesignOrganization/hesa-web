import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-182 - Formulario de fabricantes incluye todos los campos requeridos
test('REQ-182: Manufacturer form has all required fields (Empresa, Pais, Contacto, Correo, Telefono, Tipos, Mensaje, Checkbox)', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('button:has-text("Enviar consulta")', { timeout: 10000 });

  // Required fields
  await expect(page.locator('label:has-text("Nombre de la empresa")')).toBeVisible();
  await expect(page.locator('input[name="companyName"]')).toBeVisible();

  await expect(page.locator('label:has-text("Pais de origen")')).toBeVisible();
  await expect(page.locator('select[name="country"]')).toBeVisible();

  await expect(page.locator('label:has-text("Nombre de contacto")')).toBeVisible();
  await expect(page.locator('input[name="contactName"]')).toBeVisible();

  await expect(page.locator('label:has-text("Correo electronico")')).toBeVisible();
  await expect(page.locator('input[name="contactEmail"]')).toBeVisible();

  // Optional fields
  await expect(page.locator('label:has-text("Telefono")')).toBeVisible();
  await expect(page.locator('input[name="contactPhone"]')).toBeVisible();

  await expect(page.locator('label:has-text("Tipos de producto")')).toBeVisible();
  await expect(page.locator('input[name="productTypes"]')).toBeVisible();

  // Required message
  await expect(page.locator('label:has-text("Mensaje")')).toBeVisible();
  await expect(page.locator('textarea[name="mfrMessage"]')).toBeVisible();

  // Terms checkbox
  await expect(page.locator('input[name="termsAccepted"]')).toBeVisible();
  await expect(page.locator('text=Acepto los terminos y condiciones')).toBeVisible();

  // Submit button
  await expect(page.locator('button[type="submit"]:has-text("Enviar consulta")')).toBeVisible();
});
