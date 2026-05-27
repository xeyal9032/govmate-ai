/** Destek rolünün erişebildiği admin yolları (locale öneki hariç) */
export const SUPPORT_ADMIN_PATHS = [
  '/admin',
  '/admin/users',
  '/admin/feedback',
] as const;

const ADMIN_ONLY_SEGMENTS = [
  'templates',
  'categories',
  'ai-settings',
  'logs',
  'site-content',
  'subscriptions',
  'plan-limits',
  'announcements',
] as const;

/** /tr/admin/users/xxx gibi yolu locale'siz admin yoluna çevirir */
export function toAdminPath(pathname: string, locales: readonly string[]): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const [maybeLocale, section, ...rest] = segments;
  if (!locales.includes(maybeLocale) || section !== 'admin') return null;
  const tail = rest.length ? `/${rest.join('/')}` : '';
  return `/admin${tail}`;
}

export function isSupportAllowedAdminPath(adminPath: string): boolean {
  if (SUPPORT_ADMIN_PATHS.includes(adminPath as (typeof SUPPORT_ADMIN_PATHS)[number])) {
    return true;
  }
  if (adminPath.startsWith('/admin/users/') && adminPath.split('/').length === 4) {
    return true;
  }
  return false;
}

export function isAdminOnlyAdminPath(adminPath: string): boolean {
  const parts = adminPath.split('/').filter(Boolean);
  if (parts[0] !== 'admin' || parts.length < 2) return false;
  return ADMIN_ONLY_SEGMENTS.includes(parts[1] as (typeof ADMIN_ONLY_SEGMENTS)[number]);
}
