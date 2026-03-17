import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: UX-010 - Sidebar panel con logo, modulos, submenus, item activo, badge mensajes
test('UX-010: Admin sidebar has all navigation modules', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');

  // Wait for admin layout to render
  await page.waitForTimeout(2000);

  const sidebar = page.getByRole('navigation', { name: /Panel de administracion/i });
  await expect(sidebar).toBeVisible();

  // Main nav items
  await expect(sidebar.getByRole('link', { name: /Dashboard/i })).toBeVisible();
  await expect(sidebar.getByRole('button', { name: /Productos/i })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /Marcas/i })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /Categorias/i })).toBeVisible();
  await expect(sidebar.getByRole('button', { name: /Home/i })).toBeVisible();
  await expect(sidebar.getByRole('button', { name: /Contenido/i })).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /Mensajes/i })).toBeVisible();
  await expect(sidebar.getByRole('button', { name: /Configuracion/i })).toBeVisible();
});

test('UX-010: Mensajes has badge with count', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const mensajesLink = page.getByRole('link', { name: /Mensajes.*3/i });
  await expect(mensajesLink).toBeVisible();
});

test('UX-010: Productos submenu expands with category links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: /Productos/i }).click();

  await expect(page.getByRole('link', { name: 'Todos', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Farmacos', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Alimentos', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Equipos', exact: true })).toBeVisible();
});

// test: UX-011 - Header panel con busqueda, notificaciones, avatar
test('UX-011: Admin header has search, notifications, and avatar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '/admin');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await expect(page.getByRole('textbox', { name: /Buscar/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Notificaciones/i })).toBeVisible();
  await expect(page.getByText('Admin')).toBeVisible();
});
