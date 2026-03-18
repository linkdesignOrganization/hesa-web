import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-308 to REQ-317: Authentication and Admin Access Edge Cases', () => {

  test('REQ-308: Panel requires authentication for any screen', async ({ page }) => {
    // Try accessing various admin routes without auth
    const adminRoutes = [
      '/admin',
      '/admin/productos',
      '/admin/marcas',
      '/admin/mensajes',
      '/admin/categorias',
      '/admin/configuracion',
    ];

    for (const route of adminRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForTimeout(2000);

      // Should redirect to login
      expect(page.url()).toContain('/admin/login');
    }
  });

  test('REQ-309: Login shows HESA logo + "Iniciar sesion con Microsoft" button (no custom fields)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // Should show HESA branding
    const hesaLogo = page.getByText('HESA');
    await expect(hesaLogo).toBeVisible();

    // Should show heading
    const heading = page.getByRole('heading', { name: /panel de administracion/i });
    await expect(heading).toBeVisible();

    // Should show Microsoft login button
    const msButton = page.getByRole('button', { name: /iniciar sesion con microsoft/i });
    await expect(msButton).toBeVisible();

    // Should NOT have custom username/password fields
    const usernameField = page.locator('input[type="text"][name*="user"], input[name*="email"]');
    expect(await usernameField.count()).toBe(0);

    const passwordField = page.locator('input[type="password"]');
    expect(await passwordField.count()).toBe(0);
  });

  test('REQ-313: Protected routes redirect to login when no session', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForTimeout(2000);

    // Should redirect to /admin/login
    expect(page.url()).toContain('/admin/login');
  });

  test('REQ-316: No user management screen', async ({ page }) => {
    // Try to access a potential user management route
    await page.goto(`${BASE_URL}/admin/usuarios`);
    await page.waitForTimeout(2000);

    // Should redirect to login (not a valid route)
    expect(page.url()).toContain('/admin/login');
  });

  test('REQ-317: Panel does NOT store passwords (no password form)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // No password input should exist on login page
    const passwordInputs = page.locator('input[type="password"]');
    expect(await passwordInputs.count()).toBe(0);

    // Only Microsoft SSO button
    const msButton = page.getByRole('button', { name: /microsoft/i });
    await expect(msButton).toBeVisible();
  });
});
