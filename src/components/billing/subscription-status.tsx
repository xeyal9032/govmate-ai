'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface SubscriptionStatusProps {
  subscription: {
    plan: string;
    status: string;
    current_period_start?: string;
    current_period_end?: string;
    cancel_at_period_end?: boolean;
  };
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const t = useTranslations('billing');

  const statusColor =
    subscription.status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('currentPlan')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold capitalize">{subscription.plan}</span>
          <Badge className={`border-0 ${statusColor}`}>
            {subscription.status === 'active' ? t('active') : subscription.status}
          </Badge>
        </div>

        {subscription.current_period_end && (
          <p className="text-sm text-muted-foreground">
            {t('periodEnd')}: {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        )}

        {subscription.cancel_at_period_end && (
          <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{t('cancelNotice')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
