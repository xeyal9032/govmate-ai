/** Supabase embed: tek kayıt veya dizi dönebilir; ilk aboneliği seçer. */
export function primarySubscription<T>(
  subscriptions: T | T[] | null | undefined,
): T | null {
  if (!subscriptions) return null;
  return Array.isArray(subscriptions) ? subscriptions[0] ?? null : subscriptions;
}
