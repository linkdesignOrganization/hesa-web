import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-180: English version optimized for manufacturers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/en/distributors`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const content = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    hasPartner: document.body.textContent!.includes('Partner'),
    hasDistribution: document.body.textContent!.includes('Distribution'),
    hasCostaRica: document.body.textContent!.includes('Costa Rica'),
    formLabels: Array.from(document.querySelectorAll('label, [class*="label"]')).map(l => l.textContent?.trim())
  }));

  expect(content.h1).toContain('Distribution Partner');
  expect(content.hasPartner).toBe(true);
  expect(content.hasCostaRica).toBe(true);
  // Form should be in English
  expect(content.formLabels.some(l => l?.includes('Company') || l?.includes('Email'))).toBe(true);
});
