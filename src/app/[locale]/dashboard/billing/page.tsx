'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { getUserSubscription, getUsageSummary } from '@/actions/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PricingCard } from '@/components/billing/pricing-card';
import { SubscriptionStatus } from '@/components/billing/subscription-status';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { getApiBaseUrl, readApiError, readApiJson } from '@/lib/utils/api-response';

interface UsageSummary {
  documentsUsed: number;
  documentsLimit: number;
  lettersUsed: number;
  lettersLimit: number;
  currentPlan: string;
}

const PLANS = ['free', 'pro', 'business'] as const;

export default function BillingPage() {
  const t = useTranslations('billing');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [sub, usageData] = await Promise.all([
        getUserSubscription(),
        getUsageSummary(),
      ]);
      setSubscription(sub);
      setUsage(usageData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') toast.success(t('subscriptionUpdated'));
    if (canceled === 'true') toast.info(t('paymentCanceled'));
  }, [searchParams]);

  const handleUpgrade = async (plan: string) => {
    if (plan === 'free') return;
    setUpgrading(plan);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, locale }),
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const message = await readApiError(response, t('error'));
        toast.error(message);
        return;
      }

      const { url } = await readApiJson<{ url: string | null }>(response);
      if (url) {
        window.location.assign(url);
      } else {
        toast.error(t('error'));
      }
    } catch {
      toast.error(t('error'));
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/stripe/portal`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const message = await readApiError(response, t('error'));
        toast.error(message);
        return;
      }

      const { url } = await readApiJson<{ url: string | null }>(response);
      if (url) {
        window.location.assign(url);
      } else {
        toast.error(t('error'));
      }
    } catch {
      toast.error(t('error'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-xl bg-muted" />
          <div className="h-48 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {subscription?.stripe_customer_id && (
          <Button variant="outline" onClick={handleManageBilling}>
            <CreditCard className="size-4" />
            {t('manageBilling')}
          </Button>
        )}
      </div>

      {/* Abonelik durumu */}
      {subscription && <SubscriptionStatus subscription={subscription} />}

      {/* Kullanım */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle>{t('usage')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('documents')}</span>
                <span className="text-muted-foreground">{usage.documentsUsed} / {usage.documentsLimit === -1 ? '∞' : usage.documentsLimit}</span>
              </div>
              <Progress value={usage.documentsLimit === -1 ? 0 : Math.min((usage.documentsUsed / usage.documentsLimit) * 100, 100)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('letters')}</span>
                <span className="text-muted-foreground">{usage.lettersUsed} / {usage.lettersLimit === -1 ? '∞' : usage.lettersLimit}</span>
              </div>
              <Progress value={usage.lettersLimit === -1 ? 0 : Math.min((usage.lettersUsed / usage.lettersLimit) * 100, 100)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fiyatlandırma */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan}
            plan={plan}
            isActive={usage?.currentPlan === plan}
            isLoading={upgrading === plan}
            onUpgrade={() => handleUpgrade(plan)}
          />
        ))}
      </div>
    </div>
  );
}
