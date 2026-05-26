import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAnnouncements } from '@/actions/admin';
import { AnnouncementsManager } from '@/components/admin/announcements-manager';

export default async function AdminAnnouncementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('announcementsTitle')}</h1>
        <p className="text-muted-foreground">{t('announcementsDesc')}</p>
      </div>
      <AnnouncementsManager announcements={announcements} />
    </div>
  );
}
