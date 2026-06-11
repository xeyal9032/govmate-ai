import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('Dashboard sayfaları (oturum gerekli)', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    const ok = await loginAsE2EUser(page, 'tr');
    if (!ok) test.skip();
  });

  test('abonelik sayfası plan kartlarını gösterir', async ({ page }) => {
    await page.goto('/tr/dashboard/billing');
    await expect(page.getByRole('heading', { name: 'Abonelik' })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Ücretsiz').first()).toBeVisible();
    await expect(page.getByText('Pro').first()).toBeVisible();
    await expect(page.getByText('Kullanım').first()).toBeVisible();
  });

  test('son tarihler sayfası yüklenir', async ({ page }) => {
    await page.goto('/tr/dashboard/deadlines');
    await expect(page.getByRole('heading', { name: 'Son Tarihler' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yeni Son Tarih' })).toBeVisible();
  });

  test('ayarlar sayfası profil formunu gösterir', async ({ page }) => {
    await page.goto('/tr/dashboard/settings');
    await expect(page.getByRole('heading', { name: 'Ayarlar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Kaydet' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verilerimi İndir' })).toBeVisible();
  });

  test('mektuplar listesi sayfası yüklenir', async ({ page }) => {
    await page.goto('/tr/dashboard/letters');
    await expect(page.getByRole('heading', { name: 'Mektuplar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yanıt Mektubu Oluştur' })).toBeVisible();
  });

  test('normal kullanıcı admin paneline erişemez', async ({ page }) => {
    await page.goto('/tr/admin');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/admin/);
  });
});

test.describe('Korumalı rotalar (ek)', () => {
  test('ayarlar oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/dashboard/settings');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('abonelik oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/dashboard/billing');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('son tarihler oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/dashboard/deadlines');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
