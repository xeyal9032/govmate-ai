import { test, expect } from '@playwright/test';
import { getE2ECredentials, loginAsE2EUser } from './helpers/auth';

test.describe('Giriş (oturum)', () => {
  test.skip(
    !getE2ECredentials().configured,
    'E2E_USER_EMAIL ve E2E_USER_PASSWORD .env.local içinde tanımlı olmalı'
  );

  test('geçerli bilgilerle dashboard açılır', async ({ page }) => {
    const ok = await loginAsE2EUser(page, 'tr');
    expect(ok).toBe(true);
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
