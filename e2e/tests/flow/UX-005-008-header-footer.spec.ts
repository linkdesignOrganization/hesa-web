import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-005 - Header publico con logo, links, submenu Catalogo
test('UX-005: Public header has logo linked to home', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const logo = page.getByRole('link', { name: /HESA.*Ir al inicio/i });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('href', /\/es/);
});

test('UX-005: Header has navigation links', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const nav = page.getByRole('navigation', { name: 'Navegacion principal' });
  await expect(nav).toBeVisible();

  await expect(page.getByRole('link', { name: 'Catalogo' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Marcas' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nosotros' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Distribuidores' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contacto' }).first()).toBeVisible();
});

test('UX-005: Catalog submenu has 3 category links', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  // Hover over Catalogo to reveal submenu
  const catalogLink = page.getByRole('navigation', { name: 'Navegacion principal' }).getByRole('link', { name: 'Catalogo' }).first();
  await catalogLink.hover();

  await expect(page.getByRole('link', { name: /Farmacos/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Alimentos/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Equipos/i }).first()).toBeVisible();
});

// test: UX-006 - Header busqueda + selector idioma funcional
test('UX-006: Search button opens search overlay', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const searchBtn = page.getByRole('button', { name: /Buscar productos/i });
  await expect(searchBtn).toBeVisible();

  await searchBtn.click();
  await expect(page.getByRole('textbox', { name: /Buscar productos/i })).toBeVisible();
});

test('UX-006: Language selector is present', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const langSelector = page.getByRole('listbox', { name: /Seleccionar idioma/i }).first();
  await expect(langSelector).toBeVisible();
});

// test: UX-007 - Header sticky, no carrito/cuenta
test('UX-007: No cart or account links in header', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const nav = page.getByRole('navigation', { name: 'Navegacion principal' });
  await expect(nav.getByRole('link', { name: /carrito|cart/i })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: /cuenta|account|login|registro/i })).toHaveCount(0);
});

// test: UX-008 - Footer completo
test('UX-008: Footer has logo, navigation, contact info, social links, copyright', async ({ page }) => {
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');

  const footer = page.getByRole('contentinfo', { name: /Pie de pagina/i });
  await expect(footer).toBeVisible();

  // Navigation links
  await expect(footer.getByRole('link', { name: 'Inicio' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Catalogo' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Marcas' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Nosotros' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Distribuidores' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Contacto' })).toBeVisible();

  // Contact info
  await expect(footer.getByText('+506 2260-9020')).toBeVisible();
  await expect(footer.getByText('info@hesa.co.cr')).toBeVisible();

  // Social links
  await expect(footer.getByRole('link', { name: 'Facebook' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Instagram' })).toBeVisible();

  // Copyright
  await expect(footer.getByText(/HESA 2026/)).toBeVisible();

  // Language selector
  await expect(footer.getByRole('button', { name: /English/i })).toBeVisible();
});
