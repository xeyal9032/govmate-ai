export type PlanKey = 'free' | 'pro' | 'business';
export type UserRoleKey = 'user' | 'admin' | 'support';

export function isPlanKey(value: string): value is PlanKey {
  return value === 'free' || value === 'pro' || value === 'business';
}

export function isUserRoleKey(value: string): value is UserRoleKey {
  return value === 'user' || value === 'admin' || value === 'support';
}
