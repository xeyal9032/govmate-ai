'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFeedbackWithReplies } from '@/actions/feedback';
import { MessageSquareReply } from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: string;
  message: string;
  admin_reply: string | null;
  status: string;
  created_at: string;
}

export function FeedbackRepliesWidget() {
  const t = useTranslations('dashboard.feedback');
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedbackWithReplies()
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  const withReplies = items.filter((item) => item.admin_reply);

  if (loading || withReplies.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquareReply className="h-4 w-4" />
          {t('repliesTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {withReplies.slice(0, 3).map((item) => (
          <div key={item.id} className="rounded-lg border p-3 text-sm">
            <p className="text-muted-foreground line-clamp-2">{item.message}</p>
            <p className="mt-2 font-medium">{t('adminReply')}</p>
            <p className="text-muted-foreground whitespace-pre-wrap">{item.admin_reply}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
