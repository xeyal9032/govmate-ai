import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PlanLimitsManager } from '@/components/admin/plan-limits-manager';

export default async function AdminPlanLimitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const admin = createAdminClient();
  const { data: plans } = await admin.from('plan_limits').select('*').order('plan');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('planLimitsTitle')}</h1>
        <p className="text-muted-foreground">{t('planLimitsDesc')}</p>
      </div>
      <PlanLimitsManager plans={plans || []} />
    </div>
  );
}
