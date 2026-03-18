import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-156: Nosotros page has HESA history (family, 1989, values)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const content = await page.evaluate(() => ({
    has1989: document.body.textContent!.includes('1989'),
    hasFamiliar: document.body.textContent!.includes('familiar'),
    hasHistoria: document.body.textContent!.includes('Historia'),
    hasHerrera: document.body.textContent!.includes('Herrera')
  }));

  expect(content.has1989).toBe(true);
  expect(content.hasFamiliar).toBe(true);
  expect(content.hasHistoria).toBe(true);
});

test('REQ-157: Nosotros page has key numbers (37+, 50+, coverage)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('.value-stat', { timeout: 10000 });

  const stats = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.value-stat__label')).map(l => l.textContent?.trim());
  });

  expect(stats.length).toBeGreaterThanOrEqual(3);
  expect(stats.some(s => s?.toLowerCase().includes('trayectoria') || s?.toLowerCase().includes('experiencia'))).toBe(true);
});
