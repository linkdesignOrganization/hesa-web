import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('DC-001 to DC-029: Design Tokens', () => {

  test('DC-001: Brand primary #008DC9 defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim()
    );
    expect(value).toBe('#008DC9');
  });

  test('DC-002: Brand secondary #50B92A defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-secondary').trim()
    );
    expect(value).toBe('#50B92A');
  });

  test('DC-003: Brand dark #005A85 defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--brand-dark').trim()
    );
    expect(value).toBe('#005A85');
  });

  test('DC-004: Neutral colors defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        white: root.getPropertyValue('--neutral-white').trim(),
        n50: root.getPropertyValue('--neutral-50').trim(),
        n100: root.getPropertyValue('--neutral-100').trim(),
        n200: root.getPropertyValue('--neutral-200').trim(),
        n400: root.getPropertyValue('--neutral-400').trim(),
        n900: root.getPropertyValue('--neutral-900').trim(),
      };
    });
    expect(values.white).toBe('#FFFFFF');
    expect(values.n50).toBe('#F5F7FA');
    expect(values.n100).toBe('#F7F8FA');
    expect(values.n200).toBe('#E5E7EB');
    expect(values.n400).toBe('#6B7280');
    expect(values.n900).toBe('#1F2937');
  });

  test('DC-005: Surface colors per category defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        pharma: root.getPropertyValue('--surface-pharma').trim(),
        food: root.getPropertyValue('--surface-food').trim(),
        equipment: root.getPropertyValue('--surface-equipment').trim(),
      };
    });
    expect(values.pharma).toBe('#E8F4FD');
    expect(values.food).toBe('#EDF7E8');
    expect(values.equipment).toBe('#F0F2F5');
  });

  test('DC-006: Semantic colors defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        success: root.getPropertyValue('--semantic-success').trim(),
        danger: root.getPropertyValue('--semantic-danger').trim(),
        warning: root.getPropertyValue('--semantic-warning').trim(),
        info: root.getPropertyValue('--semantic-info').trim(),
        successSoft: root.getPropertyValue('--semantic-success-soft').trim(),
        dangerSoft: root.getPropertyValue('--semantic-danger-soft').trim(),
        warningSoft: root.getPropertyValue('--semantic-warning-soft').trim(),
        infoSoft: root.getPropertyValue('--semantic-info-soft').trim(),
      };
    });
    expect(values.success).toBe('#22C55E');
    expect(values.danger).toBe('#EF4444');
    expect(values.warning).toBe('#F59E0B');
    expect(values.info).toBe('#008DC9');
    expect(values.successSoft).toBe('#DCFCE7');
    expect(values.dangerSoft).toBe('#FEE2E2');
    expect(values.warningSoft).toBe('#FEF3C7');
    expect(values.infoSoft).toBe('#EBF5FF');
  });

  test('DC-007: Semantic text colors defined in :root', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        successText: root.getPropertyValue('--semantic-success-text').trim(),
        dangerText: root.getPropertyValue('--semantic-danger-text').trim(),
        warningText: root.getPropertyValue('--semantic-warning-text').trim(),
        infoText: root.getPropertyValue('--semantic-info-text').trim(),
      };
    });
    expect(values.successText).toBe('#166534');
    expect(values.dangerText).toBe('#991B1B');
    expect(values.warningText).toBe('#92400E');
    expect(values.infoText).toBe('#005A85');
  });

  test('DC-008: Purple color for manufacturer messages defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        purple: root.getPropertyValue('--semantic-purple').trim(),
        purpleSoft: root.getPropertyValue('--semantic-purple-soft').trim(),
        purpleText: root.getPropertyValue('--semantic-purple-text').trim(),
      };
    });
    expect(values.purple).toBe('#7C3AED');
    expect(values.purpleSoft).toBe('#EDE9FE');
    expect(values.purpleText).toBe('#5B21B6');
  });

  test('DC-009: Special colors (WhatsApp, overlay) defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        whatsapp: root.getPropertyValue('--whatsapp').trim(),
        whatsappHover: root.getPropertyValue('--whatsapp-hover').trim(),
        overlay: root.getPropertyValue('--overlay').trim(),
      };
    });
    expect(values.whatsapp).toBe('#25D366');
    expect(values.whatsappHover).toBe('#20BD5A');
    expect(values.overlay).toBe('rgba(0, 0, 0, .5)');
  });

  test('DC-010: Inter font from Google Fonts', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const fontFamily = await page.evaluate(() =>
      getComputedStyle(document.body).fontFamily
    );
    expect(fontFamily).toContain('Inter');
    const hasGoogleFonts = await page.evaluate(() =>
      !!document.querySelector('link[href*="fonts.googleapis.com"]')
    );
    expect(hasGoogleFonts).toBe(true);
  });

  test('DC-011: Fallback font stack defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const fontFamily = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim()
    );
    expect(fontFamily).toContain('Inter');
    expect(fontFamily).toContain('-apple-system');
    expect(fontFamily).toContain('BlinkMacSystemFont');
    expect(fontFamily).toContain('sans-serif');
  });

  test('DC-012: Typographic scale tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        display: root.getPropertyValue('--text-display').trim(),
        h1: root.getPropertyValue('--text-h1').trim(),
        h2: root.getPropertyValue('--text-h2').trim(),
        h3: root.getPropertyValue('--text-h3').trim(),
        body: root.getPropertyValue('--text-body').trim(),
        bodyLg: root.getPropertyValue('--text-body-lg').trim(),
        small: root.getPropertyValue('--text-small').trim(),
        label: root.getPropertyValue('--text-label').trim(),
      };
    });
    expect(values.display).toBe('56px');
    expect(values.h1).toBe('48px');
    expect(values.h2).toBe('42px');
    expect(values.h3).toBe('36px');
    expect(values.body).toBe('16px');
    expect(values.bodyLg).toBe('18px');
    expect(values.small).toBe('14px');
    expect(values.label).toBe('13px');
  });

  test('DC-014: Panel typographic scale tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        title: root.getPropertyValue('--text-panel-title').trim(),
        subtitle: root.getPropertyValue('--text-panel-subtitle').trim(),
        cardName: root.getPropertyValue('--text-panel-card-name').trim(),
        body: root.getPropertyValue('--text-panel-body').trim(),
        tableHeader: root.getPropertyValue('--text-panel-table-header').trim(),
        stat: root.getPropertyValue('--text-panel-stat').trim(),
        badge: root.getPropertyValue('--text-panel-badge').trim(),
      };
    });
    expect(values.title).toBe('24px');
    expect(values.subtitle).toBe('20px');
    expect(values.cardName).toBe('16px');
    expect(values.body).toBe('14px');
    expect(values.tableHeader).toBe('13px');
    expect(values.stat).toBe('32px');
    expect(values.badge).toBe('12px');
  });

  test('DC-015: Tracking tight -0.02em defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--tracking-tight').trim()
    );
    expect(value).toBe('-.02em');
  });

  test('DC-016: Spacing scale base 4px defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        s1: root.getPropertyValue('--space-1').trim(),
        s4: root.getPropertyValue('--space-4').trim(),
        s8: root.getPropertyValue('--space-8').trim(),
        s12: root.getPropertyValue('--space-12').trim(),
        s24: root.getPropertyValue('--space-24').trim(),
      };
    });
    expect(values.s1).toBe('4px');
    expect(values.s4).toBe('16px');
    expect(values.s8).toBe('32px');
    expect(values.s12).toBe('48px');
    expect(values.s24).toBe('96px');
  });

  test('DC-017: Section spacing tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        desktop: root.getPropertyValue('--section-gap-desktop').trim(),
        tablet: root.getPropertyValue('--section-gap-tablet').trim(),
        mobile: root.getPropertyValue('--section-gap-mobile').trim(),
      };
    });
    expect(values.desktop).toBe('96px');
    expect(values.tablet).toBe('80px');
    expect(values.mobile).toBe('64px');
  });

  test('DC-018: Block padding tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        desktop: root.getPropertyValue('--block-padding-desktop').trim(),
        tablet: root.getPropertyValue('--block-padding-tablet').trim(),
        mobile: root.getPropertyValue('--block-padding-mobile').trim(),
      };
    });
    expect(values.desktop).toBe('72px');
    expect(values.tablet).toBe('60px');
    expect(values.mobile).toBe('48px');
  });

  test('DC-019: Container max-width 1280px and padding tokens', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        maxWidth: root.getPropertyValue('--container-max-width').trim(),
        paddingDesktop: root.getPropertyValue('--container-padding-desktop').trim(),
        paddingMobile: root.getPropertyValue('--container-padding-mobile').trim(),
      };
    });
    expect(values.maxWidth).toBe('1280px');
    expect(values.paddingDesktop).toBe('40px');
    expect(values.paddingMobile).toBe('20px');
  });

  test('DC-020: Panel spacing tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        contentDesktop: root.getPropertyValue('--panel-content-padding-desktop').trim(),
        contentMobile: root.getPropertyValue('--panel-content-padding-mobile').trim(),
        cardsGap: root.getPropertyValue('--panel-cards-gap').trim(),
        cardPadding: root.getPropertyValue('--panel-card-padding').trim(),
      };
    });
    expect(values.contentDesktop).toBe('32px');
    expect(values.contentMobile).toBe('16px');
    expect(values.cardsGap).toBe('24px');
    expect(values.cardPadding).toBe('20px');
  });

  test('DC-021: Shadow tokens defined (sm, md, lg)', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        sm: root.getPropertyValue('--shadow-sm').trim(),
        md: root.getPropertyValue('--shadow-md').trim(),
        lg: root.getPropertyValue('--shadow-lg').trim(),
      };
    });
    expect(values.sm).toContain('0 1px 3px');
    expect(values.md).toContain('0 4px 12px');
    expect(values.lg).toContain('0 8px 24px');
  });

  test('DC-022: Border-radius tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        btn: root.getPropertyValue('--radius-btn').trim(),
        input: root.getPropertyValue('--radius-input').trim(),
        cardPublic: root.getPropertyValue('--radius-card-public').trim(),
        cardPanel: root.getPropertyValue('--radius-card-panel').trim(),
        block: root.getPropertyValue('--radius-block').trim(),
        pill: root.getPropertyValue('--radius-pill').trim(),
      };
    });
    expect(values.btn).toBe('8px');
    expect(values.input).toBe('10px');
    expect(values.cardPublic).toBe('12px');
    expect(values.cardPanel).toBe('16px');
    expect(values.block).toBe('24px');
    expect(values.pill).toBe('9999px');
  });

  test('DC-023: Button hover transition token defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--transition-btn').trim()
    );
    expect(value).toContain('background-color');
    expect(value).toContain('.2s');
    expect(value).toContain('ease-out');
  });

  test('DC-024: Card hover transition token defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--transition-card').trim()
    );
    expect(value).toContain('box-shadow');
    expect(value).toContain('transform');
    expect(value).toContain('.3s');
  });

  test('DC-025: Scroll fade-in transition token defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--transition-fade-in').trim()
    );
    expect(value).toContain('opacity');
    expect(value).toContain('transform');
    expect(value).toContain('.5s');
  });

  test('DC-027: Z-index scale tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        dropdown: root.getPropertyValue('--z-dropdown').trim(),
        sticky: root.getPropertyValue('--z-sticky').trim(),
        sidebar: root.getPropertyValue('--z-sidebar').trim(),
        overlay: root.getPropertyValue('--z-overlay').trim(),
        modal: root.getPropertyValue('--z-modal').trim(),
        toast: root.getPropertyValue('--z-toast').trim(),
        whatsapp: root.getPropertyValue('--z-whatsapp').trim(),
      };
    });
    expect(values.dropdown).toBe('100');
    expect(values.sticky).toBe('200');
    expect(values.sidebar).toBe('300');
    expect(values.overlay).toBe('400');
    expect(values.modal).toBe('500');
    expect(values.toast).toBe('600');
    expect(values.whatsapp).toBe('700');
  });

  test('DC-028: Icon size tokens defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        btn: root.getPropertyValue('--icon-btn').trim(),
        sidebar: root.getPropertyValue('--icon-sidebar').trim(),
        card: root.getPropertyValue('--icon-card').trim(),
      };
    });
    expect(values.btn).toBe('16px');
    expect(values.sidebar).toBe('20px');
    expect(values.card).toBe('24px');
  });

  test('DC-029: Icon circle size token defined', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--icon-circle-size').trim()
    );
    expect(value).toBe('48px');
  });

  test('DC-149: Smooth scroll behavior enabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/es`);
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(value).toBe('smooth');
  });
});
