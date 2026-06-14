import { test, expect } from '@playwright/test';

test.describe('Landing sayfası', () => {
  test('varsayılan dilde ana sayfa yüklenir', async ({ page }) => {
    await page.goto('/tr');
    await expect(page).toHaveURL(/\/tr\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('GovMate AI').first()).toBeVisible();
  });

  test('kök URL varsayılan locale\'e yönlendirir', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(tr|de|en)(\/|$)/);
  });

  test('nasıl çalışır bölümü görünür', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.locator('#how-it-works')).toBeVisible();
  });

  test('fiyatlandırma bölümüne kaydırılabilir', async ({ page }) => {
    await page.goto('/tr');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('giriş sayfasına link çalışır', async ({ page }) => {
    await page.goto('/tr');
    const loginLink = page.locator('nav').getByRole('link', { name: /giriş|login|anmelden/i });
    await expect(loginLink).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/auth\/login/),
      loginLink.click(),
    ]);
  });

  test('yeni güven bölümleri görünür', async ({ page }) => {
    await page.goto('/tr');

    await expect(page.locator('#stats')).toBeVisible();
    await expect(page.locator('#video-demo')).toBeVisible();
    await expect(page.locator('#sample-analysis')).toBeVisible();
    await expect(page.locator('#trust-security')).toBeVisible();
    await expect(page.locator('#testimonials')).toBeVisible();
  });

  test('demo slayt gösterisi ve örnek PDF linkleri mevcut', async ({ page }) => {
    await page.goto('/tr');

    await page.locator('#video-demo').scrollIntoViewIfNeeded();
    await expect(page.locator('#video-demo img[src="/marketing/en/upload.png"]')).toBeVisible();

    await page.locator('#sample-analysis').scrollIntoViewIfNeeded();
    await expect(page.locator('a[href="/samples/ornek-analiz-ozeti.pdf"]')).toBeVisible();
    await expect(page.locator('a[href="/samples/ornek-cevap-mektubu.pdf"]')).toBeVisible();
  });
});
