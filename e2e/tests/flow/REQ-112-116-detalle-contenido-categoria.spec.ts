import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-112 - Badges/iconos de especie
// test: REQ-113 - Farmacos: formula, registro, indicaciones
// test: REQ-114 - Farmacos: pills de presentaciones
// test: REQ-115 - Alimentos: especie, etapa, ingredientes
// test: REQ-116 - Equipos: especificaciones, usos, garantia
// STATUS: FALLA - No hay productos en la base de datos para verificar contenido especifico por categoria.

async function getFirstProductByCategory(page: any, category: string) {
  const response = await page.request.get(`${API_URL}/api/public/products?category=${category}&limit=1`);
  const data = await response.json();
  if (data.total === 0 || data.data.length === 0) return null;
  return data.data[0];
}

test.describe('REQ-112 a REQ-116: Contenido especifico por categoria', () => {

  test('REQ-112: Producto muestra badges/iconos de especie', async ({ page }) => {
    const product = await getFirstProductByCategory(page, 'farmacos');
    if (!product) {
      test.skip(true, 'No hay productos farmacos en la DB');
      return;
    }

    await page.goto(`${BASE_URL}/es/catalogo/farmacos/${product.slug?.es || product.slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar iconos/badges de especie
    const speciesBadges = page.locator('[data-testid="species-badges"], .species-badge, [class*="species"]');
    await expect(speciesBadges.first()).toBeVisible();
  });

  test('REQ-113: Farmaco muestra formula, registro SENASA, indicaciones', async ({ page }) => {
    const product = await getFirstProductByCategory(page, 'farmacos');
    if (!product) {
      test.skip(true, 'No hay productos farmacos en la DB');
      return;
    }

    await page.goto(`${BASE_URL}/es/catalogo/farmacos/${product.slug?.es || product.slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar campos especificos de farmacos
    // Formula/composicion
    const formula = page.getByText(/formula|composicion|ingrediente activo/i);
    await expect(formula).toBeVisible();

    // Registro SENASA
    const registro = page.getByText(/registro|SENASA/i);
    await expect(registro).toBeVisible();

    // Indicaciones
    const indicaciones = page.getByText(/indicaciones|uso recomendado/i);
    await expect(indicaciones).toBeVisible();
  });

  test('REQ-114: Farmaco muestra presentaciones como pills', async ({ page }) => {
    const product = await getFirstProductByCategory(page, 'farmacos');
    if (!product) {
      test.skip(true, 'No hay productos farmacos en la DB');
      return;
    }

    await page.goto(`${BASE_URL}/es/catalogo/farmacos/${product.slug?.es || product.slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verificar presentaciones como pills/chips
    const presentations = page.locator('[data-testid="presentations"], .presentation-pill, [class*="pill"], [class*="chip"]');
    await expect(presentations.first()).toBeVisible();
  });

  test('REQ-115: Alimento muestra especie, etapa, ingredientes', async ({ page }) => {
    const product = await getFirstProductByCategory(page, 'alimentos');
    if (!product) {
      test.skip(true, 'No hay productos alimentos en la DB');
      return;
    }

    await page.goto(`${BASE_URL}/es/catalogo/alimentos/${product.slug?.es || product.slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Especie
    const species = page.getByText(/especie/i);
    await expect(species).toBeVisible();

    // Etapa de vida
    const lifeStage = page.getByText(/etapa|cachorro|adulto|senior/i);
    await expect(lifeStage).toBeVisible();

    // Ingredientes
    const ingredients = page.getByText(/ingredientes/i);
    await expect(ingredients).toBeVisible();
  });

  test('REQ-116: Equipo muestra especificaciones, usos, garantia', async ({ page }) => {
    const product = await getFirstProductByCategory(page, 'equipos');
    if (!product) {
      test.skip(true, 'No hay productos equipos en la DB');
      return;
    }

    await page.goto(`${BASE_URL}/es/catalogo/equipos/${product.slug?.es || product.slug}`);
    await page.waitForSelector('h1', { timeout: 10000 });

    // Especificaciones
    const specs = page.getByText(/especificaciones|caracteristicas/i);
    await expect(specs).toBeVisible();

    // Usos
    const uses = page.getByText(/usos|aplicaciones/i);
    await expect(uses).toBeVisible();

    // Garantia
    const warranty = page.getByText(/garantia/i);
    await expect(warranty).toBeVisible();
  });
});
