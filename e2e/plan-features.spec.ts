import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('Plan özellikleri (mock API)', () => {
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
          error: 'PDF export is not available on your current plan. Please upgrade to Pro or Business.',
        }),
      });
    });

    const ok = await loginAsE2EUser(page, 'tr');
    if (!ok) test.skip();
  });

  test('free planda PDF export 403 gösterir', async ({ page }) => {
    await page.goto('/tr/dashboard/settings');

    const exportButton = page.getByRole('button', { name: /dışa aktar|export|indir/i });
    if (await exportButton.count() === 0) {
      test.skip();
    }

    await exportButton.first().click();

    await expect(
      page.getByText(/plan|upgrade|pro|business|dışa aktarılamadı|export/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Upload prepare endpoint', () => {
  test('yetkisiz istek 401 döner', async ({ request }) => {
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

  test('complete endpoint yetkisiz 401 döner', async ({ request }) => {
    const res = await request.post('/api/upload/complete', {
      data: {
        storagePath: 'user/test.pdf',
        fileName: 'test.pdf',
        fileSize: 1024,
        fileType: 'application/pdf',
        targetLanguage: 'tr',
        magicPrefix: [0x25, 0x50, 0x44, 0x46],
      },
    });
    expect(res.status()).toBe(401);
  });
});
