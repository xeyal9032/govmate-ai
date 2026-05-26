import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLetter } from '@/lib/ai/generate-letter';
import { checkRateLimit, AI_RATE_LIMIT } from '@/lib/security/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/plan-limits';

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

    const body = await request.json();
    const { letterType, authorityName, summary, action, userProfile } = body;

    if (!letterType || !authorityName || !summary || !action || !userProfile?.fullName) {
      return NextResponse.json(
        { error: 'letterType, authorityName, summary, action and userProfile.fullName are required' },
        { status: 400 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single();

    const plan = (subscription?.status === 'active' ? subscription?.plan : 'free') || 'free';
    const usageCheck = await checkUsageLimit(user.id, plan as 'free' | 'pro' | 'business', 'letter_generation');
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: 'Letter generation limit reached' }, { status: 403 });
    }

    const result = await generateLetter(body);

    // Save letter
    const { data: letter } = await supabase
      .from('generated_letters')
      .insert({
        user_id: user.id,
        document_id: body.documentId || null,
        letter_type: body.letterType,
        subject: result.subject,
        german_body: result.german_body,
        translated_explanation: result.disclaimer
          ? `${result.explanation_in_user_language}\n\n---\n\n${result.disclaimer}`
          : result.explanation_in_user_language,
        target_language: body.targetLanguage || 'tr',
      })
      .select('id')
      .single();

    await incrementUsage(user.id, 'letter_generation', body.documentId);

    return NextResponse.json({ success: true, letter: result, letterId: letter?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Letter generation failed';
    console.error('Letter generation error:', message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
