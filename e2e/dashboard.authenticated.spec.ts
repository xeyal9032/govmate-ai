import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('Dashboard (oturum gerekli)', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    await loginAsE2EUser(page);
  });

  test('dashboard ana sayfa yüklenir', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('belgeler listesi sayfası', async ({ page }) => {
    await page.goto('/tr/dashboard/documents');
    await expect(page).toHaveURL(/\/documents/);
  });

  test('şablonlar sayfası', async ({ page }) => {
    await page.goto('/tr/dashboard/templates');
    await expect(page).toHaveURL(/\/templates/);
  });
});
