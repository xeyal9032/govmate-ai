import { getTemplates, getTemplateCategories } from '@/actions/templates';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TemplatesView } from '@/components/templates/templates-view';

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('templates');
  const templates = await getTemplates();
  const categories = await getTemplateCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
      <TemplatesView templates={templates} categories={categories} />
    </div>
  );
}
