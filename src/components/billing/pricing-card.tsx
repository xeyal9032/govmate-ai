'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: 'free' | 'pro' | 'business';
  isActive: boolean;
  isLoading?: boolean;
  onUpgrade: () => void;
}

export function PricingCard({ plan, isActive, isLoading, onUpgrade }: PricingCardProps) {
  const t = useTranslations('billing');

  const planName = t(`plans.${plan}.name`);
  const planPrice = t(`plans.${plan}.price`);
  const features = t.raw(`plans.${plan}.features`) as string[];
  const isPopular = plan === 'pro';

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        isPopular && 'ring-2 ring-primary',
        isActive && 'bg-primary/5'
      )}
    >
      {isPopular && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          {t('popular')}
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{planName}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{planPrice}</span>
          {plan !== 'free' && (
            <span className="text-sm text-muted-foreground"> {t('perMonth')}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <ul className="flex-1 space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {isActive ? (
            <Button className="w-full" disabled>
              {t('currentPlanLabel')}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full"
              variant={isPopular ? 'default' : 'outline'}
              onClick={onUpgrade}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {plan === 'free' ? t('startFree') : t('upgrade')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
