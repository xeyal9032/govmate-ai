import { notFound } from 'next/navigation';
import { TemplateForm } from '@/components/templates/template-form';
import { setRequestLocale } from 'next-intl/server';
import { getTemplate } from '@/actions/templates';

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const template = await getTemplate(id);

  if (!template || !template.is_active) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TemplateForm
        templateId={template.id}
        templateTitle={template.title}
        templateBody={template.content}
        variables={template.variables}
        category={template.category || ''}
      />
    </div>
  );
}
