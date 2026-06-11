import { test, expect } from '@playwright/test';
import path from 'node:path';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

const MOCK_DOC_ID = '00000000-0000-4000-8000-000000000001';

test.describe('Belge yükleme (mock API)', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.beforeEach(async ({ page }) => {
    await page.route('**/storage/v1/object/documents/**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ Key: 'mock' }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/api/upload/prepare', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          storagePath: 'mock-user/mock-file.txt',
          contentType: 'text/plain',
          targetLanguage: 'tr',
        }),
      });
    });

    await page.route('**/api/upload/complete', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ documentId: MOCK_DOC_ID }),
      });
    });

    await page.route('**/api/ai/analyze-document', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          analysis: {
            summary_simple: 'E2E mock analiz özeti',
            document_type: 'unknown',
          },
        }),
      });
    });

    const ok = await loginAsE2EUser(page, 'tr');
    if (!ok) test.skip();
  });

  test('upload sayfasında mock analiz tamamlanır', async ({ page }) => {
    await page.goto('/tr/dashboard/upload');

    const fixture = path.join(__dirname, 'fixtures', 'jobcenter-brief.txt');
    // Dropzone input (multiple); kamera input ayrı (accept=image/*)
    await page.locator('input[type="file"][multiple]').setInputFiles(fixture);

    await page.getByRole('button', { name: /analiz|analyze/i }).click();

    await expect(page).toHaveURL(
      new RegExp(`/dashboard/documents/${MOCK_DOC_ID}`),
      { timeout: 60_000 }
    );
  });
});
