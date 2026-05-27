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

const CHART_HEIGHT = 160;
const MIN_BAR = 4;

function BarChart({
  values,
  labels,
  barClassName,
}: {
  values: number[];
  labels: string[];
  barClassName: string;
}) {
  const maxVal = Math.max(...values, 1);

  return (
    <svg
      viewBox={`0 0 ${values.length * 24} 200`}
      className="h-[200px] w-full text-foreground"
      role="img"
      aria-hidden
    >
      {values.map((value, i) => {
        const barH = Math.max((value / maxVal) * CHART_HEIGHT, MIN_BAR);
        const x = i * 24 + 4;
        const y = 180 - barH;
        return (
          <g key={labels[i] ?? i}>
            <text
              x={x + 8}
              y={y - 6}
              textAnchor="middle"
              fill="currentColor"
              fontSize={8}
            >
              {value}
            </text>
            <rect
              x={x}
              y={y}
              width={16}
              height={barH}
              rx={2}
              className={barClassName}
            />
            <text
              x={x + 8}
              y={196}
              textAnchor="middle"
              fill="currentColor"
              fontSize={7}
              opacity={0.6}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DashboardChart({ data }: Props) {
  const t = useTranslations('admin');
  const dates = data.map((d) => d.date);
  const documents = data.map((d) => d.documents);
  const aiUsage = data.map((d) => d.aiUsage);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('documentsChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            values={documents}
            labels={dates}
            barClassName="fill-primary"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('aiUsageChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            values={aiUsage}
            labels={dates}
            barClassName="fill-chart-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
