import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Brands CRUD Visual (REQ-259 to REQ-267)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 * ROUND 2: Auth still not available for automated testing.
 *
 * All 9 criteria require an authenticated admin session.
 * Tests verify auth guard functionality.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Brands — Auth Gate (REQ-259 to REQ-267)', () => {

  test('REQ-259: /admin/marcas redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas`, { waitUntil: 'networkidle' });

    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });

  test('REQ-264: /admin/marcas/crear redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/marcas/crear`, { waitUntil: 'networkidle' });

    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });
});
