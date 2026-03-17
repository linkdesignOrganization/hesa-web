import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-001 - Ruta raiz `/` redirige a `/es/` o `/en/` segun idioma navegador
test('UX-001: Root URL redirects to language-prefixed route', async ({ page }) => {
  await page.goto(BASE_URL + '/');
  await page.waitForLoadState('networkidle');

  const url = page.url();
  const hasLangPrefix = url.includes('/es') || url.includes('/en');
  expect(hasLangPrefix).toBe(true);
});

test('UX-001: Spanish home page loads correctly at /es', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  expect(page.url()).toContain('/es');
  await expect(page.locator('h1')).toBeVisible();
});

test('UX-001: English home page loads correctly at /en', async ({ page }) => {
  await page.goto(BASE_URL + '/en');
  await page.waitForLoadState('networkidle');

  expect(page.url()).toContain('/en');
  await expect(page.locator('h1')).toBeVisible();
});
