import { test, expect } from '@playwright/test';
import path from 'node:path';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

const fixturePath = path.join(__dirname, 'fixtures', 'jobcenter-brief.txt');

test.describe.configure({ mode: 'serial' });

test.describe('Belge → analiz → mektup akışı', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test.setTimeout(240_000);

  test('yükler, analiz eder ve kuruma mektup oluşturur', async ({ page }) => {
    const loggedIn = await loginAsE2EUser(page);
    expect(loggedIn).toBe(true);

    await page.goto('/tr/dashboard/upload');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(fixturePath);

    await expect(page.getByText('jobcenter-brief.txt')).toBeVisible();

    await page.getByRole('button', { name: /analiz|analyze/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/documents\/[0-9a-f-]+/, {
      timeout: 120_000,
    });

    await expect(page.getByText(/kuruma yanıt mektubu|reply to the authority/i)).toBeVisible({
      timeout: 30_000,
    });

    await expect(page.getByRole('tab', { name: /basit açıklama|simple explanation/i })).toBeVisible({
      timeout: 15_000,
    });

    const createLetterLink = page
      .getByRole('link', {
        name: /mektubu hemen oluştur|create letter now|brief jetzt erstellen/i,
      })
      .first();
    await expect(createLetterLink).toBeVisible();
    await createLetterLink.click();

    await expect(page).toHaveURL(/\/dashboard\/letters\/[0-9a-f-]+/, {
      timeout: 120_000,
    });

    await expect(page.locator('body')).toContainText(/sehr geehrte|betreff|ihr/i, {
      timeout: 15_000,
    });
  });
});
