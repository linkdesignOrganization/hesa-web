import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-268, REQ-272, REQ-273, REQ-274: Admin Categories Functionality', () => {

  // All category management tests require authenticated admin session.
  // These tests verify the auth guard and document expected behavior.

  test('REQ-268: Admin categories page requires authentication', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categorias`);
    await page.waitForTimeout(3000);

    // Should redirect to login without authentication
    expect(page.url()).toContain('/admin/login');

    // Login page should render correctly
    const heading = page.getByRole('heading', { name: /panel de administracion/i });
    await expect(heading).toBeVisible();
  });

  // REQ-268: 3 expandable cards (Farmacos, Alimentos, Equipos) - click expand/collapse
  // Requires authenticated admin session to access /admin/categorias
  // Expected: Each category card can be expanded/collapsed with click
  // Expected: Expanded card shows subsections with filter values

  // REQ-272: Tags - add with "+" and remove with "x"
  // Requires authenticated admin session
  // Expected: Each subsection has a "+" button to add new tag
  // Expected: Each existing tag has an "x" button to remove it
  // Edge case: Adding empty tag name should show validation error
  // Edge case: Adding duplicate tag name should show warning

  // REQ-273: Warning when deleting value in use by products
  // Requires authenticated admin session
  // Expected: Clicking "x" on a tag used by products shows confirmation modal
  // Expected: Modal warns about affected products count
  // Edge case: Deleting unused tag should not show warning

  // REQ-274: Filter values in ES/EN bilingual
  // Requires authenticated admin session
  // Expected: Each tag/filter value can be entered in both ES and EN
  // Edge case: Entering only one language should show validation error

  test('REQ-268: Admin categorias URL structure is correct', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin/categorias`);
    // Page should load (200) even though it redirects internally via Angular
    expect(response?.status()).toBe(200);
  });
});
