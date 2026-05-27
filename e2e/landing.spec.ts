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
    const loginLink = page.getByRole('link', { name: /giriş|login|anmelden/i }).first();
    await loginLink.scrollIntoViewIfNeeded();
    await loginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
