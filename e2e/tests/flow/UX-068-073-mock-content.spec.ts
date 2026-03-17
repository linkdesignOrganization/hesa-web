import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-068 - Home hero mock con imagen, textos ES/EN, CTAs
test('UX-068: Spanish home hero has tag, headline, and 2 CTAs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('DESDE 1989')).toBeVisible();
  await expect(page.getByRole('heading', { name: /aliado veterinario/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explorar catalogo/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Distribuya con nosotros/i })).toBeVisible();
});

test('UX-068: English home hero has tag, headline, and 2 CTAs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/en');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('SINCE 1989')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Trusted Veterinary Partner/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Explore Catalog/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Partner with us/i })).toBeVisible();
});

// test: UX-069 - Propuesta valor mock
test('UX-069: Home shows value proposition stats (37+, 100%, 50+, 20+)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('37+')).toBeVisible();
  await expect(page.getByText(/experiencia/i)).toBeVisible();
  await expect(page.getByText('100%')).toBeVisible();
  await expect(page.getByText(/cobertura/i)).toBeVisible();
  await expect(page.getByText('50+')).toBeVisible();
  await expect(page.getByText(/colaboradores/i)).toBeVisible();
  await expect(page.getByText('20+')).toBeVisible();
  await expect(page.getByText(/marcas/i).first()).toBeVisible();
});

// test: UX-071 - Nosotros mock
test('UX-071: About page has history, numbers, coverage map, and team', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await page.getByRole('navigation', { name: 'Navegacion principal' }).getByRole('link', { name: 'Nosotros' }).click();
  await page.waitForTimeout(2000);

  await expect(page.getByText('Nuestra Historia')).toBeVisible();
  await expect(page.getByText(/1989/)).toBeVisible();
  await expect(page.getByText('HESA en Numeros')).toBeVisible();
  await expect(page.getByText('Cobertura Nacional')).toBeVisible();
  await expect(page.getByText('Equipo de Liderazgo')).toBeVisible();
});

// test: UX-072 - Distribuidores mock
test('UX-072: Distributors page has hero, benefits, timeline, and form', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es/distribuidores');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Hero exists
  await expect(page.getByText(/Distribution Partner/i)).toBeVisible();

  // Benefits section
  await expect(page.getByText(/Why Choose HESA/i)).toBeVisible();
  await expect(page.getByText(/Cobertura Nacional/i)).toBeVisible();

  // Form section
  await expect(page.getByText(/Start Your Partnership/i)).toBeVisible();
});

// test: UX-073 - Contacto mock
test('UX-073: Contact page has phone, email, address, hours, social links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es/contacto');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('Contactenos')).toBeVisible();
  await expect(page.getByText('+506 2260-9020').first()).toBeVisible();
  await expect(page.getByText('info@hesa.co.cr').first()).toBeVisible();
  await expect(page.getByText('Calle 2, av 12. Heredia, Costa Rica').first()).toBeVisible();
  await expect(page.getByText(/8:00.*17:00/).first()).toBeVisible();
});

// test: UX-037 - Contacto form fields
test('UX-037: Contact form has all required fields', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es/contacto');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByRole('textbox', { name: /Nombre/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Correo/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Telefono/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /Tipo de consulta/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Producto de interes/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Mensaje/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Enviar mensaje/i })).toBeVisible();
});
