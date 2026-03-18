import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

test.describe('NFR-006 to NFR-013: SEO and Meta Tags Edge Cases', () => {

  test('NFR-006: Each public page has unique meta title (JS-rendered)', async ({ page }) => {
    const pageTitles: Record<string, string> = {};

    const pages = [
      { url: '/es', name: 'Home ES' },
      { url: '/es/catalogo', name: 'Catalogo ES' },
      { url: '/es/marcas', name: 'Marcas ES' },
      { url: '/es/nosotros', name: 'Nosotros ES' },
      { url: '/es/contacto', name: 'Contacto ES' },
    ];

    for (const p of pages) {
      await page.goto(`${BASE_URL}${p.url}`);
      await page.waitForTimeout(3000);
      pageTitles[p.name] = await page.title();
    }

    // All titles should be different
    const uniqueTitles = new Set(Object.values(pageTitles));
    expect(uniqueTitles.size).toBe(pages.length);
  });

  test('NFR-006: SSR titles should be unique per page (not same generic title)', async ({ request }) => {
    const pages = ['/es', '/es/catalogo', '/es/marcas', '/es/nosotros', '/es/contacto'];
    const titles: string[] = [];

    for (const p of pages) {
      const response = await request.get(`${BASE_URL}${p}`);
      const html = await response.text();
      const match = html.match(/<title>([^<]+)<\/title>/);
      if (match) titles.push(match[1]);
    }

    // SSR: At least some titles should differ (not all identical "HESA - Herrera...")
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBeGreaterThan(1);
  });

  test('NFR-007: Sitemap XML accessible and returns valid XML', async ({ request }) => {
    // Static web app redirects /sitemap.xml to API endpoint
    const response = await request.get(`${BASE_URL}/sitemap.xml`, {
      maxRedirects: 0
    });

    // Should redirect (301) to API
    expect(response.status()).toBe(301);
  });

  test('NFR-007: Sitemap API endpoint returns valid XML', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/sitemap.xml`);
    const body = await response.text();

    // Should be XML, not HTML error page
    const isXml = body.includes('<?xml') || body.includes('<urlset');
    const isHtml = body.includes('<!doctype html') || body.includes('<!DOCTYPE html') || body.includes('Cannot GET');

    expect(isHtml).toBe(false);
    expect(isXml).toBe(true);
  });

  test('NFR-008: JSON-LD Schema markup (Organization) present on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const jsonLd = page.locator('script[type="application/ld+json"]');
    expect(await jsonLd.count()).toBeGreaterThan(0);

    if (await jsonLd.count() > 0) {
      const content = await jsonLd.first().textContent();
      expect(content).toBeTruthy();
      const parsed = JSON.parse(content!);
      expect(parsed['@type']).toBe('Organization');
    }
  });

  test('NFR-010: Images have descriptive alt text in current language', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(4000);

    const images = page.locator('img:visible');
    const imgCount = await images.count();

    let missingAlt = 0;
    for (let i = 0; i < imgCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (!alt || alt.trim() === '') {
        missingAlt++;
      }
    }
    // Most images should have alt text (allow some decorative icons)
    expect(missingAlt).toBeLessThan(imgCount * 0.3);
  });

  test('NFR-011: hreflang tags connect ES and EN versions', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const hreflangEs = page.locator('link[hreflang="es"]');
    const hreflangEn = page.locator('link[hreflang="en"]');

    expect(await hreflangEs.count()).toBeGreaterThan(0);
    expect(await hreflangEn.count()).toBeGreaterThan(0);
  });

  test('NFR-012: robots.txt exists and is valid text format', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    const body = await response.text();

    // Should NOT be HTML
    const isHtml = body.includes('<!doctype html') || body.includes('<!DOCTYPE html');
    expect(isHtml).toBe(false);

    // Should contain User-agent directive
    expect(body).toContain('User-agent');

    // Should disallow /admin/
    expect(body).toContain('Disallow: /admin/');

    // Should reference sitemap
    expect(body.toLowerCase()).toContain('sitemap');
  });

  test('NFR-012: Public pages are indexable (no noindex)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const noindex = page.locator('meta[name="robots"][content*="noindex"]');
    expect(await noindex.count()).toBe(0);
  });

  test('NFR-013: Admin panel has meta noindex', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForTimeout(2000);

    // Admin login page should have noindex meta tag
    const noindex = page.locator('meta[name="robots"][content*="noindex"]');
    expect(await noindex.count()).toBeGreaterThan(0);
  });
});
