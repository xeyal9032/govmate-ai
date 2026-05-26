'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Upload, Brain, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { icon: Upload, key: 'step1', color: 'text-blue-500 bg-blue-500/10' },
  { icon: Brain, key: 'step2', color: 'text-purple-500 bg-purple-500/10' },
  { icon: Mail, key: 'step3', color: 'text-green-500 bg-green-500/10' },
  { icon: Clock, key: 'step4', color: 'text-orange-500 bg-orange-500/10' },
];

export function LandingHowItWorks() {
  const t = useTranslations('landing.howItWorks');

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <div className={`h-14 w-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto`}>
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{t(`${step.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`${step.key}.description`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
