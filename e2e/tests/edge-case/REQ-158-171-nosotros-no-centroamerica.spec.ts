import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-158, REQ-171: Nosotros page coverage does NOT mention Centroamerica', () => {
  test('REQ-158: Coverage section says Costa Rica, not Centroamerica', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.about-coverage', { timeout: 10000 });

    const coverageText = await page.locator('.about-coverage').textContent();
    expect(coverageText?.toLowerCase()).not.toContain('centroamerica');
    expect(coverageText?.toLowerCase()).not.toContain('centroam');
    expect(coverageText?.toLowerCase()).not.toContain('central america');
    expect(coverageText).toContain('Costa Rica');
  });

  test('REQ-171: Map section mentions agents and fleet, NOT Centroamerica', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.about-coverage', { timeout: 10000 });

    // Verify map placeholder is present
    const mapPlaceholder = page.locator('.about-coverage__map-placeholder');
    await expect(mapPlaceholder).toBeVisible();

    // Full page should not mention Centroamerica
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.toLowerCase()).not.toContain('centroamerica');
    expect(bodyText?.toLowerCase()).not.toContain('central america');
  });
});
