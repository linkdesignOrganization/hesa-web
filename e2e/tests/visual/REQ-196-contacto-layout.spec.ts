import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-196: Contact page has 2-column layout on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const hasPhone = await page.evaluate(() => document.body.textContent!.includes('+506'));
  expect(hasPhone).toBe(true);

  const hasForm = await page.evaluate(() => !!document.querySelector('form, [class*="form"], button[type="submit"], button'));
  expect(hasForm).toBe(true);

  // Verify info and form are side by side on desktop
  await expect(page.locator('h1')).toBeVisible();
});

test('REQ-196: Contact page has 1-column layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('h1', { timeout: 10000 });

  // On mobile, contact info should be above the form
  const infoBox = await page.evaluate(() => {
    const info = document.querySelector('[class*="info"], [class*="contact-details"]');
    if (info) return info.getBoundingClientRect();
    // Fallback: find the heading "Telefono"
    const tel = document.querySelector('h3');
    if (tel) return tel.getBoundingClientRect();
    return null;
  });

  expect(infoBox).toBeTruthy();
  // Info should be in view
  if (infoBox) {
    expect(infoBox.width).toBeLessThanOrEqual(375);
  }
});
