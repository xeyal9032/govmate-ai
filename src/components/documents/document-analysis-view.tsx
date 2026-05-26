'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertTriangle, FileText, Clock } from 'lucide-react';
import type { DocumentAnalysis, Deadline } from '@/types/database';
import { formatDate, daysUntil } from '@/lib/utils/format';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/utils/language';

interface DocumentAnalysisViewProps {
  analysis: DocumentAnalysis;
  deadlines: Deadline[];
}

const urgencyColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export function DocumentAnalysisView({ analysis, deadlines }: DocumentAnalysisViewProps) {
  const t = useTranslations('documents.detail');
  const locale = useLocale() as Locale;

  const actions = (analysis.required_actions as unknown as Array<{ action: string; priority: string; deadline: string | null }>) || [];
  const requiredDocs = (analysis.required_documents as unknown as Array<{ name: string; why_needed: string; optional: boolean }>) || [];
  const risks = (analysis.risks_if_ignored as unknown as string[]) || [];

  return (
    <div className="space-y-4">
      {/* Confidence Score */}
      {analysis.confidence_score !== null && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{t('confidence')}:</span>
              <Progress value={analysis.confidence_score} className="flex-1" />
              <span className="text-sm font-bold">{analysis.confidence_score}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="summary">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="summary">{t('simpleExplanation')}</TabsTrigger>
          <TabsTrigger value="actions">{t('requiredActions')}</TabsTrigger>
          <TabsTrigger value="documents">{t('requiredDocuments')}</TabsTrigger>
          <TabsTrigger value="deadlines">{t('deadlines')}</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('simpleExplanation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.summary_simple}
              </p>
            </CardContent>
          </Card>
          {analysis.summary_detailed && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {analysis.summary_detailed}
                </p>
              </CardContent>
            </Card>
          )}
          {risks.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {t('risks')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {risks.map((risk, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-3">
          {actions.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t('noActions')}</CardContent></Card>
          ) : actions.map((action, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.action}</p>
                  {action.deadline && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('deadlinePrefix')}: {formatDate(action.deadline, locale)}
                    </p>
                  )}
                </div>
                <Badge className={priorityColors[action.priority] || ''} variant="secondary">
                  {t(`priority.${action.priority}`)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-3">
          {requiredDocs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t('noDocuments')}</CardContent></Card>
          ) : requiredDocs.map((doc, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{doc.why_needed}</p>
                </div>
                {doc.optional && (
                  <Badge variant="outline">{t('optional')}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-3">
          {deadlines.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">{t('noDeadlines')}</CardContent></Card>
          ) : deadlines.map((dl) => {
            const days = daysUntil(dl.deadline_date);
            return (
              <Card key={dl.id} className={`border ${urgencyColors[dl.urgency]?.split(' ').find(c => c.startsWith('border-')) || ''}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{dl.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(dl.deadline_date, locale)} · {days < 0 ? t('expired') : t('daysLeft', { days })}
                    </p>
                  </div>
                  <Badge className={urgencyColors[dl.urgency] || ''} variant="secondary">
                    {t(`priority.${dl.urgency}`)}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
