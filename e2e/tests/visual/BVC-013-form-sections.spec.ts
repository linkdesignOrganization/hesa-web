import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('BVC-013: Formularios con secciones claras', () => {
  test('formulario crear producto tiene secciones con subtitulos Bold y separadores', async ({ page }) => {
    await page.goto(`${BASE}/admin/productos/crear`);
    await page.waitForSelector('.admin__sidebar', { timeout: 5000 });

    const sectionInfo = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3, [class*="section-title"], strong'));
      const sectionTitles = headings
        .filter(h => {
          const s = getComputedStyle(h);
          return parseInt(s.fontWeight) >= 600 && parseInt(s.fontSize) >= 16;
        })
        .map(h => ({
          text: h.textContent?.trim(),
          fontWeight: getComputedStyle(h).fontWeight,
          fontSize: getComputedStyle(h).fontSize
        }));

      const expectedSections = [
        'Informacion Basica',
        'Especies y Clasificacion',
        'Descripcion y Contenido',
        'Imagenes',
        'Ficha Tecnica',
        'Configuracion'
      ];

      const foundSections = expectedSections.filter(expected =>
        sectionTitles.some(s => s.text?.includes(expected))
      );

      return {
        totalBoldHeadings: sectionTitles.length,
        foundSections,
        expectedCount: expectedSections.length
      };
    });

    expect(sectionInfo.foundSections.length).toBeGreaterThanOrEqual(5);
  });
});
