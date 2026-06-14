'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Building2, CreditCard, Shield } from 'lucide-react';

import { getPlanFeatureDescriptors } from '@/lib/utils/plan-feature-labels';
import type { PlanLimit } from '@/types/database';

const plans = [
  {
    key: 'free' as const,
    icon: Zap,
    gradient: 'from-slate-500 to-slate-700',
    glow: 'hover:shadow-slate-500/10',
    accentText: 'text-foreground',
  },
  {
    key: 'pro' as const,
    icon: Sparkles,
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'hover:shadow-blue-500/25',
    accentText: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400',
  },
  {
    key: 'business' as const,
    icon: Building2,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/15',
    accentText: 'text-foreground',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface PricingSectionProps {
  planLimits?: PlanLimit[];
}

export function PricingSection({ planLimits = [] }: PricingSectionProps) {
  const t = useTranslations();
  const landingT = useTranslations('landing.pricing');
  const billingT = useTranslations('billing');

  return (
    <section id="pricing" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/25 via-background to-muted/20" />
      <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
            <CreditCard className="h-3.5 w-3.5" />
            {landingT('badge')}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{landingT('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{landingT('subtitle')}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-10 grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {plans.map((plan) => {
            const isPro = plan.key === 'pro';
            const planLimit = planLimits.find((l) => l.plan === plan.key);
            const features: string[] = planLimit
              ? getPlanFeatureDescriptors(planLimit).map((d) =>
                  billingT(`planFeatures.${d.key}`, d.params),
                )
              : (billingT.raw(`plans.${plan.key}.features`) as string[]);
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.key}
                variants={itemVariants}
                whileHover={{ y: isPro ? -6 : -4 }}
                className={`relative flex ${isPro ? 'lg:z-10' : ''}`}
              >
                {isPro && (
                  <div className="absolute -inset-px rounded-[1.65rem] bg-gradient-to-b from-blue-500/50 via-indigo-500/30 to-transparent blur-sm" />
                )}

                <div
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card/85 shadow-lg backdrop-blur-md transition-shadow ${plan.glow} ${isPro ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-border/60'}`}
                >
                  {isPro && (
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                      <div className="rounded-b-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                        {landingT('popular')}
                      </div>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${isPro ? 'from-blue-500/8 via-indigo-500/4 to-transparent' : 'from-muted/30 via-transparent to-transparent'} opacity-80`} />

                  <div className={`relative flex flex-1 flex-col p-5 sm:p-6 ${isPro ? 'pt-10' : ''}`}>
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} shadow-md`}
                      >
                        <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{billingT(`plans.${plan.key}.name`)}</h3>
                        {plan.key !== 'free' && (
                          <p className="text-xs text-muted-foreground">{landingT('monthly')}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span className={`text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl ${plan.accentText}`}>
                          {billingT(`plans.${plan.key}.price`)}
                        </span>
                        {plan.key !== 'free' && (
                          <span className="mb-2 text-sm text-muted-foreground">/ {landingT('monthlyShort')}</span>
                        )}
                      </div>
                    </div>

                    <ul className="mb-5 flex-1 space-y-2">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}
                          >
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-sm leading-snug text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth/register" className="block">
                      <Button
                        className={`w-full font-semibold ${
                          isPro
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
                            : plan.key === 'business'
                              ? 'border-violet-500/30 hover:bg-violet-500/5'
                              : ''
                        }`}
                        variant={isPro ? 'default' : 'outline'}
                        size="default"
                      >
                        {plan.key === 'free' ? landingT('free') : t('billing.upgrade')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground"
        >
          <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
          {landingT('footnote')}
        </motion.p>
      </div>
    </section>
  );
}
