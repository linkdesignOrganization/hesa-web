import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-056: Category block texts display in Spanish', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.cat-block', { timeout: 10000 });

  const texts = await page.evaluate(() => {
    const blocks = document.querySelectorAll('.cat-block h2');
    return Array.from(blocks).map(h => h.textContent?.trim());
  });

  expect(texts).toContain('Farmacos Veterinarios');
  expect(texts).toContain('Alimentos para Animales');
  expect(texts).toContain('Equipos Veterinarios');
});

test('REQ-056: Category block texts display in English on /en', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/en`);
  await page.waitForSelector('.cat-block', { timeout: 10000 });

  const texts = await page.evaluate(() => {
    const blocks = document.querySelectorAll('.cat-block h2');
    return Array.from(blocks).map(h => h.textContent?.trim());
  });

  expect(texts).toContain('Veterinary Pharmaceuticals');
  expect(texts).toContain('Animal Food');
  expect(texts).toContain('Veterinary Equipment');
});

test('REQ-065: Value stats texts in Spanish', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.value-stat', { timeout: 10000 });

  const labels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.value-stat__label')).map(l => l.textContent?.trim());
  });

  expect(labels.length).toBeGreaterThanOrEqual(4);
  expect(labels.some(l => l?.includes('experiencia'))).toBe(true);
});

test('REQ-065: Value stats texts in English on /en', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/en`);
  await page.waitForSelector('.value-stat', { timeout: 10000 });

  const labels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.value-stat__label')).map(l => l.textContent?.trim());
  });

  expect(labels.length).toBeGreaterThanOrEqual(4);
  expect(labels.some(l => l?.includes('experience') || l?.includes('Years'))).toBe(true);
});

test('REQ-076: CTA fabricantes text in Spanish', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es`);
  await page.waitForSelector('.mfr-cta', { timeout: 10000 });

  const ctaTitle = await page.evaluate(() => {
    const cta = document.querySelector('.mfr-cta h2');
    return cta?.textContent?.trim();
  });

  expect(ctaTitle).toContain('Costa Rica');
});

test('REQ-076: CTA fabricantes text in English on /en', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/en`);
  await page.waitForSelector('.mfr-cta', { timeout: 10000 });

  const ctaTitle = await page.evaluate(() => {
    const cta = document.querySelector('.mfr-cta h2');
    return cta?.textContent?.trim();
  });

  expect(ctaTitle).toContain('Distribution Partner');
});
