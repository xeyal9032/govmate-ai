import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { CategoriesManager } from '@/components/admin/categories-manager';

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('template_categories')
    .select('*')
    .order('slug', { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('categoriesNav')}</h1>
      <CategoriesManager categories={categories || []} />
    </div>
  );
}
