import { test, expect } from '@playwright/test';

const BASE = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-016 - Flujo catalogo filtrado: CTA bloque categoria navega a catalogo/farmacos
test.describe('UX-016: Catalogo filtrado via categoria', () => {

  test('home category block CTA links to /es/catalogo/farmacos', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForTimeout(3000);
    // Find the "Ver farmacos" link
    const farmacosCTA = page.getByRole('link', { name: 'Ver farmacos' });
    await expect(farmacosCTA).toBeVisible({ timeout: 10000 });
    await expect(farmacosCTA).toHaveAttribute('href', '/es/catalogo/farmacos');
  });

  test('catalogo farmacos has category-specific filters', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByRole('heading', { name: 'Farmacos Veterinarios', level: 1 })).toBeVisible({ timeout: 10000 });
    // Marca filter with pharma-specific brands
    const marcaCombo = page.getByRole('combobox').first();
    await expect(marcaCombo).toBeVisible();
    // Should have pharma brands like Zoetis, Bayer
    await expect(page.getByRole('option', { name: 'Zoetis' })).toBeAttached();
    await expect(page.getByRole('option', { name: 'Bayer Animal Health' })).toBeAttached();
  });

  test('catalogo farmacos shows 27 products', async ({ page }) => {
    await page.goto(`${BASE}/es/catalogo/farmacos`);
    await expect(page.getByText('27 productos')).toBeVisible({ timeout: 10000 });
  });
});
