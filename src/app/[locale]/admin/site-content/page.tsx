import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSiteContent } from '@/actions/admin';
import { SiteContentManager } from '@/components/admin/site-content-manager';

export default async function AdminSiteContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  let content: any[] = [];
  try { content = await getSiteContent(); } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('siteContentTitle')}</h1>
        <p className="text-muted-foreground">{t('siteContentDesc')}</p>
      </div>
      <SiteContentManager content={content} />
    </div>
  );
}
