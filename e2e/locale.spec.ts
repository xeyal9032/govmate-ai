import { test, expect } from '@playwright/test';

const locales = ['tr', 'de', 'en'] as const;

test.describe('Çoklu dil', () => {
  for (const code of locales) {
    test(`${code} locale ana sayfa`, async ({ page }) => {
      await page.goto(`/${code}`);
      await expect(page).toHaveURL(new RegExp(`/${code}`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const body = await page.locator('body').innerText();
      expect(body.length).toBeGreaterThan(100);
    });
  }

  test('almanca giriş sayfası', async ({ page }) => {
    await page.goto('/de/auth/login');
    await expect(page.locator('#email')).toBeVisible();
  });
});
