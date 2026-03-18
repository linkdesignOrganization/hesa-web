import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Categories UI (REQ-269 to REQ-271)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 *
 * REQ-269: Card Farmacos: subsecciones "Familias farmaceuticas" y "Especies"
 * REQ-270: Card Alimentos: subsecciones "Etapas de vida" y "Especies"
 * REQ-271: Card Equipos: subseccion "Tipos de equipo"
 *
 * All 4 criteria require an active admin session to view categories management.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Categories — Auth Gate (REQ-269 to REQ-271)', () => {

  test('REQ-269-271: /admin/categories redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categories`);

    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      const card = page.locator('.login-card');
      await expect(card).toBeVisible();
    } catch {
      const url = page.url();
      // Should not stay on categories page without auth
      expect(url.includes('/admin/login') || !url.includes('/admin/categories')).toBeTruthy();
    }
  });
});
