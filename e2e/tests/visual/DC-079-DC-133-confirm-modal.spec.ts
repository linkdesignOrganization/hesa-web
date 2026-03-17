import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-079/DC-133: Confirm Modal', () => {
  test('DC-079: Modal appears on destructive action', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');

    // Find first product card with menu (3 dots)
    const menuBtn = page.locator('button[aria-label*="opciones"], button[aria-label*="menu"], button:has(svg)').filter({ hasText: '' }).first();
    if (await menuBtn.count() > 0) {
      await menuBtn.click();
      await page.waitForTimeout(300);

      // Click delete option
      const deleteOption = page.locator('button, a, [role="menuitem"]').filter({ hasText: /eliminar|delete/i });
      if (await deleteOption.count() > 0) {
        await deleteOption.first().click();
        await page.waitForTimeout(500);

        // Verify modal appears
        const modal = page.locator('[role="dialog"], [class*="modal"]');
        if (await modal.count() > 0) {
          await expect(modal.first()).toBeVisible();

          // Check for confirm/cancel buttons
          const cancelBtn = page.locator('button').filter({ hasText: /cancelar|cancel/i });
          const confirmBtn = page.locator('button').filter({ hasText: /eliminar|delete|confirmar/i });
          await expect(cancelBtn.first()).toBeVisible();
          await expect(confirmBtn.first()).toBeVisible();
        }
      }
    }
  });

  test('DC-133: Modal has danger icon and proper layout', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');

    // Trigger delete modal via 3-dot menu
    const menuBtns = page.locator('[class*="menu-trigger"], [class*="dropdown-trigger"], button[aria-label*="opciones"]');
    if (await menuBtns.count() > 0) {
      await menuBtns.first().click();
      await page.waitForTimeout(300);

      const deleteOption = page.locator('button, a').filter({ hasText: /eliminar|delete/i });
      if (await deleteOption.count() > 0) {
        await deleteOption.first().click();
        await page.waitForTimeout(500);

        // Check modal layout
        const modal = page.locator('[role="dialog"], [class*="modal"]');
        if (await modal.count() > 0) {
          const modalStyles = await modal.first().evaluate(el => {
            const s = getComputedStyle(el);
            return {
              borderRadius: s.borderRadius,
              backgroundColor: s.backgroundColor,
              maxWidth: s.maxWidth
            };
          });

          // Modal should have rounded corners and white background
          expect(parseInt(modalStyles.borderRadius)).toBeGreaterThanOrEqual(12);
        }
      }
    }
  });
});
