'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { updateDeadlineStatus, createManualDeadline, deleteDeadline } from '@/actions/deadlines';
import { generateICSEvent } from '@/lib/utils/date';
import { formatDate } from '@/lib/utils/format';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/utils/language';
import { differenceInDays, parseISO } from 'date-fns';
import {
  CheckCircle,
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Deadline } from '@/types/database';

type Urgency = 'critical' | 'high' | 'medium' | 'low';
type Status = 'open' | 'done';

const URGENCY_STYLES: Record<Urgency, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

interface DeadlinesListProps {
  initialDeadlines: (Deadline & {
    documents?: { title: string | null; authority_name: string | null } | null;
  })[];
}

export function DeadlinesList({ initialDeadlines }: DeadlinesListProps) {
  const t = useTranslations('deadlines');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('open');
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newUrgency, setNewUrgency] = useState<Urgency>('medium');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewDate('');
    setNewUrgency('medium');
    setReminderEnabled(true);
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newDate) return;
    startTransition(async () => {
      try {
        await createManualDeadline({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          deadline_date: newDate,
          urgency: newUrgency,
          reminder_enabled: reminderEnabled,
        });
        toast.success(t('deadlineCreated'));
        resetForm();
        setDialogOpen(false);
      } catch {
        toast.error(t('deadlineCreateError'));
      }
    });
  };

  const filtered = initialDeadlines.filter((d) => {
    if (urgencyFilter !== 'all' && d.urgency !== urgencyFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteDeadline(id);
        toast.success(t('deadlineDeleted'));
      } catch {
        toast.error(t('deadlineDeleteError'));
      }
    });
  };

  const handleMarkDone = (id: string) => {
    startTransition(async () => {
      await updateDeadlineStatus(id, 'done');
      toast.success(t('markDone'));
    });
  };

  const handleExportICS = (deadline: Deadline) => {
    const icsContent = generateICSEvent({
      title: deadline.title,
      description: deadline.description || '',
      date: deadline.deadline_date,
      id: deadline.id,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deadline_${deadline.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDaysLeft = (dateStr: string) => {
    return differenceInDays(parseISO(dateStr), new Date());
  };

  const getDaysLabel = (days: number) => {
    if (days < 0) return t('overdue');
    if (days === 0) return t('today');
    return t('daysLeft', { days });
  };

  return (
    <div className="space-y-4">
      {/* Yeni deadline butonu + dialog */}
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4 mr-1" />
          {t('newDeadline')}
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('newDeadline')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="dl-title">{t('deadlineTitle')}</Label>
                <Input
                  id="dl-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dl-desc">{t('deadlineDescription')}</Label>
                <Input
                  id="dl-desc"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dl-date">{t('deadlineDate')}</Label>
                <Input
                  id="dl-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('urgencyLevel')}</Label>
                <Select value={newUrgency} onValueChange={(v) => v && setNewUrgency(v as Urgency)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('urgency.low')}</SelectItem>
                    <SelectItem value="medium">{t('urgency.medium')}</SelectItem>
                    <SelectItem value="high">{t('urgency.high')}</SelectItem>
                    <SelectItem value="critical">{t('urgency.critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
                <Label>{t('reminderEnabled')}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={!newTitle.trim() || !newDate || isPending}
              >
                {tCommon('save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtreler — mobilde yatay kaydırma */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="tabs-scroll overflow-x-auto">
          <div className="flex w-max gap-1 rounded-lg bg-muted p-1">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((u) => (
            <Button
              key={u}
              variant={urgencyFilter === u ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setUrgencyFilter(u)}
            >
              {u === 'all' ? tCommon('filter') : t(`urgency.${u}`)}
            </Button>
          ))}
          </div>
        </div>

        <div className="tabs-scroll overflow-x-auto">
          <div className="flex w-max gap-1 rounded-lg bg-muted p-1">
          {(['all', 'open', 'done'] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? tCommon('filter') : s === 'open' ? t('statusOpen') : t('statusDone')}
            </Button>
          ))}
          </div>
        </div>
      </div>

      {/* Deadline siyahısı */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">{t('noDeadlines')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((deadline) => {
            const daysLeft = getDaysLeft(deadline.deadline_date);
            const urgency = deadline.urgency as Urgency;

            return (
              <Card
                key={deadline.id}
                className={cn(
                  'transition-all',
                  deadline.status === 'done' && 'opacity-60'
                )}
              >
                <CardContent className="flex items-center gap-4 py-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          'font-medium',
                          deadline.status === 'done' && 'line-through'
                        )}
                      >
                        {deadline.title}
                      </h3>
                      <Badge
                        className={cn(
                          'text-xs border-0',
                          URGENCY_STYLES[urgency]
                        )}
                      >
                        {t(`urgency.${urgency}`)}
                      </Badge>
                    </div>

                    {deadline.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {deadline.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(deadline.deadline_date, locale)}
                      </span>
                      {(deadline as Deadline & { document_id?: string }).document_id && (
                        <Link
                          href={`/dashboard/documents/${(deadline as Deadline & { document_id?: string }).document_id}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <FileText className="size-3" />
                          {t('viewDocument')}
                        </Link>
                      )}
                      <span
                        className={cn(
                          'flex items-center gap-1 font-medium',
                          daysLeft < 0 && 'text-red-600',
                          daysLeft === 0 && 'text-orange-600',
                          daysLeft > 0 && daysLeft <= 3 && 'text-yellow-600'
                        )}
                      >
                        {daysLeft <= 3 && <AlertTriangle className="size-3" />}
                        {getDaysLabel(daysLeft)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportICS(deadline)}
                      title={t('exportCalendar')}
                    >
                      <Download className="size-3.5" />
                    </Button>
                    {deadline.status !== 'done' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkDone(deadline.id)}
                        disabled={isPending}
                      >
                        <CheckCircle className="size-3.5" />
                        {t('markDone')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(deadline.id)}
                      disabled={isPending}
                      title={t('deleteDeadline')}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
