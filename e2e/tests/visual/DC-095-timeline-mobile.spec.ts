import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('DC-095: Timeline distribuidores vertical at 375px mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es/distribuidores`);

  const timeline = page.locator('.timeline');
  await expect(timeline).toBeVisible();

  const flexDirection = await timeline.evaluate(el => getComputedStyle(el).flexDirection);
  expect(flexDirection).toBe('column');

  const steps = page.locator('.timeline__step');
  await expect(steps).toHaveCount(4);

  const titles = await steps.locator('h4').allTextContents();
  expect(titles).toEqual(['Contacto Inicial', 'Evaluacion', 'Acuerdo Comercial', 'Distribucion Activa']);
});

test('DC-095: Timeline distribuidores horizontal at desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/distribuidores`);

  const timeline = page.locator('.timeline');
  await expect(timeline).toBeVisible();

  const flexDirection = await timeline.evaluate(el => getComputedStyle(el).flexDirection);
  expect(flexDirection).toBe('row');
});
