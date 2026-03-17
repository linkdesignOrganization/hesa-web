import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-111: Detalle producto 404', () => {
  test('producto inexistente muestra pagina 404 estilizada', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos/producto-inexistente-xyz`);
    await page.waitForTimeout(2000);

    const pageContent = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        h1Text: h1?.textContent?.trim(),
        hasBackLink: !!document.querySelector('a[href*="catalogo"]')
      };
    });

    expect(pageContent.h1Text).toContain('no esta disponible');
  });
});
