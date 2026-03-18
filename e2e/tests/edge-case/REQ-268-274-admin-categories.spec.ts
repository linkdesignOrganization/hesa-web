import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-268 to REQ-274: Admin Categories Edge Cases', () => {

  test('REQ-268: Accessing admin categories redirects to login (no auth)', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categorias`);
    await page.waitForTimeout(2000);

    // Should redirect to login since we have no auth
    expect(page.url()).toContain('/admin/login');

    // Login page should have the HESA branding and Microsoft button
    const heading = page.getByRole('heading', { name: /panel de administracion/i });
    await expect(heading).toBeVisible();

    const msButton = page.getByRole('button', { name: /microsoft/i });
    await expect(msButton).toBeVisible();
  });

  test('REQ-268: Admin categories route responds with 200', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin/categorias`);
    // SPA returns 200 for all routes, Angular router handles redirect internally
    expect(response?.status()).toBe(200);
  });

  // REQ-272: Tags - add with "+" and remove with "x"
  // BLOQUEADO: Requires authenticated admin session to access /admin/categorias
  // Expected behavior:
  // - Each subsection (Familias, Especies, Etapas, Tipos) has a "+" button
  // - Click "+" opens inline input or modal to add new value
  // - Empty value submission shows validation error
  // - Each tag has "x" icon to remove
  // - Clicking "x" initiates removal (with possible warning per REQ-273)

  // REQ-273: Warning when deleting value in use by products
  // BLOQUEADO: Requires authenticated admin session
  // Expected: Modal shows "This value is used by X products. Are you sure?"

  // REQ-274: Filter values in ES/EN bilingual
  // BLOQUEADO: Requires authenticated admin session
  // Expected: Each filter value has ES and EN text fields
});
