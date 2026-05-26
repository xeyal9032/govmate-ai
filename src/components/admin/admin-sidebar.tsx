'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileStack,
  FolderTree,
  Brain,
  ScrollText,
  CreditCard,
  Gauge,
  MessageSquare,
  FileEdit,
  ArrowLeft,
  Megaphone,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'overview' },
  { href: '/admin/users', icon: Users, labelKey: 'users' },
  { href: '/admin/templates', icon: FileStack, labelKey: 'templates' },
  { href: '/admin/categories', icon: FolderTree, labelKey: 'categoriesNav' },
  { href: '/admin/ai-settings', icon: Brain, labelKey: 'aiSettings' },
  { href: '/admin/logs', icon: ScrollText, labelKey: 'logs' },
  { href: '/admin/feedback', icon: MessageSquare, labelKey: 'feedback' },
  { href: '/admin/site-content', icon: FileEdit, labelKey: 'siteContent' },
  { href: '/admin/subscriptions', icon: CreditCard, labelKey: 'subscriptions' },
  { href: '/admin/plan-limits', icon: Gauge, labelKey: 'planLimits' },
  { href: '/admin/announcements', icon: Megaphone, labelKey: 'announcements' },
];

export function AdminSidebar() {
  const t = useTranslations('admin');
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col">
      <div className="p-6">
        <h2 className="font-bold text-lg">{t('title')}</h2>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start gap-3')}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t('backToDashboard')}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
