import { test, expect } from '@playwright/test';

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const hasOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  expect(hasOverflow, 'Yatay taşma olmamalı').toBe(false);
}

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

  test('landing mobilde yatay taşma yok', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await assertNoHorizontalOverflow(page);
  });

  test('landing mobilde fiyatlandırma bölümü görünür', async ({ page }) => {
    await page.goto('/tr');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  test('ürün turu bölümü mobilde görünür', async ({ page }) => {
    await page.goto('/tr');
    await page.locator('#video-demo').scrollIntoViewIfNeeded();
    await expect(page.locator('#video-demo')).toBeInViewport();
    await expect(page.locator('#video-demo img').first()).toBeVisible();
    await assertNoHorizontalOverflow(page);
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
    await expect(page.getByRole('button', { name: /tema|theme|design|тему|мظهر/i })).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test('auth kayıt formu mobilde kaydırılabilir', async ({ page }) => {
    await page.goto('/tr/auth/register');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /kayıt|register|registrieren/i })).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
