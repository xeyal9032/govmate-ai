import { test, expect } from '@playwright/test';
import { getE2EAdminCredentials, loginAsE2EAdmin } from './helpers/auth';

test.describe('Admin panel (admin hesabı gerekli)', () => {
  const adminCreds = getE2EAdminCredentials();

  test.skip(
    !adminCreds.configured,
    'E2E_ADMIN_EMAIL ve E2E_ADMIN_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    const ok = await loginAsE2EAdmin(page, 'tr');
    if (!ok) test.skip();
  });

  test('admin genel bakış sayfası yüklenir', async ({ page }) => {
    await page.goto('/tr/admin');
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('kullanıcılar sayfası yüklenir', async ({ page }) => {
    await page.goto('/tr/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);
  });

  test('geri bildirim sayfası yüklenir', async ({ page }) => {
    await page.goto('/tr/admin/feedback');
    await expect(page).toHaveURL(/\/admin\/feedback/);
  });
});
