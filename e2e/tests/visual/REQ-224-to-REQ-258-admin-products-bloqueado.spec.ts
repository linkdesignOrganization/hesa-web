import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Products CRUD Visual (REQ-224 to REQ-258)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 * ROUND 2: Auth still not available for automated testing.
 *
 * All 35 criteria require an authenticated admin session.
 * The admin routes correctly redirect to /admin/login without auth.
 * These tests verify the auth guard and login page structure.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Products — Auth Gate & Login Structure (REQ-224 to REQ-258)', () => {

  test('REQ-224: /admin/productos redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`, { waitUntil: 'networkidle' });

    // Should redirect to login page
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });

  test('REQ-234: /admin/productos/crear redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle' });

    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });

  test('REQ-255: /admin/productos/[id] redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/some-product-id`, { waitUntil: 'networkidle' });

    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });

  test('Login page: shows HESA branding and Microsoft login button', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle' });

    // Wait for login card to appear
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Inicia sesion con tu cuenta de Microsoft')).toBeVisible();
    await expect(page.getByRole('button', { name: /Microsoft/i })).toBeVisible();

    // Verify HESA branding
    await expect(page.getByText('HESA')).toBeVisible();
  });
});
