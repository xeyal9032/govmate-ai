'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import type { Deadline } from '@/types/database';
import { formatDate, daysUntil } from '@/lib/utils/format';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/utils/language';

interface DeadlineListProps {
  deadlines: Deadline[];
}

export function DeadlineList({ deadlines }: DeadlineListProps) {
  const t = useTranslations('dashboard');
  const tDl = useTranslations('deadlines');
  const locale = useLocale() as Locale;

  const urgencyColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('openDeadlines')}</CardTitle>
        <Link href="/dashboard/deadlines">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('noDeadlines')}</p>
        ) : (
          <div className="space-y-3">
            {deadlines.map((dl) => {
              const days = daysUntil(dl.deadline_date);
              const isOverdue = days < 0;
              const isToday = days === 0;

              return (
                <div key={dl.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Clock className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dl.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(dl.deadline_date, locale)}
                      {' · '}
                      {isOverdue ? (
                        <span className="text-red-500 font-medium">{tDl('overdue')}</span>
                      ) : isToday ? (
                        <span className="text-orange-500 font-medium">{tDl('today')}</span>
                      ) : (
                        tDl('daysLeft', { days })
                      )}
                    </p>
                  </div>
                  <Badge className={urgencyColors[dl.urgency] || ''} variant="secondary">
                    {tDl(`urgency.${dl.urgency}`)}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
