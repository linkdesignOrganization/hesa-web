import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-005: Panel carga inicial < 3s', () => {
  test('admin productos carga en menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE}/admin/productos`);
    await page.waitForSelector('.admin__sidebar', { timeout: 5000 });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);

    // Verify content is present
    const hasContent = await page.evaluate(() => {
      const cards = document.querySelectorAll('.product-card, [class*="product-card"]');
      return cards.length > 0;
    });

    expect(hasContent).toBeTruthy();
  });
});
