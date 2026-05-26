import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeedbacks } from '@/actions/admin';
import { FeedbackTable } from '@/components/admin/feedback-table';

export default async function AdminFeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('feedbackTitle')}</h1>
        <p className="text-muted-foreground">{t('feedbackDesc')}</p>
      </div>
      <FeedbackTable feedbacks={feedbacks} />
    </div>
  );
}
