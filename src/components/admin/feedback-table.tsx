'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateFeedbackStatus, replyToFeedback, deleteFeedback } from '@/actions/admin';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { MessageSquare, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  type: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
}

interface FeedbackTableProps {
  feedbacks: Feedback[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  new: 'default',
  reviewed: 'secondary',
  resolved: 'outline',
  dismissed: 'destructive',
};

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [isPending, startTransition] = useTransition();
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyingFeedback, setReplyingFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      try {
        await updateFeedbackStatus(id, status);
        toast.success(t('feedbackUpdated'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm(t('deleteFeedbackConfirm'))) return;
    startTransition(async () => {
      try {
        await deleteFeedback(id);
        toast.success(t('feedbackDeleted'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleReply = () => {
    if (!replyingFeedback || !replyText.trim()) return;
    startTransition(async () => {
      try {
        await replyToFeedback(replyingFeedback.id, replyText.trim());
        toast.success(t('replySent'));
        setReplyDialogOpen(false);
        setReplyingFeedback(null);
        setReplyText('');
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('feedbackUser')}</TableHead>
            <TableHead>{t('feedbackType')}</TableHead>
            <TableHead className="max-w-[300px]">{t('feedbackMessage')}</TableHead>
            <TableHead>{t('adminReply')}</TableHead>
            <TableHead>{t('feedbackStatus')}</TableHead>
            <TableHead>{t('dateColumn')}</TableHead>
            <TableHead className="w-[140px]">{t('feedbackChangeStatus')}</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                {t('noFeedback')}
              </TableCell>
            </TableRow>
          ) : (
            feedbacks.map((fb) => (
              <TableRow key={fb.id}>
                <TableCell className="text-sm">
                  <div>{fb.profiles?.full_name || '—'}</div>
                  <div className="text-xs text-muted-foreground">{fb.profiles?.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{fb.type}</Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-sm">{fb.message}</TableCell>
                <TableCell className="max-w-[200px] text-sm">
                  {fb.admin_reply ? (
                    <span className="text-xs text-muted-foreground italic">{fb.admin_reply}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[fb.status] || 'outline'}>{fb.status}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(fb.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={fb.status}
                    onValueChange={(val) => val && handleStatusChange(fb.id, val)}
                    disabled={isPending}
                  >
                    <SelectTrigger size="sm" className="h-7 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{t('statusNew')}</SelectItem>
                      <SelectItem value="reviewed">{t('statusReviewed')}</SelectItem>
                      <SelectItem value="resolved">{t('statusResolved')}</SelectItem>
                      <SelectItem value="dismissed">{t('statusDismissed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setReplyingFeedback(fb);
                        setReplyText(fb.admin_reply || '');
                        setReplyDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(fb.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('replyToFeedback')}</DialogTitle>
            <DialogDescription>{replyingFeedback?.message}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t('replyPlaceholder')}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleReply} disabled={isPending || !replyText.trim()}>
              {isPending ? t('saving') : t('replyToFeedback')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
