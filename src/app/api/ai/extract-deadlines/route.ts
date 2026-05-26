import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractDeadlines } from '@/lib/ai/extract-deadlines';
import { checkRateLimit, AI_RATE_LIMIT } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateCheck = checkRateLimit(`ai:${user.id}`, AI_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { documentText, targetLanguage } = await request.json();
    if (!documentText) {
      return NextResponse.json({ error: 'documentText is required' }, { status: 400 });
    }

    const result = await extractDeadlines(documentText, targetLanguage || 'tr');

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Deadline extraction failed',
    }, { status: 500 });
  }
}
