import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-081: CTA Solicitar Informacion', () => {

  test('CTA navigates to contact with product query param', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    const ctaLink = page.getByRole('link', { name: 'Solicitar informacion' }).first();
    await expect(ctaLink).toHaveAttribute('href', '/es/contacto?producto=amoxicilina-250ml');
  });

  test('Sticky bar also has Solicitar informacion CTA', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
    const stickyLink = page.getByRole('link', { name: 'Solicitar informacion' }).last();
    await expect(stickyLink).toHaveAttribute('href', '/es/contacto?producto=amoxicilina-250ml');
  });
});
