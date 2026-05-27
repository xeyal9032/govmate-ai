import { test, expect } from '@playwright/test';

test.describe('Korumalı rotalar', () => {
  test('dashboard oturumsuz kullanıcıyı girişe yönlendirir', async ({ page }) => {
    await page.goto('/tr/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('belge yükleme oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/dashboard/upload');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('admin paneli oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/admin');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('mektup oluşturma sayfası oturumsuz erişilemez', async ({ page }) => {
    await page.goto('/tr/dashboard/letters/new');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
