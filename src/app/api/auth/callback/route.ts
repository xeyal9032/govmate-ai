import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getLocaleFromRequest(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale) return cookieLocale;

  const referer = request.headers.get('referer');
  if (referer) {
    const match = referer.match(/\/(tr|de|en|az|ru|uk|ar)\//);
    if (match) return match[1];
  }

  return 'tr';
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const locale = getLocaleFromRequest(request);
  const next = requestUrl.searchParams.get('next') || `/${locale}/dashboard`;

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : `/${locale}/dashboard`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(new URL(`/${locale}/auth/login?error=auth_callback_failed`, request.url));
    }
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
