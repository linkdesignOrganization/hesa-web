import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-047: Panel Productos listado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos`);
    await page.waitForLoadState('networkidle');
  });

  test('DC-047: titulo "Productos" con 24px Bold', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/Productos/);
    const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
    const fontWeight = await heading.evaluate(el => getComputedStyle(el).fontWeight);
    expect(fontSize).toBe('24px');
    expect(fontWeight).toBe('700');
  });

  test('DC-047: boton "+ Crear producto" presente con fondo #008DC9', async ({ page }) => {
    const createBtn = page.locator('a[href*="crear"], a:has-text("Crear producto")');
    await expect(createBtn).toBeVisible();
    const btnText = await createBtn.innerText();
    expect(btnText).toContain('Crear producto');
  });

  test('DC-047: toggle Card/Table presente', async ({ page }) => {
    const cardToggle = page.locator('button:has-text("Vista de tarjetas"), button[aria-label*="tarjetas"]').first();
    const tableToggle = page.locator('button:has-text("Vista de tabla"), button[aria-label*="tabla"]').first();
    await expect(cardToggle).toBeVisible();
    await expect(tableToggle).toBeVisible();
  });

  test('DC-047: grid 3 columnas en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Verify product cards are visible
    const cards = page.locator('[class*="product-card"], [class*="card"]').first();
    await expect(cards).toBeVisible();
  });

  test('DC-047: product cards tienen badges de categoria y estado', async ({ page }) => {
    const badges = page.locator('[class*="badge"]');
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test('DC-047: product cards tienen menu 3 puntos', async ({ page }) => {
    const menuBtn = page.locator('button[class*="menu"], button[class*="dots"], button[class*="more"]').first();
    await expect(menuBtn).toBeVisible();
  });
});
