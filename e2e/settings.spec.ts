import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('PDF API uç noktaları', () => {
  test('template PDF yetkisiz 401 döner', async ({ request }) => {
    const res = await request.post('/api/pdf/template', {
      data: { title: 'Test', content: 'Inhalt' },
    });
    expect(res.status()).toBe(401);
  });

  test('hesap silme yetkisiz 401 döner', async ({ request }) => {
    const res = await request.post('/api/account/delete');
    expect(res.status()).toBe(401);
  });
});

test.describe('Ayarlar export UX', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/pdf/export', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error:
            'PDF export is not available on your current plan. Please upgrade to Pro or Business.',
        }),
      });
    });

    const ok = await loginAsE2EUser(page, 'tr');
    if (!ok) test.skip();
  });

  test('403 yanıtında upgrade mesajı toast olarak gösterilir', async ({ page }) => {
    await page.goto('/tr/dashboard/settings');

    const exportButton = page.getByRole('button', { name: 'Verilerimi İndir' });
    await exportButton.click();

    await expect(
      page.getByText(/upgrade|pro|business|plan/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
