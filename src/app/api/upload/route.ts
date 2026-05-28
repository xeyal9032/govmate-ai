import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateFile, validateMagicBytes } from '@/lib/security/file-validation';
import { checkRateLimit, UPLOAD_RATE_LIMIT } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit-log';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateCheck = checkRateLimit(`upload:${user.id}`, UPLOAD_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests, please wait' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetLanguage = formData.get('targetLanguage') as string || 'tr';

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single();

    const plan = (subscription?.status === 'active' ? subscription?.plan : 'free') || 'free';
    const { data: limits } = await supabase
      .from('plan_limits')
      .select('max_file_size_mb, monthly_document_limit')
      .eq('plan', plan)
      .single();

    const maxSize = limits?.max_file_size_mb || 20;
    const monthlyDocLimit = limits?.monthly_document_limit || 20;

    if (monthlyDocLimit > 0) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());
      if ((count || 0) >= monthlyDocLimit) {
        return NextResponse.json({ error: 'Monthly document limit reached' }, { status: 403 });
      }
    }

    const validation = validateFile(
      { type: file.type, size: file.size, name: file.name },
      maxSize
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (!validateMagicBytes(arrayBuffer, file.type)) {
      return NextResponse.json({ error: 'File content does not match declared type' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }

    // Save to database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        original_file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
        status: 'uploaded',
        target_language: targetLanguage,
      })
      .select('id')
      .single();

    if (dbError || !document) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    await writeAuditLog({
      userId: user.id,
      action: 'document_uploaded',
      metadata: { documentId: document.id, fileName: file.name },
    });

    return NextResponse.json({ documentId: document.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
