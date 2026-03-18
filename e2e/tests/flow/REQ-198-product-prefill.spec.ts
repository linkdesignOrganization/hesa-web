import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: REQ-198 - Pre-llenado de "Producto de interes" cuando se llega desde detalle de producto
test('REQ-198: Product of interest is pre-filled when arriving from product detail via query param', async ({ page }) => {
  // Navigate to contact page with product query parameter
  await page.goto(`${BASE_URL}/es/contacto?producto=amoxicilina-veterinaria`);
  await page.waitForSelector('button:has-text("Enviar mensaje")', { timeout: 10000 });

  // Verify the product of interest field is pre-filled
  const productField = page.locator('input[name="productOfInterest"]');
  await expect(productField).toHaveValue('amoxicilina veterinaria');
});

// test: REQ-198 - Product detail page has "Solicitar informacion" link pointing to contact with product param
test('REQ-198: Product detail has "Solicitar informacion" link to contact with product param', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`);
  await page.waitForSelector('a:has-text("Solicitar informacion")', { timeout: 10000 });

  const link = page.locator('a:has-text("Solicitar informacion")').first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  expect(href).toContain('/es/contacto?producto=amoxicilina-veterinaria');
});
