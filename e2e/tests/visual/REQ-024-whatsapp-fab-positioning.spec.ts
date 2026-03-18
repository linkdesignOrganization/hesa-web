import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('REQ-024: WhatsApp FAB does not obstruct content', () => {
  test('FAB has position fixed with adequate separation from edges', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const fab = page.locator('.whatsapp-fab');
    await expect(fab).toBeVisible();

    const fabStyles = await fab.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
        zIndex: styles.zIndex,
      };
    });

    expect(fabStyles.position).toBe('fixed');
    expect(parseInt(fabStyles.bottom)).toBeGreaterThanOrEqual(16);
    expect(parseInt(fabStyles.right)).toBeGreaterThanOrEqual(16);
    expect(parseInt(fabStyles.zIndex)).toBe(700);
  });

  test('FAB does not overlap with contact form submit button', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`);
    await page.waitForTimeout(3000);

    const fab = page.locator('.whatsapp-fab');
    const submitBtn = page.locator('button[type="submit"], .contact-form__submit button');

    await expect(fab).toBeVisible();
    await expect(submitBtn).toBeVisible();

    const fabBox = await fab.boundingBox();
    const submitBox = await submitBtn.boundingBox();

    expect(fabBox).not.toBeNull();
    expect(submitBox).not.toBeNull();

    if (fabBox && submitBox) {
      const overlap = !(
        fabBox.x + fabBox.width < submitBox.x ||
        fabBox.x > submitBox.x + submitBox.width ||
        fabBox.y + fabBox.height < submitBox.y ||
        fabBox.y > submitBox.y + submitBox.height
      );
      expect(overlap).toBe(false);
    }
  });

  test('FAB does not overlap with any interactive element on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    await page.waitForTimeout(3000);

    const overlaps = await page.evaluate(() => {
      const fab = document.querySelector('.whatsapp-fab');
      if (!fab) return { error: 'No FAB found' };
      const fabRect = fab.getBoundingClientRect();
      const clickables = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      const overlapping: string[] = [];

      for (const el of clickables) {
        if (el === fab || fab.contains(el)) continue;
        const elRect = el.getBoundingClientRect();
        if (elRect.width === 0 || elRect.height === 0) continue;
        if (
          !(
            elRect.right < fabRect.left ||
            elRect.left > fabRect.right ||
            elRect.bottom < fabRect.top ||
            elRect.top > fabRect.bottom
          )
        ) {
          overlapping.push(el.tagName + '.' + el.className);
        }
      }
      return { overlapping };
    });

    expect((overlaps as { overlapping: string[] }).overlapping).toHaveLength(0);
  });
});
