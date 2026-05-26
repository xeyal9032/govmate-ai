'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Info, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, AlertAction } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getActiveAnnouncements } from '@/actions/announcements';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
}

const STORAGE_KEY = 'govmate-dismissed-announcements';

const typeConfig: Record<string, { className: string; icon: typeof Info }> = {
  info:        { className: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100', icon: Info },
  warning:     { className: 'border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100', icon: AlertTriangle },
  success:     { className: 'border-green-300 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-100', icon: CheckCircle },
  maintenance: { className: 'border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100', icon: Wrench },
};

function getDismissedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function dismissId(id: string) {
  const ids = getDismissedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}

export function AnnouncementBanner() {
  const t = useTranslations('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getActiveAnnouncements().then((data) => {
      const dismissed = getDismissedIds();
      setAnnouncements(data.filter((a: Announcement) => !dismissed.includes(a.id)));
    });
  }, []);

  function handleDismiss(id: string) {
    dismissId(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  if (announcements.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {announcements.map((announcement) => {
        const config = typeConfig[announcement.type] || typeConfig.info;
        const Icon = config.icon;
        return (
          <Alert key={announcement.id} className={config.className}>
            <Icon className="h-4 w-4" />
            <AlertTitle>{announcement.title}</AlertTitle>
            <AlertDescription>{announcement.message}</AlertDescription>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDismiss(announcement.id)}
                aria-label={t('dismiss')}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </AlertAction>
          </Alert>
        );
      })}
    </div>
  );
}
