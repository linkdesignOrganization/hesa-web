import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-175: Distribuidores page must NOT mention Centroamerica', () => {
  test('ES version does not contain Centroamerica', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.toLowerCase()).not.toContain('centroamerica');
    expect(bodyText?.toLowerCase()).not.toContain('centroam');
    expect(bodyText?.toLowerCase()).not.toContain('central america');
  });

  test('EN version does not contain Central America', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/distributors`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.toLowerCase()).not.toContain('central america');
    expect(bodyText?.toLowerCase()).not.toContain('centroamerica');
    expect(bodyText?.toLowerCase()).not.toContain('centroam');
  });
});
