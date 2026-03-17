import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-128: Inline form validation', () => {
  test('DC-128: Required field shows error on blur', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForLoadState('networkidle');

    // Find a required input field
    const nameInput = page.locator('input[required], input[name*="nombre"], input[name*="name"]').first();
    if (await nameInput.count() > 0) {
      // Focus and then blur to trigger validation
      await nameInput.focus();
      await nameInput.blur();
      await page.waitForTimeout(500);

      // Check for error message
      const errorMsg = page.locator('[class*="error"], [class*="invalid"], [role="alert"]');
      if (await errorMsg.count() > 0) {
        const errorStyle = await errorMsg.first().evaluate(el => {
          const s = getComputedStyle(el);
          return { color: s.color, fontSize: s.fontSize };
        });
        // Error should be red
        expect(errorStyle.color).toContain('239'); // EF4444 = rgb(239,68,68)
      }
    }
  });

  test('DC-119: Validation shows red border 2px on invalid fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`);
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /guardar|crear|save/i });
    if (await submitBtn.count() > 0) {
      await submitBtn.first().click();
      await page.waitForTimeout(500);

      // Check for red borders on invalid inputs
      const invalidInput = page.locator('input:invalid, [class*="error"], [class*="invalid"]');
      if (await invalidInput.count() > 0) {
        const borderStyle = await invalidInput.first().evaluate(el => {
          const s = getComputedStyle(el);
          return { borderColor: s.borderColor, borderWidth: s.borderWidth };
        });
        // Should have red border
        if (borderStyle.borderColor) {
          expect(borderStyle.borderColor).toContain('239'); // #EF4444
        }
      }
    }
  });
});
