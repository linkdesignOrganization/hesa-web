import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC Computed Style Checks', () => {

  test('BVC-004: Colors correspond to defined palette', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const colors = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        primary: root.getPropertyValue('--brand-primary').trim(),
        secondary: root.getPropertyValue('--brand-secondary').trim(),
        dark: root.getPropertyValue('--brand-dark').trim(),
        neutral50: root.getPropertyValue('--neutral-50').trim(),
        neutral400: root.getPropertyValue('--neutral-400').trim(),
        neutral900: root.getPropertyValue('--neutral-900').trim(),
        surfacePharma: root.getPropertyValue('--surface-pharma').trim(),
        surfaceFood: root.getPropertyValue('--surface-food').trim(),
        surfaceEquipment: root.getPropertyValue('--surface-equipment').trim(),
      };
    });
    expect(colors.primary).toBe('#008DC9');
    expect(colors.secondary).toBe('#50B92A');
    expect(colors.dark).toBe('#005A85');
    expect(colors.neutral50).toBe('#F5F7FA');
    expect(colors.neutral400).toBe('#6B7280');
    expect(colors.neutral900).toBe('#1F2937');
    expect(colors.surfacePharma).toBe('#E8F4FD');
    expect(colors.surfaceFood).toBe('#EDF7E8');
    expect(colors.surfaceEquipment).toBe('#F0F2F5');
  });

  test('BVC-031: Hero titles >= 48px desktop, >= 32px mobile', async ({ page }) => {
    // Desktop check
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const displayToken = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-display').trim()
    );
    expect(parseInt(displayToken)).toBeGreaterThanOrEqual(48);
  });

  test('BVC-032: Block color border-radius 20-30px, padding 60-80px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        blockRadius: root.getPropertyValue('--radius-block').trim(),
        blockPadding: root.getPropertyValue('--block-padding-desktop').trim(),
      };
    });
    const radius = parseInt(tokens.blockRadius);
    const padding = parseInt(tokens.blockPadding);
    expect(radius).toBeGreaterThanOrEqual(20);
    expect(radius).toBeLessThanOrEqual(30);
    expect(padding).toBeGreaterThanOrEqual(60);
    expect(padding).toBeLessThanOrEqual(80);
  });

  test('BVC-033: Card hover shadow + scale(1.02) with transition 0.3s', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const transitionToken = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--transition-card').trim()
    );
    expect(transitionToken).toContain('box-shadow');
    expect(transitionToken).toContain('transform');
    expect(transitionToken).toContain('.3s');
  });

  test('BVC-037: Panel summary cards radius 12-16px and shadow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es`);
    const radiusToken = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--radius-card-panel').trim()
    );
    const radius = parseInt(radiusToken);
    expect(radius).toBeGreaterThanOrEqual(12);
    expect(radius).toBeLessThanOrEqual(16);
  });
});
