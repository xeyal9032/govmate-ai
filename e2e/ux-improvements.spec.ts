import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('UX iyileştirmeleri — API', () => {
  test('letter PDF yetkisiz 401 döner', async ({ request }) => {
    const res = await request.post('/api/pdf/letter', {
      data: { subject: 'Test', germanBody: 'Inhalt' },
    });
    expect(res.status()).toBe(401);
  });

  test('upload prepare 403 document limit errorCode döner', async ({ request }) => {
    const res = await request.post('/api/upload/prepare', {
      data: {
        fileName: 'test.pdf',
        fileSize: 1024,
        fileType: 'application/pdf',
        targetLanguage: 'tr',
      },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe('UX iyileştirmeleri — UI (oturum gerekli)', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    const ok = await loginAsE2EUser(page, 'tr');
    if (!ok) test.skip();
  });

  test('dashboard kullanım banner gösterir', async ({ page }) => {
    await page.goto('/tr/dashboard');
    await expect(
      page.getByText(/aylık kullanım|plan limitine|belgeler:/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('upload sayfasında kota banner ve MB bilgisi', async ({ page }) => {
    await page.goto('/tr/dashboard/upload');
    await expect(page.getByRole('heading', { name: 'Belge Yükle' })).toBeVisible();
    await expect(
      page.getByText(/belgeler:|maks\.|maximum|dosya boyutu/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('yeni mektup sayfasında mektup kotası banner', async ({ page }) => {
    await page.goto('/tr/dashboard/letters/new');
    await expect(
      page.getByText(/mektuplar:|letters:/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('ayarlar genişletilmiş bölümler görünür', async ({ page }) => {
    await page.goto('/tr/dashboard/settings');
    await expect(page.getByLabel('Adres')).toBeVisible();
    await expect(page.getByText('Bildirimler', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Şifre Değiştir' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Tüm Belgeleri Sil' })
    ).toBeVisible();
  });

  test('giriş sayfasında Google butonu yok', async ({ page }) => {
    await page.goto('/tr/auth/login');
    await expect(page.getByRole('button', { name: /google/i })).toHaveCount(0);
  });

  test('son tarihler silme butonu ve yeni deadline formu', async ({ page }) => {
    await page.goto('/tr/dashboard/deadlines');
    await page.getByRole('button', { name: 'Yeni Son Tarih' }).click();
    await expect(page.getByText('Hatırlatma')).toBeVisible();
  });
});
