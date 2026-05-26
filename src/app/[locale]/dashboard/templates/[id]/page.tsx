import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TemplateForm } from '@/components/templates/template-form';
import { setRequestLocale } from 'next-intl/server';

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();

  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!template) {
    notFound();
  }

  const variables = Array.isArray(template.variables) ? template.variables : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TemplateForm
        templateId={template.id}
        templateTitle={template.title}
        templateBody={template.content}
        variables={variables}
        category={template.category || ''}
      />
    </div>
  );
}
