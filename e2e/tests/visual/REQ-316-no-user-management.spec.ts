import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-316: NO hay pantalla de gestion de usuarios', () => {
  test('admin/usuarios muestra 404 Page not found', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/usuarios`);
    // The route is not defined in app.routes.ts, so it hits the wildcard 404
    await expect(page.getByText('Page not found')).toBeVisible({ timeout: 15000 });
  });

  test('admin/usuarios NO muestra interfaz de gestion de usuarios', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/usuarios`);
    await page.waitForTimeout(3000);
    // Verify there is no user management UI
    const userTable = page.locator('table');
    const userList = page.locator('[class*="user-list"], [class*="usuarios"]');
    await expect(userTable).not.toBeVisible();
    await expect(userList).not.toBeVisible();
  });
});
