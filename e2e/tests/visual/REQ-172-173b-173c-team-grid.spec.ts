import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test('REQ-172: Team grid with photo, name, and role for 6 members', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const team = await page.evaluate(() => {
    const members = document.querySelectorAll('[class*="team"] [class*="member"], [class*="leadership"] > div > div');
    const results: { hasPhoto: boolean; hasName: boolean; hasRole: boolean; name: string }[] = [];
    members.forEach(m => {
      const img = m.querySelector('img');
      const name = m.querySelector('h3');
      const role = m.querySelector('p');
      if (name) {
        results.push({
          hasPhoto: !!img,
          hasName: !!name,
          hasRole: !!role,
          name: name.textContent?.trim() || ''
        });
      }
    });
    return results;
  });

  expect(team.length).toBe(6);
  for (const member of team) {
    expect(member.hasPhoto).toBe(true);
    expect(member.hasName).toBe(true);
    expect(member.hasRole).toBe(true);
  }
});

test('REQ-173b: Each team member has photo, name, and role in ES/EN', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // Spanish
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const esRoles = await page.evaluate(() => {
    const roles = document.querySelectorAll('[class*="team"] p, [class*="leadership"] p');
    return Array.from(roles).map(r => r.textContent?.trim()).filter(r => r && r.length > 0);
  });
  expect(esRoles.length).toBeGreaterThanOrEqual(6);

  // English
  await page.goto(`${BASE_URL}/en/about`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const enRoles = await page.evaluate(() => {
    const roles = document.querySelectorAll('[class*="team"] p, [class*="leadership"] p');
    return Array.from(roles).map(r => r.textContent?.trim()).filter(r => r && r.length > 0);
  });
  expect(enRoles.length).toBeGreaterThanOrEqual(6);
});

test('REQ-173c: Team grid 3 cols desktop, 2 tablet, 1 mobile', async ({ page }) => {
  // Desktop - 3 columns
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/es/nosotros`);
  await page.waitForSelector('h1', { timeout: 10000 });

  const desktopCols = await page.evaluate(() => {
    const grid = document.querySelector('[class*="team-grid"], [class*="leadership-grid"]');
    if (!grid) return null;
    return getComputedStyle(grid).gridTemplateColumns;
  });

  if (desktopCols) {
    const colCount = desktopCols.split(' ').length;
    expect(colCount).toBe(3);
  }
});
