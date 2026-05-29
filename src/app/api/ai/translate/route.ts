import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { translateText } from '@/lib/ai/translate';
import { rateLimitOrNull, AI_RATE_LIMIT } from '@/lib/security/rate-limit-response';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimited = await rateLimitOrNull(`ai:${user.id}`, AI_RATE_LIMIT);
    if (rateLimited) return rateLimited;

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single();

    const plan = (subscription?.status === 'active' ? subscription?.plan : 'free') || 'free';

    const { data: limits } = await supabase
      .from('plan_limits')
      .select('translation_enabled')
      .eq('plan', plan)
      .single();

    if (!limits?.translation_enabled) {
      return NextResponse.json(
        { error: 'Translation feature is not available on your current plan. Please upgrade to Pro or Business.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { text, sourceLanguage, targetLanguage, mode } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'text, sourceLanguage and targetLanguage are required' },
        { status: 400 }
      );
    }

    const validModes = ['simple', 'formal', 'a2_level'];
    if (mode && !validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Valid values: ${validModes.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await translateText(body);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Translation failed',
    }, { status: 500 });
  }
}
