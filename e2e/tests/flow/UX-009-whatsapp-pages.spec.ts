import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-009 - WhatsApp FAB en paginas ahora accesibles
test.describe('UX-009: WhatsApp FAB en todas las paginas', () => {

  test('WhatsApp visible en /es/nosotros', async ({ page }) => {
    await page.goto(`${BASE}/es/nosotros`);
    await expect(page.getByRole('heading', { name: 'Herrera y Elizondo S.A.', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
  });

  test('WhatsApp visible en /es/marcas', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas`);
    await expect(page.getByRole('heading', { name: 'Nuestras Marcas', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
  });

  test('WhatsApp visible en /es/catalogo/farmacos', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
  });

  test('WhatsApp visible en /es/marcas/zoetis', async ({ page }) => {
    await page.goto(`${BASE}/es/marcas/zoetis`);
    await expect(page.getByRole('heading', { name: 'Zoetis', level: 1 })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
  });
});
