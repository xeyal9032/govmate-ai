'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';

import { getPlanFeatureDescriptors } from '@/lib/utils/plan-feature-labels';
import type { PlanLimit } from '@/types/database';

const plans = [
  {
    key: 'free' as const,
    icon: Zap,
    gradient: 'from-slate-500 to-slate-600',
    borderClass: 'border-border',
    bgClass: '',
    buttonVariant: 'outline' as const,
  },
  {
    key: 'pro' as const,
    icon: Sparkles,
    gradient: 'from-blue-500 to-indigo-600',
    borderClass: 'border-blue-500/50',
    bgClass: 'bg-gradient-to-b from-blue-500/[0.07] to-transparent dark:from-blue-500/[0.12]',
    buttonVariant: 'default' as const,
  },
  {
    key: 'business' as const,
    icon: Building2,
    gradient: 'from-purple-500 to-pink-500',
    borderClass: 'border-purple-500/30',
    bgClass: '',
    buttonVariant: 'outline' as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

interface PricingSectionProps {
  planLimits?: PlanLimit[];
}

export function PricingSection({ planLimits = [] }: PricingSectionProps) {
  const t = useTranslations();
  const landingT = useTranslations('landing.pricing');
  const billingT = useTranslations('billing');

  return (
    <section id="pricing" className="relative overflow-hidden bg-muted/30 py-24 sm:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {landingT('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {landingT('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid items-center gap-8 lg:grid-cols-3"
        >
          {plans.map((plan) => {
            const isPro = plan.key === 'pro';
            const planLimit = planLimits.find((l) => l.plan === plan.key);
            const features: string[] = planLimit
              ? getPlanFeatureDescriptors(planLimit).map((d) =>
                  billingT(`planFeatures.${d.key}`, d.params)
                )
              : (billingT.raw(`plans.${plan.key}.features`) as string[]);
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.key}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={isPro ? 'lg:-my-4 max-lg:mx-auto max-lg:max-w-md' : ''}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl border-2 ${plan.borderClass} ${plan.bgClass} bg-card p-1 shadow-xl transition-shadow duration-300 hover:shadow-2xl`}
                >
                  {/* Pro badge */}
                  {isPro && (
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="rounded-b-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-1.5 text-sm font-semibold text-white shadow-lg"
                      >
                        {landingT('popular')}
                      </motion.div>
                    </div>
                  )}

                  <div className={`rounded-2xl p-6 sm:p-8 ${isPro ? 'pt-12' : ''}`}>
                    {/* Üst kısım: ikon + plan adı */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{billingT(`plans.${plan.key}.name`)}</h3>
                    </div>

                    {/* Fiyat */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-extrabold tracking-tight ${isPro ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400' : ''}`}>
                          {billingT(`plans.${plan.key}.price`)}
                        </span>
                        {plan.key !== 'free' && (
                          <span className="ml-1 text-base text-muted-foreground">
                            / {landingT('monthly')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Özellikler */}
                    <ul className="mb-8 space-y-3.5">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}>
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Buton */}
                    <Link href="/auth/register" className="block">
                      <Button
                        className={`w-full py-6 text-base font-semibold ${isPro ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30' : ''}`}
                        variant={plan.buttonVariant}
                        size="lg"
                      >
                        {plan.key === 'free'
                          ? landingT('free')
                          : t('billing.upgrade')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
