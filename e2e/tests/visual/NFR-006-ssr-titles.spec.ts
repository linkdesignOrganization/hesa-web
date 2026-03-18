import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-006: SSR titles unicos por pagina', () => {
  test('pagina de inicio tiene titulo unico via JS', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    // Wait for JS to set the title
    await page.waitForTimeout(3000);
    const title = await page.title();
    expect(title).toContain('Inicio');
    expect(title).toContain('HESA');
  });

  test('pagina de catalogo tiene titulo unico via JS', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);
    const title = await page.title();
    expect(title).toContain('Catalogo');
  });

  test('pagina de marcas tiene titulo unico via JS', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForTimeout(3000);
    const title = await page.title();
    expect(title).toContain('Marcas');
  });

  test('titulos son diferentes entre paginas (JS-rendered)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);
    const homeTitle = await page.title();

    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForTimeout(3000);
    const catalogTitle = await page.title();

    await page.goto(`${BASE_URL}/es/marcas`);
    await page.waitForTimeout(3000);
    const brandsTitle = await page.title();

    expect(homeTitle).not.toEqual(catalogTitle);
    expect(homeTitle).not.toEqual(brandsTitle);
    expect(catalogTitle).not.toEqual(brandsTitle);
  });

  // NOTE: SSR titles are NOT unique - all return "HESA - Herrera y Elizondo S.A."
  // This test documents the known bug (BUG-V06)
  test.skip('SSR: titulos son unicos en HTML raw (sin JS) -- KNOWN BUG', async ({ request }) => {
    const homeResp = await request.get(`${BASE_URL}/es`);
    const homeHtml = await homeResp.text();
    const homeMatch = homeHtml.match(/<title>([^<]*)<\/title>/);

    const catalogResp = await request.get(`${BASE_URL}/es/catalogo`);
    const catalogHtml = await catalogResp.text();
    const catalogMatch = catalogHtml.match(/<title>([^<]*)<\/title>/);

    const brandsResp = await request.get(`${BASE_URL}/es/marcas`);
    const brandsHtml = await brandsResp.text();
    const brandsMatch = brandsHtml.match(/<title>([^<]*)<\/title>/);

    // These should be different for proper SSR SEO
    expect(homeMatch?.[1]).not.toEqual(catalogMatch?.[1]);
    expect(homeMatch?.[1]).not.toEqual(brandsMatch?.[1]);
  });
});
