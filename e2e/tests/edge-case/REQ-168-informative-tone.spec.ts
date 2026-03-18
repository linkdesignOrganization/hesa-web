import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-168: Content has informative and accessible tone (not legal)', () => {
  test('nosotros page uses informative language, not legal jargon', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    const bodyText = await page.locator('body').textContent() || '';

    // Should NOT contain heavy legal language
    expect(bodyText.toLowerCase()).not.toContain('clausula');
    expect(bodyText.toLowerCase()).not.toContain('obligatorio');
    expect(bodyText.toLowerCase()).not.toContain('penalizacion');
    expect(bodyText.toLowerCase()).not.toContain('sancion');
    expect(bodyText.toLowerCase()).not.toContain('incumplimiento');

    // Should contain friendly/informative language
    const hasInformativeWords =
      bodyText.toLowerCase().includes('consulte') ||
      bodyText.toLowerCase().includes('conozca') ||
      bodyText.toLowerCase().includes('ofrecemos') ||
      bodyText.toLowerCase().includes('nuestros clientes');
    expect(hasInformativeWords).toBe(true);
  });
});
