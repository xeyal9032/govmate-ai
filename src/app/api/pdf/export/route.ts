import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateExportPDF, type UserExportData } from '@/lib/pdf/generate-export-pdf';
import { assertPlanFeature } from '@/lib/utils/plan-limits';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const featureCheck = await assertPlanFeature(supabase, user.id, 'pdf_export_enabled');
    if (!featureCheck.ok) {
      return NextResponse.json({ error: featureCheck.error }, { status: 403 });
    }

    const [profile, docs, letters, deadlines] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('documents')
        .select('id, title, original_file_name, status, document_type, authority_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('generated_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('deadlines')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline_date', { ascending: true }),
    ]);

    const exportData: UserExportData = {
      profile: profile.data,
      documents: docs.data || [],
      letters: letters.data || [],
      deadlines: deadlines.data || [],
      exported_at: new Date().toISOString(),
    };

    const pdfBuffer = await generateExportPDF(exportData);

    const fileName = `GovMate_Rapor_${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('PDF export failed:', error);
    return NextResponse.json({ error: 'PDF export failed' }, { status: 500 });
  }
}
