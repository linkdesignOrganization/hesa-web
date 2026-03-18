import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: NFR-029 - OG tags implementados para compartir en Facebook/LinkedIn
test('NFR-029: OG tags are set on the home page after Angular renders', async ({ page }) => {
  await page.goto(`${BASE_URL}/es`);
  // Wait for Angular to fully render and set meta tags
  await page.waitForTimeout(3000);

  // Verify og:title
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  expect(ogTitle).toBeTruthy();
  expect(ogTitle).toContain('HESA');

  // Verify og:description
  const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
  expect(ogDesc).toBeTruthy();

  // Verify og:type
  const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
  expect(ogType).toBe('website');

  // Verify og:site_name
  const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
  expect(ogSiteName).toContain('HESA');
});

// test: NFR-029 - OG tags on contact page
test('NFR-029: OG tags are set on internal pages (contact)', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForTimeout(3000);

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  expect(ogTitle).toBeTruthy();
  expect(ogTitle).toContain('Contacto');
});

// test: NFR-029 - OG tags on product detail page
test('NFR-029: OG tags are set on product detail page', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-veterinaria`);
  await page.waitForTimeout(3000);

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  expect(ogTitle).toBeTruthy();
  expect(ogTitle).toContain('Amoxicilina');

  // Product pages should have og:url
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
  expect(ogUrl).toBeTruthy();
});
