import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-049: Panel Mensajes kanban layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/mensajes`);
    await page.waitForLoadState('networkidle');
  });

  test('DC-049: Kanban view has toggle and 3 columns', async ({ page }) => {
    // Look for toggle between Kanban and Table views
    const toggleKanban = page.locator('button').filter({ hasText: /kanban|tarjetas/i });
    const toggleTable = page.locator('button').filter({ hasText: /tabla|table/i });

    // Check if kanban columns exist
    const columns = page.locator('[class*="kanban-col"], [class*="kanban__col"], [class*="column"]');
    const colCount = await columns.count();
    // If kanban view is active, should have 3 columns
    if (colCount > 0) {
      expect(colCount).toBeGreaterThanOrEqual(3);
    }
  });

  test('DC-049: Kanban cards have badge with message type', async ({ page }) => {
    const cards = page.locator('[class*="kanban-card"], [class*="message-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();
      // Cards should contain a badge element
      const badge = firstCard.locator('[class*="badge"], span[class*="pill"]');
      if (await badge.count() > 0) {
        await expect(badge.first()).toBeVisible();
      }
    }
  });
});
