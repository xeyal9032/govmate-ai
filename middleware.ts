import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { isSupportAllowedAdminPath, toAdminPath } from '@/lib/admin/access';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
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

  const { data: { user } } = await supabase.auth.getUser();
  const adminPath = toAdminPath(request.nextUrl.pathname, routing.locales);

  if (user && adminPath && !isSupportAllowedAdminPath(adminPath)) {
    const { data: profile } = await supabase
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
