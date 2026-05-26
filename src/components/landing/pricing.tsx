'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function LandingPricing() {
  const t = useTranslations('landing.pricing');
  const tBilling = useTranslations('billing.plans');

  const plans = [
    {
      key: 'free' as const,
      highlighted: false,
    },
    {
      key: 'pro' as const,
      highlighted: true,
    },
    {
      key: 'business' as const,
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const features = tBilling.raw(`${plan.key}.features`) as string[];
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`relative h-full ${
                    plan.highlighted
                      ? 'border-primary shadow-lg shadow-primary/10 scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        {t('popular')}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{tBilling(`${plan.key}.name`)}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tBilling(`${plan.key}.price`)}</span>
                      {plan.key !== 'free' && (
                        <span className="text-muted-foreground ml-1">/ {t('monthly')}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-8">
                      {features.map((feature: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/register" className="block">
                      <Button
                        className="w-full rounded-xl"
                        variant={plan.highlighted ? 'default' : 'outline'}
                      >
                        {t('free')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
