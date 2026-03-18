import { test, expect } from '@playwright/test';

/**
 * Admin Panel — Categories UI Visual (REQ-268 to REQ-272)
 * STATUS: BLOQUEADO — Requires Azure Entra ID authentication
 * ROUND 2: Auth still not available for automated testing.
 *
 * REQ-268: 3 expandable cards (Farmacos, Alimentos, Equipos) — layout visual
 * REQ-269: Card Farmacos: subsections Familias terapeuticas and Especies destino
 * REQ-270: Card Alimentos: subsections Etapas de vida and Especies destino
 * REQ-271: Card Equipos: subsection Tipos de equipo
 * REQ-272: Tags as chips/pills with "x" to delete and "+" to add — visual styles
 *
 * All criteria require an authenticated admin session.
 */

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('Admin Categories — Auth Gate (REQ-268 to REQ-272)', () => {

  test('REQ-268-272: /admin/categorias redirects to login without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/categorias`, { waitUntil: 'networkidle' });

    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panel de Administracion/i })).toBeVisible({ timeout: 10000 });
  });
});
