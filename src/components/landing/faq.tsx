'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqKeys = ['1', '2', '3', '4', '5'] as const;

export function LandingFAQ() {
  const t = useTranslations('landing.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-muted/30" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqKeys.map((key, i) => (
            <Card key={key} className="border-0 shadow-sm">
              <CardContent className="p-0">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-medium">{t(`q${key}`)}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform',
                      openIndex === i && 'rotate-180'
                    )}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {t(`a${key}`)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
