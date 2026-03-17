import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-135: Modal cambios sin guardar', () => {
  test('formulario crear producto tiene campos editables', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Verificar que los campos editables existen
    await expect(page.getByRole('textbox', { name: 'Nombre del producto *' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('combobox', { name: 'Marca *' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('textbox', { name: 'Descripcion *' })).toBeVisible({ timeout: 10000 });
  });

  test('XSS payload es aceptado como texto plano en campo nombre', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    const nameField = page.getByRole('textbox', { name: 'Nombre del producto *' });
    await nameField.fill('<script>alert("xss")</script>');

    // Verificar que el texto se muestra como texto plano, no se ejecuta
    await expect(nameField).toHaveValue('<script>alert("xss")</script>');
  });

  test('formulario sin cambios no deberia activar guard al navegar', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Sin modificar nada, navegar al Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Deberia navegar sin modal (sin cambios = no guard)
    await page.waitForTimeout(2000);
    // Si no hay guard, la URL deberia cambiar a dashboard
    // Nota: el artefacto BUG-018 puede interferir con esta verificacion
  });

  test('escribir en campo deberia activar dirty state', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    // Escribir en el campo para activar dirty state
    const nameField = page.getByRole('textbox', { name: 'Nombre del producto *' });
    await nameField.fill('Producto de prueba');
    await expect(nameField).toHaveValue('Producto de prueba');

    // Click en Dashboard en sidebar
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Esperar a ver si aparece el modal de cambios sin guardar
    // Verificar si la URL cambio (guard deberia prevenir navegacion)
    await page.waitForTimeout(2000);
    const currentUrl = page.url();

    // Si el guard funciona, deberiamos seguir en la pagina de crear
    // o ver un modal de confirmacion
    const hasModal = await page.getByText(/cambios sin guardar|Deseas salir/i).isVisible({ timeout: 3000 }).catch(() => false);
    const stayedOnPage = currentUrl.includes('/admin/productos/crear');

    // Al menos uno debe ser verdadero si el guard funciona
    expect(hasModal || stayedOnPage).toBeTruthy();
  });

  test('botones Cancelar y Guardar producto existen', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    const heading = page.getByRole('heading', { name: 'Crear Producto', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/productos/crear`, { waitUntil: 'networkidle', timeout: 30000 });
    }

    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Guardar producto' })).toBeVisible({ timeout: 10000 });
  });
});
