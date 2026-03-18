import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-268 to REQ-274: Admin Categories (access check)', () => {

  test('REQ-268: Accessing admin categories redirects to login', async ({ page }) => {
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

  // REQ-272, REQ-273, REQ-274 are BLOQUEADO - require authenticated admin session
  // These tests document the expected behavior for when auth is available:
  // - REQ-272: Tags as chips/pills with X to remove, + to add
  // - REQ-273: Warning when deleting a value in use by products
  // - REQ-274: Filter values in ES/EN
});
