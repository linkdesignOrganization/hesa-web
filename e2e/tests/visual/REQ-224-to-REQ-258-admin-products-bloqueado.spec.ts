import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Products CRUD (REQ-224 to REQ-258)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 *
 * All 35 criteria in this group require an active admin session.
 * Without authentication bypass, these cannot be visually verified.
 *
 * This spec verifies that the routes are protected (redirect to login).
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Products — Auth Gate (REQ-224 to REQ-258)', () => {

  test('REQ-224: /admin/products redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products`);

    // Wait for either login card or URL change
    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      const card = page.locator('.login-card');
      await expect(card).toBeVisible();
      await expect(page.locator('h1')).toContainText('Panel de Administracion');
    } catch {
      // Page may redirect away from admin entirely
      const url = page.url();
      expect(url).not.toContain('/admin/products');
    }
  });

  test('REQ-234: /admin/products/create redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products/create`);

    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      await expect(page.locator('.login-card')).toBeVisible();
    } catch {
      const url = page.url();
      expect(url).not.toContain('/admin/products/create');
    }
  });

  test('REQ-255: /admin/products/[id] redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/products/some-product-id`);

    try {
      await page.waitForSelector('.login-card', { timeout: 8000 });
      await expect(page.locator('.login-card')).toBeVisible();
    } catch {
      const url = page.url();
      expect(url).not.toContain('/admin/products/some-product-id');
    }
  });
});
