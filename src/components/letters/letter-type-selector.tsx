'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MessageSquareReply,
  FileText,
  CalendarClock,
  Send,
  Clock,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

const LETTER_TYPES = [
  { key: 'simple_reply', icon: MessageSquareReply },
  { key: 'formal_letter', icon: FileText },
  { key: 'appointment_request', icon: CalendarClock },
  { key: 'document_submission', icon: Send },
  { key: 'deadline_extension', icon: Clock },
  { key: 'clarification_request', icon: HelpCircle },
  { key: 'objection', icon: ShieldAlert },
] as const;

type LetterType = (typeof LETTER_TYPES)[number]['key'];

interface LetterTypeSelectorProps {
  selected: LetterType | null;
  onSelect: (type: LetterType) => void;
}

export function LetterTypeSelector({ selected, onSelect }: LetterTypeSelectorProps) {
  const t = useTranslations('letters');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('generate.selectType')}</h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {LETTER_TYPES.map(({ key, icon: Icon }) => (
          <Card
            key={key}
            className={cn(
              'cursor-pointer transition-all hover:ring-2 hover:ring-primary/30',
              selected === key && 'ring-2 ring-primary bg-primary/5'
            )}
            onClick={() => onSelect(key)}
          >
            <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
              <Icon
                className={cn(
                  'size-8 text-muted-foreground',
                  selected === key && 'text-primary'
                )}
              />
              <span className="text-sm font-medium">
                {t(`generate.types.${key}` as any)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected === 'objection' && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
          <AlertTriangle className="size-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            {t('objectionDisclaimer')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
