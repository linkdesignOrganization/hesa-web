import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-021 - Boton flotante WhatsApp visible en todas las paginas
test('REQ-021: WhatsApp FAB is visible on all public pages', async ({ page }) => {
  const pages = [
    '/es',
    '/es/catalogo',
    '/es/marcas',
    '/es/nosotros',
    '/es/distribuidores',
    '/es/contacto',
  ];

  for (const path of pages) {
    await page.goto(`${BASE_URL}${path}`);
    // Wait for Angular to render the FAB
    await page.waitForSelector('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]', { timeout: 10000 });
    const fab = page.locator('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]');
    await expect(fab).toBeVisible();
  }
});

// test: REQ-022 - Click abre WhatsApp con mensaje pre-configurado que incluye contexto
test('REQ-022: WhatsApp FAB link includes context-aware message for general pages', async ({ page }) => {
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]', { timeout: 10000 });

  const fab = page.locator('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]');
  const href = await fab.getAttribute('href');

  // Should link to wa.me with the phone number and a text message
  expect(href).toContain('wa.me/');
  expect(href).toContain('text=');
});

// test: REQ-022 - WhatsApp FAB includes product-specific context on product detail pages
test('REQ-022: WhatsApp FAB includes product context on product detail page', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`);
  await page.waitForSelector('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]', { timeout: 10000 });

  const fab = page.locator('a.whatsapp-fab, [aria-label="Contactar por WhatsApp"]');
  const href = await fab.getAttribute('href');

  // Should contain product context in the message
  expect(href).toContain('wa.me/');
  expect(href).toContain('amoxicilina');
});

// test: REQ-023 - El numero de WhatsApp viene del API site_config
test('REQ-023: WhatsApp number comes from API site config', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/public/config`);
  expect(response.status()).toBe(200);

  const config = await response.json();
  expect(config.whatsapp).toBeTruthy();
  // Verify the number is a valid phone format
  expect(config.whatsapp).toMatch(/^\+?\d[\d\s-]+$/);
});
