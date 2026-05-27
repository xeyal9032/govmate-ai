import { describe, expect, it } from 'vitest';
import {
  isSupportAllowedAdminPath,
  toAdminPath,
} from './access';

const LOCALES = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'] as const;

describe('toAdminPath', () => {
  it('locale önekli admin yolunu çevirir', () => {
    expect(toAdminPath('/tr/admin/users', LOCALES)).toBe('/admin/users');
    expect(toAdminPath('/de/admin/templates', LOCALES)).toBe('/admin/templates');
  });

  it('kullanıcı detay yolunu çevirir', () => {
    expect(toAdminPath('/tr/admin/users/abc-123', LOCALES)).toBe(
      '/admin/users/abc-123'
    );
  });

  it('admin olmayan yollar için null döner', () => {
    expect(toAdminPath('/tr/dashboard', LOCALES)).toBeNull();
    expect(toAdminPath('/api/upload', LOCALES)).toBeNull();
  });
});

describe('isSupportAllowedAdminPath', () => {
  it('destek için izinli yollar', () => {
    expect(isSupportAllowedAdminPath('/admin')).toBe(true);
    expect(isSupportAllowedAdminPath('/admin/users')).toBe(true);
    expect(isSupportAllowedAdminPath('/admin/feedback')).toBe(true);
    expect(isSupportAllowedAdminPath('/admin/users/uuid-here')).toBe(true);
  });

  it('destek için yasaklı yollar', () => {
    expect(isSupportAllowedAdminPath('/admin/templates')).toBe(false);
    expect(isSupportAllowedAdminPath('/admin/subscriptions')).toBe(false);
    expect(isSupportAllowedAdminPath('/admin/ai-settings')).toBe(false);
  });
});
