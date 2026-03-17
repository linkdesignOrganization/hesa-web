import { test, expect } from '@playwright/test';

// test: UX-110 - Toggle entre vista Kanban y Tabla en mensajes
test.describe('UX-110: Toggle Kanban/Tabla en mensajes', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-110: Botones de toggle Kanban y Tabla presentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    await expect(page.getByRole('button', { name: 'Vista Kanban' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vista Tabla' })).toBeVisible();
  });

  test('UX-110: Vista Kanban muestra columnas con cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    // En vista kanban deben verse las 3 columnas
    await expect(page.getByText('NUEVOS')).toBeVisible();
    await expect(page.getByText('EN PROCESO')).toBeVisible();
    await expect(page.getByText('ATENDIDOS')).toBeVisible();
  });

  test('UX-110: Toggle a vista Tabla muestra tabla con datos', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    // Click en Vista Tabla
    await page.getByRole('button', { name: 'Vista Tabla' }).click();

    // Verificar que se muestra una tabla o lista con mensajes
    await expect(page.locator('table, .messages-table')).toBeVisible({ timeout: 10000 });
  });
});
