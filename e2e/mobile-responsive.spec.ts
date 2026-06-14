import { test, expect } from '@playwright/test';

test.describe('Mobil görünüm', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('landing mobilde yüklenir ve hamburger menü çalışır', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const menuButton = page.getByRole('button', { name: /menüyü aç|open menu|menü öffnen/i });
    await menuButton.click();

    const loginLink = page.getByRole('link', { name: /giriş|login|anmelden/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test('landing mobilde fiyatlandırma bölümü görünür', async ({ page }) => {
    await page.goto('/tr');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('yukarı çık butonu scroll sonrası görünür', async ({ page }) => {
    await page.goto('/tr');
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    const scrollTop = page.getByRole('button', { name: /yukarı|scroll to top|nach oben/i });
    await expect(scrollTop).toBeVisible();
    await scrollTop.click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
  });

  test('auth sayfası mobilde form görünür', async ({ page }) => {
    await page.goto('/tr/auth/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});
