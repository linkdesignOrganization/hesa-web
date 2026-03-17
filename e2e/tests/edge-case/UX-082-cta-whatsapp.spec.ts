import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('UX-082: CTA WhatsApp Contextual', () => {

  test('WhatsApp CTA on product detail has contextual message', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo/farmacos/amoxicilina-250ml`);
    await page.mouse.wheel(0, 300);
    const whatsappLink = page.getByRole('link', { name: 'Consultar por WhatsApp' });
    const href = await whatsappLink.getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain('Amoxicilina');
    expect(href).toContain('Zoetis');
  });

  test('WhatsApp FAB is visible on all pages', async ({ page }) => {
    const pages = ['/es/', '/es/catalogo', '/es/marcas', '/es/nosotros', '/es/contacto'];
    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`);
      await expect(page.getByRole('button', { name: 'Contactar por WhatsApp' })).toBeVisible();
    }
  });
});
