'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileSearch, Mail, Clock, FileStack } from 'lucide-react';

const actions = [
  { href: '/dashboard/upload', icon: Upload, key: 'uploadDocument' },
  { href: '/dashboard/documents', icon: FileSearch, key: 'explainLetter' },
  { href: '/dashboard/letters', icon: Mail, key: 'generateReply' },
  { href: '/dashboard/deadlines', icon: Clock, key: 'addDeadline' },
  { href: '/dashboard/templates', icon: FileStack, key: 'useTemplate' },
];

export function QuickActions() {
  const t = useTranslations('dashboard.quickActions');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action) => (
            <Link key={action.key} href={action.href}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">{t(action.key)}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
