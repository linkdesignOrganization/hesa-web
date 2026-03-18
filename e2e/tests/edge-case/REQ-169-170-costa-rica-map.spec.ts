import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-169 & REQ-170: Map of Costa Rica on Nosotros page', () => {
  test('REQ-169: A stylized map of Costa Rica is present', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.about-coverage', { timeout: 10000 });

    // Map placeholder container should be visible
    const mapPlaceholder = page.locator('.about-coverage__map-placeholder');
    await expect(mapPlaceholder).toBeVisible();

    // Should contain reference to Costa Rica map
    const mapText = await mapPlaceholder.textContent();
    expect(mapText).toContain('Mapa de Costa Rica');

    // Legend with zones should exist
    const legend = page.locator('.about-coverage__legend');
    await expect(legend).toBeVisible();

    const legendItems = page.locator('.about-coverage__legend-item');
    expect(await legendItems.count()).toBe(3); // GAM, Rural, Encomiendas
  });

  test('REQ-170: Map is NOT an interactive Google Maps embed', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.about-coverage', { timeout: 10000 });

    // No Google Maps iframe should exist
    const googleMapsIframe = page.locator('iframe[src*="google.com/maps"], iframe[src*="maps.google"]');
    expect(await googleMapsIframe.count()).toBe(0);

    // No Google Maps API script
    const googleMapsScript = page.locator('script[src*="maps.googleapis.com"]');
    expect(await googleMapsScript.count()).toBe(0);

    // The map should be a static visual element (SVG placeholder)
    const mapSvg = page.locator('.about-coverage__map-placeholder svg');
    await expect(mapSvg).toBeVisible();
  });
});
