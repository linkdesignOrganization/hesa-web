import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gray-field-02ba8410f.2.azurestaticapps.net';

test.describe('NFR-025: Form Labels and ARIA Error Announcements', () => {

  test('NFR-025: Contact form fields have associated <label for> elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/contacto**');

    const formFields = await page.evaluate(() => {
      const fields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
      return Array.from(fields)
        .filter(f => {
          // Skip honeypot fields
          const style = getComputedStyle(f);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        })
        .map(f => {
          const id = f.id;
          const labelFor = id ? document.querySelector(`label[for="${id}"]`) : null;
          const parentLabel = f.closest('label');
          const ariaLabel = f.getAttribute('aria-label');
          const ariaLabelledBy = f.getAttribute('aria-labelledby');
          return {
            type: (f as HTMLInputElement).type || f.tagName.toLowerCase(),
            placeholder: (f as HTMLInputElement).placeholder || '',
            hasLabelFor: !!labelFor,
            hasParentLabel: !!parentLabel,
            hasAriaLabel: !!ariaLabel,
            hasAriaLabelledBy: !!ariaLabelledBy,
            hasAnyLabel: !!labelFor || !!parentLabel || !!ariaLabel || !!ariaLabelledBy
          };
        });
    });

    // All visible form fields should have associated labels via <label for>
    for (const field of formFields) {
      expect(field.hasLabelFor, `Field ${field.type} (${field.placeholder}) missing <label for>`).toBe(true);
    }
  });

  test('NFR-025: Manufacturer form fields have associated <label for> elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/distribuidores`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/distribuidores**');

    const formFields = await page.evaluate(() => {
      const fields = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
      return Array.from(fields)
        .filter(f => {
          const style = getComputedStyle(f);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        })
        .map(f => {
          const id = f.id;
          const labelFor = id ? document.querySelector(`label[for="${id}"]`) : null;
          const parentLabel = f.closest('label');
          const ariaLabel = f.getAttribute('aria-label');
          return {
            type: (f as HTMLInputElement).type || f.tagName.toLowerCase(),
            placeholder: (f as HTMLInputElement).placeholder || '',
            hasLabelFor: !!labelFor,
            hasParentLabel: !!parentLabel,
            hasAriaLabel: !!ariaLabel,
            hasAnyLabel: !!labelFor || !!parentLabel || !!ariaLabel
          };
        });
    });

    for (const field of formFields) {
      expect(field.hasLabelFor, `Field ${field.type} (${field.placeholder}) missing <label for>`).toBe(true);
    }
  });

  test('NFR-025: Contact form shows validation errors with role="alert"', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/contacto**');

    // Submit the form without filling required fields to trigger validation
    const submitButton = page.locator('button:has-text("Enviar mensaje")');
    await submitButton.click();

    // Wait for validation errors to appear
    await page.waitForTimeout(500);

    const alerts = await page.evaluate(() => {
      const alertElements = document.querySelectorAll('[role="alert"]');
      return {
        count: alertElements.length,
        texts: Array.from(alertElements).map(el => el.textContent?.trim().substring(0, 80) || '')
      };
    });

    // Validation errors should be announced with role="alert"
    expect(alerts.count).toBeGreaterThan(0);
  });

  test('NFR-025: Contact form fields have accessible names', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/contacto`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/contacto**');

    // Check that all form fields have an accessible name
    const nameField = page.getByLabel('Nombre', { exact: false });
    await expect(nameField).toBeVisible();

    const emailField = page.getByLabel('Correo', { exact: false });
    await expect(emailField).toBeVisible();

    const messageField = page.getByLabel('Mensaje', { exact: false });
    await expect(messageField).toBeVisible();

    const typeField = page.getByLabel('Tipo de consulta', { exact: false });
    await expect(typeField).toBeVisible();
  });
});
