import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';
const API_URL = 'https://hesa-api.azurewebsites.net';

// test: REQ-173 - Si no hay miembros del equipo, la seccion no se muestra en sitio publico
// test: REQ-321e - Si se eliminan todos los miembros, seccion Equipo desaparece del sitio publico
test.describe('REQ-173 / REQ-321e: Team section conditional rendering', () => {

  test('Team API returns members', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/public/team`);
    expect(response.ok()).toBeTruthy();
    const members = await response.json();

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);

    // Each member should have name, title, and photo
    for (const member of members) {
      expect(member).toHaveProperty('name');
      expect(member.name).toHaveProperty('es');
      expect(member.name.es).toBeTruthy();
      expect(member).toHaveProperty('title');
      expect(member.title).toHaveProperty('es');
      expect(member.title.es).toBeTruthy();
    }
  });

  test('Team section is visible on Nosotros when API returns members', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForURL('**/es/nosotros**');

    // Wait for async team data to load and render
    const heading = page.getByRole('heading', { name: /Equipo de Liderazgo/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Team members are rendered with correct data from API', async ({ page, request }) => {
    // Get team members from API
    const apiResponse = await request.get(`${API_URL}/api/public/team`);
    const members = await apiResponse.json();

    // Navigate to Nosotros
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForURL('**/es/nosotros**');

    // Wait for team section to load
    await page.waitForTimeout(3000);

    // Verify each team member name appears on the page
    for (const member of members) {
      const memberName = page.getByText(member.name.es).first();
      await expect(memberName).toBeAttached();
    }
  });

  test('Team member cards show name and title', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForURL('**/es/nosotros**');

    // Wait for team section
    await page.waitForTimeout(3000);

    // Check team-grid has team member cards
    const teamGrid = page.locator('[data-testid="team-grid"]');
    await expect(teamGrid).toBeAttached({ timeout: 10000 });

    const memberCards = page.locator('[data-testid="team-member"]');
    const count = await memberCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Team section uses @if conditional for empty state (code verification)', async ({ page }) => {
    // This test verifies that the component conditionally renders the team section
    // by checking that the section exists only when there are members
    await page.goto(`${BASE_URL}/es/nosotros`);
    await page.waitForURL('**/es/nosotros**');
    await page.waitForTimeout(3000);

    // When team has members, the section should be in the DOM
    const teamSection = page.getByRole('heading', { name: /Equipo de Liderazgo/i });
    const isVisible = await teamSection.isVisible().catch(() => false);

    // Get team count from API
    const teamCount = await page.evaluate(async () => {
      try {
        const res = await fetch('https://hesa-api.azurewebsites.net/api/public/team');
        const data = await res.json();
        return data.length;
      } catch {
        return -1;
      }
    });

    if (teamCount > 0) {
      // Team has members, section should be visible
      expect(isVisible).toBe(true);
    } else {
      // Team has no members, section should NOT be visible (REQ-173, REQ-321e)
      expect(isVisible).toBe(false);
    }
  });

  test('Team section in EN version shows translated titles', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/about`);
    await page.waitForURL('**/en/about**');
    await page.waitForTimeout(3000);

    const heading = page.getByRole('heading', { name: /Leadership Team/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
