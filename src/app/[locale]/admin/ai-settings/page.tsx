import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAppSettings } from '@/actions/admin';
import { AISettingsForm } from '@/components/admin/ai-settings-form';

export default async function AdminAISettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  let settings: Record<string, string> = {};
  try {
    settings = await getAppSettings();
  } catch {
    // Settings table might not exist yet
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('aiSettingsTitle')}</h1>
        <p className="text-muted-foreground">{t('aiSettingsDesc')}</p>
      </div>
      <AISettingsForm initialSettings={settings} />
    </div>
  );
}
