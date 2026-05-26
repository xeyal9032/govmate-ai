import { getAdminStats, getAdminChartData } from '@/actions/admin';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Bot, Mail } from 'lucide-react';
import { DashboardChart } from '@/components/admin/dashboard-chart';

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const stats = await getAdminStats();

  let chartData: any[] = [];
  try { chartData = await getAdminChartData(); } catch {}

  const cards = [
    { title: t('totalUsers'), value: stats.totalUsers, icon: Users, description: t('registeredUsersDesc') },
    { title: t('totalDocuments'), value: stats.totalDocuments, icon: FileText, description: t('uploadedDocsDesc') },
    { title: t('aiUsage'), value: stats.monthlyAIUsage, icon: Bot, description: t('monthlyAIDesc') },
    { title: t('totalLetters'), value: stats.totalLetters, icon: Mail, description: t('generatedLettersDesc') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('systemOverview')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {chartData.length > 0 && <DashboardChart data={chartData} />}
    </div>
  );
}
