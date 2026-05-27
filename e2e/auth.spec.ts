import { test, expect } from '@playwright/test';

test.describe('Kimlik doğrulama sayfaları', () => {
  test('giriş formu alanları görünür', async ({ page }) => {
    await page.goto('/tr/auth/login');
    await expect(page.getByLabel(/e-posta|email/i)).toBeVisible();
    await expect(page.getByLabel(/şifre|password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /giriş|login|anmelden/i })).toBeVisible();
  });

  test('kayıt sayfasına geçiş', async ({ page }) => {
    await page.goto('/tr/auth/login');
    await page.getByRole('link', { name: /kayıt|register|registrieren/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByLabel(/ad soyad|full name|name/i)).toBeVisible();
  });

  test('şifremi unuttum sayfası', async ({ page }) => {
    await page.goto('/tr/auth/forgot-password');
    await expect(page.getByLabel(/e-posta|email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /gönder|send|senden/i })).toBeVisible();
  });

  test('boş giriş gönderimi sayfada kalır', async ({ page }) => {
    await page.goto('/tr/auth/login');
    await page.getByRole('button', { name: /giriş|login|anmelden/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
