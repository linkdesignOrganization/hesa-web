import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-160: Nosotros has semantic URL and unique meta tags', async ({ page }) => {
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    url: window.location.pathname
  }));

  expect(meta.url).toBe('/es/nosotros');
  expect(meta.title).toContain('Nosotros');
  expect(meta.desc).toBeTruthy();
  expect(meta.desc!.length).toBeGreaterThan(20);
});

test('REQ-181: Distributors EN has SEO meta tags optimized for English', async ({ page }) => {
  await page.goto(`${BASE_URL}/en/distributors`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ogDesc: document.querySelector('meta[property="og:description"]')?.getAttribute('content')
  }));

  expect(meta.title).toContain('Distributor');
  expect(meta.desc).toBeTruthy();
  expect(meta.desc).toContain('distributor');
  expect(meta.desc).toContain('Costa Rica');
});
