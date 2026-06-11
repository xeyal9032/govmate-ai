import { describe, expect, it } from 'vitest';
import { isPlanKey, isUserRoleKey } from '@/lib/utils/plan-keys';
import { resolveActivePlan } from '@/lib/utils/plan-limits';

describe('plan-keys', () => {
  it('plan anahtarlarını doğrular', () => {
    expect(isPlanKey('free')).toBe(true);
    expect(isPlanKey('pro')).toBe(true);
    expect(isPlanKey('enterprise')).toBe(false);
  });

  it('rol anahtarlarını doğrular', () => {
    expect(isUserRoleKey('admin')).toBe(true);
    expect(isUserRoleKey('guest')).toBe(false);
  });
});

describe('resolveActivePlan', () => {
  it('aktif abonelikte planı döner', () => {
    expect(resolveActivePlan({ plan: 'pro', status: 'active' })).toBe('pro');
  });

  it('inaktif abonelikte free döner', () => {
    expect(resolveActivePlan({ plan: 'pro', status: 'canceled' })).toBe('free');
  });

  it('abonelik yoksa free döner', () => {
    expect(resolveActivePlan(null)).toBe('free');
  });
});
