'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitFeedback } from '@/actions/feedback';
import { toast } from 'sonner';

const FEEDBACK_TYPES = ['bug', 'feature', 'general', 'complaint'] as const;

export function FeedbackDialog() {
  const t = useTranslations('feedback');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await submitFeedback({ type, message });
      toast.success(t('success'));
      setMessage('');
      setType('general');
      setOpen(false);
    } catch {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" />
        }
      >
        <MessageSquare className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('messagePlaceholder')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>{t('typeLabel')}</Label>
            <Select value={type} onValueChange={(v) => setType(v ?? 'general')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_TYPES.map((ft) => (
                  <SelectItem key={ft} value={ft}>
                    {t(`types.${ft}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder={t('messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !message.trim()}>
            {loading ? '...' : t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
