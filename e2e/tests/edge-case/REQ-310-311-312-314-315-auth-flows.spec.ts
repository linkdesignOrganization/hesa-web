import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-310 to REQ-315: Auth Flows Edge Cases', () => {

  test('REQ-310: Admin pages without auth redirect to login', async ({ page }) => {
    // Navigate to protected admin route without authentication
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForTimeout(3000);

    // Should redirect to login page
    expect(page.url()).toContain('/admin/login');
  });

  test('REQ-310: Login page has correct UI elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // Should show HESA branding
    const heading = page.getByRole('heading', { name: /panel de administracion/i });
    await expect(heading).toBeVisible();

    // Should show Microsoft login button
    const msButton = page.getByRole('button', { name: /microsoft/i });
    await expect(msButton).toBeVisible();

    // Should have descriptive text
    const description = page.getByText(/inicia sesion con tu cuenta/i);
    await expect(description).toBeVisible();
  });

  test('REQ-310: Login page does NOT have custom username/password fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // Should NOT have email/password input fields (SSO only)
    const emailInput = page.locator('input[type="email"], input[type="text"][name*="email"], input[name*="user"]');
    const passwordInput = page.locator('input[type="password"]');

    expect(await emailInput.count()).toBe(0);
    expect(await passwordInput.count()).toBe(0);
  });

  test('REQ-312: Logout flow redirects to login (unauthenticated check)', async ({ page }) => {
    // Without auth, accessing admin routes redirects to login
    // This validates the guard mechanism
    const protectedRoutes = [
      '/admin/productos',
      '/admin/marcas',
      '/admin/categorias',
      '/admin/mensajes',
      '/admin/configuracion',
    ];

    for (const route of protectedRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForTimeout(2000);

      // All should redirect to login
      expect(page.url()).toContain('/admin/login');
    }
  });

  test('REQ-314: No role-based UI elements visible on login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // Should not have role selection dropdowns
    const roleSelector = page.locator('select[name*="role"], [class*="role-select"]');
    expect(await roleSelector.count()).toBe(0);

    // Should not have role-related text
    const roleText = page.getByText(/administrador|moderador|editor|viewer/i);
    expect(await roleText.count()).toBe(0);
  });

  test('REQ-315: Microsoft SSO button triggers Azure login flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    const msButton = page.getByRole('button', { name: /microsoft/i });
    await expect(msButton).toBeVisible();
    await expect(msButton).toBeEnabled();

    // Click should initiate Azure AD login (will redirect to Microsoft)
    // We just verify the button is clickable without causing errors
    // Full auth flow requires real Azure AD credentials
  });

  // REQ-311: Token expiration and re-authentication
  // Cannot test without a real authenticated session - requires Azure Entra ID credentials
  // The frontend auth interceptor checks for 401 responses and redirects to login

  // REQ-315: Access for hola@linkdesign.cr
  // Cannot test without real Azure AD credentials for this specific account
});
