import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-113: Sin ficha PDF', () => {
  test('detalle producto con ficha PDF muestra boton de descarga', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.waitForTimeout(2000);

    const hasDownloadBtn = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(l => l.textContent?.includes('Descargar ficha') || l.textContent?.includes('ficha tecnica'));
    });

    // Product with PDF should show the button
    expect(hasDownloadBtn).toBeTruthy();
  });
});
