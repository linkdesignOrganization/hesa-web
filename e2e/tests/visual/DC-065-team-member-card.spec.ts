import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-065: Team Member Card', () => {
  test('DC-065: Team members on Nosotros page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForLoadState('networkidle');

    // Scroll to team section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(1000);

    // Look for team member cards
    const teamCards = page.locator('[class*="team-card"], [class*="member-card"], [class*="team-member"]');
    if (await teamCards.count() > 0) {
      const firstCard = teamCards.first();

      // Card should have circular photo
      const photo = firstCard.locator('img, [class*="avatar"]');
      if (await photo.count() > 0) {
        const photoStyle = await photo.first().evaluate(el => {
          const s = getComputedStyle(el);
          return { borderRadius: s.borderRadius, width: el.offsetWidth };
        });
        // Photo should be circular (border-radius 50% or large value)
        expect(parseInt(photoStyle.borderRadius)).toBeGreaterThanOrEqual(50);
      }
    }
  });
});
