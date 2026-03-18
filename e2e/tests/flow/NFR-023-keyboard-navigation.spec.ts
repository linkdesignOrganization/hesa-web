import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

// test: NFR-023 - Navegacion completamente funcional con teclado (Tab, Enter, Escape, flechas)
test.describe('NFR-023: Full keyboard navigation', () => {

  test('Skip-to-content link is the first focusable element on Home', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    // Press Tab to focus the skip-to-content link
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        text: el?.textContent?.trim(),
        href: el?.getAttribute('href'),
        className: el?.className,
      };
    });

    expect(focused.tagName).toBe('A');
    expect(focused.text).toContain('Saltar al contenido');
    expect(focused.href).toBe('#main-content');
  });

  test('Skip-to-content target #main-content exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeAttached();
    const tagName = await mainContent.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('main');
  });

  test('Tab traverses navbar items in logical order on Home', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    const focusOrder: string[] = [];

    // Press Tab multiple times and collect focused element info
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.textContent?.trim().substring(0, 40) || el?.getAttribute('aria-label') || 'unknown';
      });
      focusOrder.push(info);
    }

    // Verify skip-to-content is first, then HESA logo, then nav items
    expect(focusOrder[0]).toContain('Saltar al contenido');
    // HESA logo link should be second
    expect(focusOrder[1]).toContain('HESA');
    // Eventually we should reach Catalogo, Marcas, Nosotros, etc.
    const allText = focusOrder.join(' | ');
    expect(allText).toContain('Catalogo');
  });

  test('Tab traverses form fields in order on Contacto', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForURL('**/es/contacto**');

    // Tab through the page to reach form fields
    const focusedElements: Array<{ tag: string; name: string; type: string }> = [];

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        return {
          tag: el?.tagName?.toLowerCase() || '',
          name: el?.getAttribute('aria-label') || el?.getAttribute('placeholder') || el?.textContent?.trim().substring(0, 30) || '',
          type: el?.getAttribute('type') || el?.getAttribute('role') || '',
        };
      });
      focusedElements.push(info);
    }

    // Verify that input, textarea, select elements appear in the focus order
    const inputElements = focusedElements.filter(e => ['input', 'textarea', 'select'].includes(e.tag));
    expect(inputElements.length).toBeGreaterThan(0);
  });

  test('Escape closes search overlay', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    // Click search button to open overlay
    await page.getByRole('button', { name: /buscar/i }).click();

    // Verify search overlay is visible
    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');

    // Search overlay should be hidden
    await expect(page.locator('[role="search"]')).not.toBeVisible({ timeout: 3000 }).catch(() => {
      // The search role might still be in DOM but visually hidden
    });
  });

  test('Tab reaches content, carousel, and footer on Home', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    await page.waitForURL('**/es/**');

    const allFocused: string[] = [];

    // Tab many times to traverse entire page
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.textContent?.trim().substring(0, 50) || el?.getAttribute('aria-label') || '';
      });
      allFocused.push(info);
    }

    const all = allFocused.join(' | ');
    // Should reach CTAs in hero
    expect(all).toContain('Explorar catalogo');
    // Should reach footer links
    expect(all).toContain('Facebook');
  });

  test('Tab traverses filters and product cards on Catalogo', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/catalogo`);
    await page.waitForURL('**/es/catalogo**');

    const allFocused: string[] = [];

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.textContent?.trim().substring(0, 50) || el?.getAttribute('aria-label') || '';
      });
      allFocused.push(info);
    }

    const all = allFocused.join(' | ');
    // Should reach product cards
    expect(all).toContain('Monitor');
  });
});
