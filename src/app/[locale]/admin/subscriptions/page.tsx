import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { createAdminClient } from '@/lib/supabase/admin';
import { SubscriptionPlanChanger } from '@/components/admin/subscription-plan-changer';
import { SubscriptionStatusChanger } from '@/components/admin/subscription-status-changer';
import { isPlanKey, type PlanKey } from '@/lib/utils/plan-keys';

interface AdminSubscriptionRow {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
}

export default async function AdminSubscriptionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const tBilling = await getTranslations('billing');
  const admin = createAdminClient();

  const { data: subscriptions } = await admin
    .from('subscriptions')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });

  const planCounts: Record<PlanKey, number> = { free: 0, pro: 0, business: 0 };
  subscriptions?.forEach((s: AdminSubscriptionRow) => {
    if (isPlanKey(s.plan)) planCounts[s.plan]++;
  });

  const activeSubs =
    subscriptions?.filter((s: AdminSubscriptionRow) => s.status === 'active').length || 0;

  const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    active: 'default',
    inactive: 'secondary',
    canceled: 'destructive',
    past_due: 'destructive',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('subscriptions')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{subscriptions?.length || 0}</p>
            <p className="text-sm text-muted-foreground">{t('total')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{planCounts.free}</p>
            <p className="text-sm text-muted-foreground">{tBilling('plans.free.name')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">{planCounts.pro}</p>
            <p className="text-sm text-muted-foreground">{tBilling('plans.pro.name')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{planCounts.business}</p>
            <p className="text-sm text-muted-foreground">{tBilling('plans.business.name')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('activeSubscriptions')}: {activeSubs}</CardTitle>
        </CardHeader>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('nameColumn')}</TableHead>
              <TableHead>{t('emailColumn')}</TableHead>
              <TableHead>{t('planColumn')}</TableHead>
              <TableHead>{t('statusColumn')}</TableHead>
              <TableHead>{t('changeStatus')}</TableHead>
              <TableHead>{t('changePlan')}</TableHead>
              <TableHead>{t('dateColumn')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!subscriptions || subscriptions.length === 0) ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t('noData')}
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub: AdminSubscriptionRow) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {sub.profiles?.full_name || '—'}
                  </TableCell>
                  <TableCell>{sub.profiles?.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {isPlanKey(sub.plan)
                        ? tBilling(`plans.${sub.plan}.name`)
                        : sub.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[sub.status] || 'outline'}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SubscriptionStatusChanger subscriptionId={sub.id} currentStatus={sub.status} />
                  </TableCell>
                  <TableCell>
                    <SubscriptionPlanChanger subscriptionId={sub.id} currentPlan={sub.plan} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
