import { createAdminClient } from '@/lib/supabase/admin';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TemplatesTable } from '@/components/admin/templates-table';

export default async function AdminTemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  const admin = createAdminClient();
  const { data: templates } = await admin
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: categories } = await admin
    .from('template_categories')
    .select('slug, name')
    .order('slug');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('templates')}</h1>
        <p className="text-muted-foreground">
          {t('templatesDesc')}
        </p>
      </div>

      <TemplatesTable templates={templates || []} categories={categories || []} />
    </div>
  );
}
