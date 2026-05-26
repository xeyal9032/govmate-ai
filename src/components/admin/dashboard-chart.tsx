'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartDataPoint {
  date: string;
  documents: number;
  aiUsage: number;
}

interface Props {
  data: ChartDataPoint[];
}

export function DashboardChart({ data }: Props) {
  const t = useTranslations('admin');
  const maxVal = Math.max(...data.map(d => Math.max(d.documents, d.aiUsage)), 1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('documentsChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-[200px]">
            {data.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{d.documents}</span>
                <div
                  className="w-full bg-primary rounded-t-sm transition-all"
                  style={{ height: `${Math.max((d.documents / maxVal) * 160, 4)}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('aiUsageChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-[200px]">
            {data.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{d.aiUsage}</span>
                <div
                  className="w-full bg-chart-2 rounded-t-sm transition-all"
                  style={{ height: `${Math.max((d.aiUsage / maxVal) * 160, 4)}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
