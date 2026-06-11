import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTemplatePDF } from '@/lib/pdf/generate-template-pdf';

/** Doldurulmuş şablon metninden PDF oluşturur */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title ?? '').trim();
    const content = String(body.content ?? '').trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateTemplatePDF({ title, content });

    const safeName = title.replace(/[^\w\-]+/g, '_').slice(0, 80);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName || 'template'}.pdf"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Template PDF generation failed:', error);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
