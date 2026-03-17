import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('BVC-023: Toast container exists with correct positioning and all variants', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin/categorias`);

  // Verify toast container exists
  const container = page.locator('.toast-container');
  await expect(container).toBeAttached();

  // Verify container positioning
  const styles = await container.evaluate(el => {
    const s = getComputedStyle(el);
    return { position: s.position, top: s.top, right: s.right, zIndex: s.zIndex };
  });
  expect(styles.position).toBe('fixed');
  expect(styles.top).toBe('24px');
  expect(styles.right).toBe('24px');
  expect(parseInt(styles.zIndex)).toBeGreaterThanOrEqual(600);

  // Verify toast CSS classes exist for all variants
  const hasToastStyles = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    let found = { success: false, error: false, warning: false, info: false };
    sheets.forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule.selectorText?.includes('toast--success')) found.success = true;
          if (rule.selectorText?.includes('toast--error')) found.error = true;
          if (rule.selectorText?.includes('toast--warning')) found.warning = true;
          if (rule.selectorText?.includes('toast--info')) found.info = true;
        });
      } catch(e) {}
    });
    return found;
  });
  expect(hasToastStyles.success).toBe(true);
  expect(hasToastStyles.error).toBe(true);
  expect(hasToastStyles.warning).toBe(true);
  expect(hasToastStyles.info).toBe(true);
});
