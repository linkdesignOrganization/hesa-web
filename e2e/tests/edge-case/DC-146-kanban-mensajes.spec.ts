import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-146: Kanban de mensajes layout y contenido', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`, { waitUntil: 'networkidle', timeout: 30000 });
    // Retry if public site loads
    const heading = page.getByRole('heading', { name: 'Mensajes', level: 1 });
    if (!(await heading.isVisible({ timeout: 5000 }).catch(() => false))) {
      await page.goto(`${BASE_URL}/admin/mensajes`, { waitUntil: 'networkidle', timeout: 30000 });
    }
  });

  test('kanban tiene 3 columnas con conteos', async ({ page }) => {
    await expect(page.getByText('NUEVOS')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('EN PROCESO')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ATENDIDOS')).toBeVisible({ timeout: 10000 });

    // Verificar conteos
    await expect(page.getByText('"3"').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('"1"').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('"8"').first()).toBeVisible({ timeout: 5000 });
  });

  test('columna NUEVOS tiene 3 cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dr. Roberto Campos' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'John Mitchell' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Cadena VetCR' })).toBeVisible({ timeout: 10000 });
  });

  test('columna EN PROCESO tiene 1 card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dra. Carolina Mendez' })).toBeVisible({ timeout: 10000 });
  });

  test('columna ATENDIDOS tiene 8 cards', async ({ page }) => {
    const atendidosCards = [
      'Agroveterinaria El Campo',
      'Pet Shop Amigos',
      'Dr. Luis Vargas',
      'Akiko Tanaka',
      'Cooperativa Agrovia',
      'Clinica Felina CatCare',
      'Dr. Fernando Salas',
      'Agroservicio Los Alpes'
    ];

    for (const name of atendidosCards) {
      await expect(page.getByRole('heading', { name })).toBeVisible({ timeout: 10000 });
    }
  });

  test('cards tienen badges de tipo', async ({ page }) => {
    const badges = ['Informacion', 'Fabricante', 'Comercial', 'Soporte', 'Otro'];
    for (const badge of badges) {
      await expect(page.getByText(badge).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('cards tienen preview de mensaje y tiempo relativo', async ({ page }) => {
    // Verificar que hay texto de preview
    await expect(page.getByText(/Buenas tardes, me gustaria conocer/).first()).toBeVisible({ timeout: 10000 });

    // Verificar tiempo relativo
    await expect(page.getByText('Hace 2 horas').first()).toBeVisible({ timeout: 10000 });
  });

  test('cards son links navegables', async ({ page }) => {
    const firstCard = page.getByRole('link', { name: /Dr. Roberto Campos/ });
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await expect(firstCard).toHaveAttribute('href', '/admin/mensajes/m1');
  });

  test('toggle Vista Kanban / Vista Tabla existe', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Vista Kanban' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Vista Tabla' })).toBeVisible({ timeout: 10000 });
  });
});
