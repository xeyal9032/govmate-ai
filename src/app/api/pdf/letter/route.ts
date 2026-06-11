import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLetterPDF } from '@/lib/pdf/generate-letter-pdf';
import { assertPlanFeature } from '@/lib/utils/plan-limits';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const featureCheck = await assertPlanFeature(supabase, user.id, 'pdf_export_enabled');
    if (!featureCheck.ok) {
      return NextResponse.json(
        { error: featureCheck.error, errorCode: featureCheck.errorCode },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { senderName, senderAddress, recipientName, recipientAddress, date, subject, germanBody, body: letterBody } = body;
    const resolvedBody = germanBody || letterBody;

    if (!subject || !resolvedBody) {
      return NextResponse.json(
        { error: 'subject and body/germanBody are required' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateLetterPDF({
      senderName: senderName || '',
      senderAddress: senderAddress || '',
      recipientName: recipientName || '',
      recipientAddress: recipientAddress || '',
      date: date || new Date().toLocaleDateString('de-DE'),
      subject,
      body: resolvedBody,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="brief_${Date.now()}.pdf"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
