import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// Navigation and i18n flow tests covering multiple criteria

test.describe('Navigation Header Links', () => {
  test('Header navigation links are correct in Spanish', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const nav = page.getByRole('navigation', { name: 'Navegacion principal' });
    await expect(nav).toBeVisible();

    // Verify all nav links
    await expect(nav.getByRole('link', { name: 'Catalogo' }).first()).toHaveAttribute('href', '/es/catalogo');
    await expect(nav.getByRole('link', { name: 'Marcas' })).toHaveAttribute('href', '/es/marcas');
    await expect(nav.getByRole('link', { name: 'Nosotros' })).toHaveAttribute('href', '/es/nosotros');
    await expect(nav.getByRole('link', { name: 'Distribuidores' })).toHaveAttribute('href', '/es/distribuidores');
    await expect(nav.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/es/contacto');
  });

  test('Header navigation links are correct in English', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');

    const nav = page.getByRole('navigation', { name: 'Navegacion principal' });
    await expect(nav).toBeVisible();

    // Verify all nav links
    await expect(nav.getByRole('link', { name: 'Catalog' }).first()).toHaveAttribute('href', '/en/catalog');
    await expect(nav.getByRole('link', { name: 'Brands' })).toHaveAttribute('href', '/en/brands');
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about');
    await expect(nav.getByRole('link', { name: 'Distributors' })).toHaveAttribute('href', '/en/distributors');
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/en/contact');
  });

  test('Header Catalogo dropdown shows subcategories in Spanish', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const nav = page.getByRole('navigation', { name: 'Navegacion principal' });

    // Subcategory links exist
    const farmacosLink = nav.getByRole('link', { name: 'Farmacos Veterinarios' });
    const alimentosLink = nav.getByRole('link', { name: 'Alimentos para Animales' });
    const equiposLink = nav.getByRole('link', { name: 'Equipos Veterinarios' });

    // Check URLs
    await expect(farmacosLink).toHaveAttribute('href', '/es/catalogo/farmacos');
    await expect(alimentosLink).toHaveAttribute('href', '/es/catalogo/alimentos');
    await expect(equiposLink).toHaveAttribute('href', '/es/catalogo/equipos');
  });

  test('Header Catalog dropdown shows subcategories in English', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');

    const nav = page.getByRole('navigation', { name: 'Navegacion principal' });

    // English subcategory links
    const pharmaLink = nav.getByRole('link', { name: 'Veterinary Pharmaceuticals' });
    const foodLink = nav.getByRole('link', { name: 'Animal Food' });
    const equipmentLink = nav.getByRole('link', { name: 'Veterinary Equipment' });

    await expect(pharmaLink).toHaveAttribute('href', '/en/catalog/pharmaceuticals');
    await expect(foodLink).toHaveAttribute('href', '/en/catalog/food');
    await expect(equipmentLink).toHaveAttribute('href', '/en/catalog/equipment');
  });
});

test.describe('Footer Navigation', () => {
  test('Footer links are correct in Spanish', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Navigation section
    await expect(footer.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/es');
    await expect(footer.getByRole('link', { name: 'Catalogo' })).toHaveAttribute('href', '/es/catalogo');
    await expect(footer.getByRole('link', { name: 'Marcas' })).toHaveAttribute('href', '/es/marcas');

    // Contact info
    await expect(footer.getByText('+506 2260-9020')).toBeVisible();
    await expect(footer.getByText('info@hesa.co.cr')).toBeVisible();
    await expect(footer.getByText('Calle 2, av 12. Heredia, Costa Rica')).toBeVisible();
    await expect(footer.getByText('Lun - Vie: 8:00 - 17:00')).toBeVisible();

    // Social media links
    await expect(footer.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', 'https://facebook.com/hesacr');
    await expect(footer.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://instagram.com/hesacr');

    // Copyright
    await expect(footer.getByText(/HESA 2026/)).toBeVisible();
  });

  test('Footer in English has correct translations', async ({ page }) => {
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');

    const footer = page.getByRole('contentinfo');

    // English headings
    await expect(footer.getByRole('heading', { name: 'Navigation' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Contact' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Social Media' })).toBeVisible();

    // English schedule
    await expect(footer.getByText('Mon - Fri: 8:00 - 17:00')).toBeVisible();

    // English copyright
    await expect(footer.getByText(/All rights reserved/)).toBeVisible();
  });
});

test.describe('Language Switcher', () => {
  test('Language selector is visible and shows current language', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    // Language selector button shows "ES"
    const langSelector = page.getByRole('listbox', { name: 'Seleccionar idioma' });
    await expect(langSelector).toBeVisible();
    await expect(langSelector.getByText('ES')).toBeVisible();
  });

  test('Footer language toggle shows opposite language', async ({ page }) => {
    // Spanish page should show "English" toggle in footer
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();

    // English page should show "Espanol" toggle in footer
    await page.goto(`${BASE_URL}/en`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'Espanol' })).toBeVisible();
  });
});

test.describe('WhatsApp CTA', () => {
  test('WhatsApp floating button visible on all pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForLoadState('networkidle');

    const whatsappButton = page.getByRole('button', { name: /whatsapp/i });
    await expect(whatsappButton).toBeVisible();
  });
});
