import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Brands CRUD (REQ-259 to REQ-267)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 *
 * All 9 criteria in this group require an active admin session.
 * Without authentication bypass, these cannot be visually verified.
 *
 * This spec verifies that the routes are protected (redirect to login).
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Brands — Auth Gate (REQ-259 to REQ-267)', () => {

  test('REQ-259: /admin/brands redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/brands`);

    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      const card = page.locator('.login-card');
      await expect(card).toBeVisible();
      await expect(page.locator('h1')).toContainText('Panel de Administracion');
    } catch {
      const url = page.url();
      expect(url).not.toContain('/admin/brands');
    }
  });

  test('REQ-264: /admin/brands/create redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/brands/create`);

    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      await expect(page.locator('.login-card')).toBeVisible();
    } catch {
      const url = page.url();
      expect(url).not.toContain('/admin/brands/create');
    }
  });
});
