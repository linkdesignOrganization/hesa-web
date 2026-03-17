import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-009 - WhatsApp flotante en todas las paginas
test('UX-009: WhatsApp FAB is visible on home page', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const whatsappBtn = page.getByRole('button', { name: /WhatsApp/i });
  await expect(whatsappBtn).toBeVisible();
});

test('UX-009: WhatsApp FAB is visible on catalog page', async ({ page }) => {
  await page.goto(BASE_URL + '/es/catalogo');
  await page.waitForLoadState('networkidle');

  const whatsappBtn = page.getByRole('button', { name: /WhatsApp/i });
  await expect(whatsappBtn).toBeVisible();
});

test('UX-009: WhatsApp FAB is visible on contact page', async ({ page }) => {
  await page.goto(BASE_URL + '/es/contacto');
  await page.waitForLoadState('networkidle');

  const whatsappBtn = page.getByRole('button', { name: /WhatsApp/i });
  await expect(whatsappBtn).toBeVisible();
});

test('UX-009: WhatsApp FAB is visible on distributors page', async ({ page }) => {
  await page.goto(BASE_URL + '/es/distribuidores');
  await page.waitForLoadState('networkidle');

  const whatsappBtn = page.getByRole('button', { name: /WhatsApp/i });
  await expect(whatsappBtn).toBeVisible();
});
