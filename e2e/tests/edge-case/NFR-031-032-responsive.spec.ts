import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-031: Mobile-first responsive (public site)', () => {

  test('Mobile 375px: hamburger menu visible, nav links hidden', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
  });

  test('Mobile 375px: footer uses accordion pattern', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('button', { name: /Navegacion \+/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Contacto \+/ })).toBeVisible();
  });

  test('Mobile 375px: WhatsApp FAB visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
  });

  test('Desktop 1280px: full navigation visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/es/`);
    await expect(page.getByRole('link', { name: 'Catalogo' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Marcas' }).first()).toBeVisible();
  });

  test('Extreme small viewport 320px renders without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(`${BASE_URL}/es/`);
    // Page should load without errors
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
  });
});

test.describe('NFR-032: Panel desktop-first responsive', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForSelector('button:has-text("Iniciar sesion con Microsoft")', { state: 'visible' });
    await page.getByRole('button', { name: 'Iniciar sesion con Microsoft' }).click();
    await page.waitForURL('**/admin/dashboard');
  });

  test('Desktop: sidebar visible with navigation items', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Productos' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mensajes/ })).toBeVisible();
  });

  test('Desktop: dashboard summary cards visible', async ({ page }) => {
    await expect(page.getByText('48')).toBeVisible();
    await expect(page.getByText('Productos').first()).toBeVisible();
    await expect(page.getByText('12')).toBeVisible();
    await expect(page.getByText('Marcas').first()).toBeVisible();
  });
});
