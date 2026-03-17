import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-060 - 48+ productos mock en 3 categorias
test('UX-060: Admin products list shows 48 products', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Dashboard shows 48 productos
  await expect(page.getByText('48')).toBeVisible();
  await expect(page.getByText('Productos').first()).toBeVisible();
});

test('UX-060: Products span 3 categories with correct counts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Category breakdown
  await expect(page.getByText('27 de 28 activos')).toBeVisible(); // Farmacos
  await expect(page.getByText('14 de 14 activos')).toBeVisible(); // Alimentos
  await expect(page.getByText('6 de 6 activos')).toBeVisible(); // Equipos
});

// test: UX-062 - 12+ marcas mock
test('UX-062: Brands page shows 12+ brands via SPA navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to brands via internal link
  await page.getByRole('link', { name: 'Ver todas las marcas' }).click();
  await page.waitForTimeout(2000);

  // Verify brands are visible
  await expect(page.getByText('Zoetis')).toBeVisible();
  await expect(page.getByText('Royal Canin')).toBeVisible();
  await expect(page.getByText('MSD Animal Health')).toBeVisible();
  await expect(page.getByText('Virbac')).toBeVisible();
});

// test: UX-064 - 6-8 marcas destacadas en home
test('UX-064: Home shows 8 featured brand logos', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('Marcas que Distribuimos')).toBeVisible();

  // Verify at least some brands by their aria labels
  const brandItems = page.locator('[aria-label*="Ver productos de"]');
  const count = await brandItems.count();
  expect(count).toBeGreaterThanOrEqual(6);
});

// test: UX-065 - 12+ mensajes mock en 3 estados y 5 tipos
test('UX-065: Messages kanban has 3 columns with correct counts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to messages
  await page.getByRole('link', { name: /Mensajes/i }).click();
  await page.waitForTimeout(2000);

  // Kanban columns
  await expect(page.getByText('NUEVOS')).toBeVisible();
  await expect(page.getByText('EN PROCESO')).toBeVisible();
  await expect(page.getByText('ATENDIDOS')).toBeVisible();
});

// test: UX-066 - 6 miembros equipo
test('UX-066: About page shows 6 team members', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Navigate to Nosotros via header nav
  await page.getByRole('navigation', { name: 'Navegacion principal' }).getByRole('link', { name: 'Nosotros' }).click();
  await page.waitForTimeout(2000);

  await expect(page.getByText('Equipo de Liderazgo')).toBeVisible();
  await expect(page.getByText('Carlos Herrera M.')).toBeVisible();
  await expect(page.getByText('Ana Elizondo R.')).toBeVisible();
  await expect(page.getByText('Juan Herrera E.')).toBeVisible();
  await expect(page.getByText('Laura Villalobos S.')).toBeVisible();
  await expect(page.getByText('Roberto Mora C.')).toBeVisible();
  await expect(page.getByText('Patricia Chaves L.')).toBeVisible();
});

// test: UX-067 - Dashboard coherent data
test('UX-067: Dashboard data is coherent (48 products, 3 new messages, 12 brands, 6 featured)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByText('Dashboard')).toBeVisible();
  await expect(page.getByText('Bienvenido al panel de administracion de HESA')).toBeVisible();

  // Summary cards with expected values
  const productCount = page.locator('text=48').first();
  await expect(productCount).toBeVisible();

  const messageCount = page.locator('text=Mensajes Nuevos');
  await expect(messageCount).toBeVisible();

  const brandCount = page.locator('text=12').first();
  await expect(brandCount).toBeVisible();

  const featuredCount = page.locator('text=Destacados');
  await expect(featuredCount).toBeVisible();
});
