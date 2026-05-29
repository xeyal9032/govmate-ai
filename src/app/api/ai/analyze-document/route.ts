import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/ai/analyze-document';
import { rateLimitOrNull, AI_RATE_LIMIT } from '@/lib/security/rate-limit-response';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/plan-limits';
import { writeAuditLog } from '@/lib/security/audit-log';

export async function POST(request: NextRequest) {
  let documentId: string | undefined;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimited = await rateLimitOrNull(`ai:${user.id}`, AI_RATE_LIMIT);
    if (rateLimited) return rateLimited;

    const body = await request.json();
    documentId = body.documentId;
    const targetLanguage = body.targetLanguage;
    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // Check plan limit
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single();

    const plan = (subscription?.status === 'active' ? subscription?.plan : 'free') || 'free';
    const usageCheck = await checkUsageLimit(user.id, plan as 'free' | 'pro' | 'business', 'document_analysis');
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: 'Monthly analysis limit reached',
        used: usageCheck.used,
        limit: usageCheck.limit,
      }, { status: 403 });
    }

    // Get document
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Update status
    await supabase.from('documents').update({ status: 'analyzing' }).eq('id', documentId);

    let extractedText = document.extracted_text || '';
    let fileUrl: string | undefined;

    if (!extractedText) {
      if (document.file_type === 'application/pdf') {
        const { data: fileData } = await supabase.storage
          .from('documents')
          .download(document.file_path);
        if (fileData) {
          const { extractText } = await import('unpdf');
          const uint8 = new Uint8Array(await fileData.arrayBuffer());
          const { text } = await extractText(uint8, { mergePages: true });
          extractedText = text || '';
        }
        if (!extractedText) {
          extractedText = 'PDF document uploaded but text could not be extracted. Please analyze based on available context.';
        }
      } else if (document.file_type.startsWith('image/')) {
        const { data: signedUrl } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600);
        fileUrl = signedUrl?.signedUrl;
      } else if (document.file_type === 'text/plain') {
        const { data: fileData } = await supabase.storage
          .from('documents')
          .download(document.file_path);
        if (fileData) {
          extractedText = await fileData.text();
        }
      }
    }

    // Run AI analysis
    const lang = targetLanguage || document.target_language || 'tr';
    const analysis = await analyzeDocument(extractedText, lang, fileUrl, document.file_type);

    // Save results
    await supabase.from('document_analyses').insert({
      document_id: documentId,
      user_id: user.id,
      analysis_json: analysis as unknown as Record<string, unknown>,
      summary_simple: analysis.summary_simple,
      summary_detailed: analysis.summary_detailed,
      required_actions: analysis.required_actions as unknown as Record<string, unknown>[],
      required_documents: analysis.required_documents as unknown as Record<string, unknown>[],
      risks_if_ignored: analysis.risks_if_ignored,
      confidence_score: analysis.confidence_score,
      ai_model: 'gpt-4o',
    });

    // Save deadlines
    if (analysis.deadlines.length > 0) {
      const deadlines = analysis.deadlines.map(d => ({
        user_id: user.id,
        document_id: documentId,
        title: d.reason,
        deadline_date: d.date,
        urgency: d.urgency,
        status: 'open',
        reminder_enabled: true,
      }));
      await supabase.from('deadlines').insert(deadlines);
    }

    // Update document status and type
    await supabase.from('documents').update({
      status: 'completed',
      document_type: analysis.document_type,
      authority_name: analysis.sender_authority,
      extracted_text: extractedText || null,
      source_language: 'de',
    }).eq('id', documentId);

    await incrementUsage(user.id, 'document_analysis', documentId);

    await writeAuditLog({
      userId: user.id,
      action: 'document_analyzed',
      metadata: { documentId, documentType: analysis.document_type },
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Analysis error:', error);

    if (documentId) {
      try {
        const supabase = await createClient();
        await supabase.from('documents').update({ status: 'failed' }).eq('id', documentId);
      } catch {}
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Analysis failed',
    }, { status: 500 });
  }
}
