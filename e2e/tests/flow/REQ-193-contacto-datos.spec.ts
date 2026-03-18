import { test, expect } from '@playwright/test';

// test: REQ-193 - Telefono, correo, direccion, horario, redes. NO mapa
test('REQ-193: Contact page shows phone, email, address, hours, social links, and NO map', async ({ page }) => {
  await page.goto('/es/contacto');
  await page.getByText('Contactenos').first().waitFor({ state: 'visible' });

  // Verify phone
  await expect(page.getByText('+506 2260-9020').first()).toBeVisible();

  // Verify email
  await expect(page.getByText('info@hesa.co.cr').first()).toBeVisible();

  // Verify address
  await expect(page.getByText('Calle 2, av 12. Heredia, Costa Rica').first()).toBeVisible();

  // Verify hours
  await expect(page.getByText(/Lunes a Viernes.*8:00.*17:00/).first()).toBeVisible();

  // Verify social links
  await expect(page.getByRole('link', { name: 'Facebook' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Instagram' }).first()).toBeVisible();

  // Verify NO Google Maps iframe
  const iframe = page.locator('iframe[src*="google.com/maps"]');
  await expect(iframe).toHaveCount(0);
});
