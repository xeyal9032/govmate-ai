import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLetter } from '@/lib/ai/generate-letter';
import { resolveAnalysisModel } from '@/lib/ai/settings';
import { rateLimitOrNull, AI_RATE_LIMIT } from '@/lib/security/rate-limit-response';
import { checkUsageLimit, incrementUsage, resolveActivePlan } from '@/lib/utils/plan-limits';
import { API_ERROR_CODES } from '@/lib/utils/api-error-codes';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimited = await rateLimitOrNull(`ai:${user.id}`, AI_RATE_LIMIT);
    if (rateLimited) return rateLimited;

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

    const plan = resolveActivePlan(subscription);
    const usageCheck = await checkUsageLimit(
      user.id,
      plan,
      'letter_generation',
      supabase
    );
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Letter generation limit reached',
          errorCode: API_ERROR_CODES.LETTER_LIMIT,
        },
        { status: 403 }
      );
    }

    const analysisModel = await resolveAnalysisModel(supabase);
    const result = await generateLetter(body, analysisModel);

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
