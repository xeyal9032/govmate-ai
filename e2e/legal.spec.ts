import { test, expect } from '@playwright/test';

test.describe('Yasal sayfalar', () => {
  for (const path of ['privacy', 'terms', 'disclaimer'] as const) {
    test(`${path} sayfası yüklenir`, async ({ page }) => {
      await page.goto(`/tr/legal/${path}`);
      await expect(page).toHaveURL(new RegExp(`/legal/${path}`));
      await expect(page.locator('main, article, h1').first()).toBeVisible();
    });
  }
});
