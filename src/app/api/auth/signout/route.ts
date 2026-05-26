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

async function handleSignOut(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }

  const locale = getLocaleFromRequest(request);
  return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
}

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}
