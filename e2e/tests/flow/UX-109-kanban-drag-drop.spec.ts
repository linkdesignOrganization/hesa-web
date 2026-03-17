import { test, expect } from '@playwright/test';

// test: UX-109 - Mensajes kanban drag-and-drop para cambiar estado
test.describe('UX-109: Kanban drag-and-drop mensajes', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-109: Vista kanban muestra 3 columnas con conteos', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    // Verificar 3 columnas kanban
    await expect(page.getByText('NUEVOS')).toBeVisible();
    await expect(page.getByText('EN PROCESO')).toBeVisible();
    await expect(page.getByText('ATENDIDOS')).toBeVisible();

    // Verificar conteos
    const nuevosCount = page.locator(':text("NUEVOS") + :text("3"), :text("NUEVOS") ~ :text("3")');
    await expect(page.getByText('NUEVOS').locator('..').getByText(/\d+/)).toBeVisible();
  });

  test('UX-109: Cards de mensajes muestran badge tipo, nombre y preview', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    // Verificar primera card en columna NUEVOS
    await expect(page.getByText('Dr. Roberto Campos')).toBeVisible();
    await expect(page.getByText('Informacion').first()).toBeVisible();
    await expect(page.getByText(/Buenas tardes, me gustaria/)).toBeVisible();
    await expect(page.getByText('Hace 2 horas')).toBeVisible();
  });

  test('UX-109: Cards son clickeables y llevan al detalle', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForSelector('h1:has-text("Mensajes")', { timeout: 15000 });

    // Click en primera card
    await page.getByText('Dr. Roberto Campos').click();

    // Verificar navegacion al detalle
    await expect(page).toHaveURL(/\/admin\/mensajes\/m1/, { timeout: 15000 });
    await expect(page.getByText('Datos de Contacto')).toBeVisible({ timeout: 10000 });
  });
});
