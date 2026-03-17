import { test, expect } from '@playwright/test';

// test: UX-112 - Equipo de liderazgo con drag-drop reorden y gestion miembros
test.describe('UX-112: Gestion equipo de liderazgo', () => {
  const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

  test('UX-112: Pagina de gestion equipo carga correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/contenido/equipo`);
    await page.waitForSelector('h1, h2', { timeout: 15000 });

    // Verificar que la pagina carga
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
