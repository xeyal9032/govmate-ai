import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { isSupportAllowedAdminPath, toAdminPath } from '@/lib/admin/access';
import { isMaintenanceModeEnabled } from '@/lib/maintenance';

const intlMiddleware = createMiddleware(routing);

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
    return segments.slice(1).join('/');
  }
  return segments.join('/');
}

function isMaintenanceExemptPath(pathWithoutLocale: string): boolean {
  if (pathWithoutLocale === 'maintenance') return true;
  if (pathWithoutLocale.startsWith('auth/')) return true;
  if (pathWithoutLocale.startsWith('admin')) return true;
  if (pathWithoutLocale.startsWith('legal/')) return true;
  return false;
}

export default async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Yanıt oluşturulduktan sonra cookie güncellenir
        },
      },
    }
  );

  const pathWithoutLocale = getPathWithoutLocale(request.nextUrl.pathname);
  const maintenanceOn = await isMaintenanceModeEnabled(supabase);

  if (maintenanceOn && !isMaintenanceExemptPath(pathWithoutLocale)) {
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      isAdmin = profile?.role === 'admin';
    }

    if (!isAdmin) {
      const locale =
        routing.locales.find((l) => request.nextUrl.pathname.startsWith(`/${l}/`)) ||
        routing.defaultLocale;
      if (pathWithoutLocale !== 'maintenance') {
        return NextResponse.redirect(new URL(`/${locale}/maintenance`, request.url));
      }
    }
  }

  const response = intlMiddleware(request);

  const supabaseWithCookies = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabaseWithCookies.auth.getUser();
  const adminPath = toAdminPath(request.nextUrl.pathname, routing.locales);

  if (user && adminPath && !isSupportAllowedAdminPath(adminPath)) {
    const { data: profile } = await supabaseWithCookies
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'support') {
      const locale = request.nextUrl.pathname.split('/').filter(Boolean)[0] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
