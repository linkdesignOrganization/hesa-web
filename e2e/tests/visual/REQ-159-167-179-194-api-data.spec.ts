import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test('REQ-159: Nosotros content loads from API', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const hasContent = await page.evaluate(() => {
    return {
      hasTitle: !!document.querySelector('h1'),
      hasHistory: document.body.textContent!.includes('1989'),
      hasTeam: document.querySelectorAll('[class*="member"] h3, [class*="team"] h3').length >= 6
    };
  });

  expect(hasContent.hasTitle).toBe(true);
  expect(hasContent.hasHistory).toBe(true);
  expect(hasContent.hasTeam).toBe(true);
});

test('REQ-179: Distribuidores content loads from API', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/distribuidores`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const hasContent = await page.evaluate(() => {
    return {
      hasHero: !!document.querySelector('h1'),
      hasBenefits: document.querySelectorAll('[class*="benefit"] h3, [class*="card"] h3').length >= 3,
      hasTimeline: document.body.textContent!.includes('Contacto Inicial')
    };
  });

  expect(hasContent.hasHero).toBe(true);
  expect(hasContent.hasTimeline).toBe(true);
});

test('REQ-194: Contacto data loads from API', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/contacto`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const contactData = await page.evaluate(() => ({
    hasPhone: document.body.textContent!.includes('+506 2260-9020'),
    hasEmail: document.body.textContent!.includes('info@hesa.co.cr'),
    hasAddress: document.body.textContent!.includes('Heredia'),
    hasSchedule: document.body.textContent!.includes('8:00')
  }));

  expect(contactData.hasPhone).toBe(true);
  expect(contactData.hasEmail).toBe(true);
  expect(contactData.hasAddress).toBe(true);
  expect(contactData.hasSchedule).toBe(true);
});
