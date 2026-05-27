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

type StaffRole = 'admin' | 'support';

const allNavItems: {
  href: string;
  icon: typeof LayoutDashboard;
  labelKey: string;
  roles: StaffRole[];
}[] = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'overview', roles: ['admin', 'support'] },
  { href: '/admin/users', icon: Users, labelKey: 'users', roles: ['admin', 'support'] },
  { href: '/admin/feedback', icon: MessageSquare, labelKey: 'feedback', roles: ['admin', 'support'] },
  { href: '/admin/templates', icon: FileStack, labelKey: 'templates', roles: ['admin'] },
  { href: '/admin/categories', icon: FolderTree, labelKey: 'categoriesNav', roles: ['admin'] },
  { href: '/admin/ai-settings', icon: Brain, labelKey: 'aiSettings', roles: ['admin'] },
  { href: '/admin/logs', icon: ScrollText, labelKey: 'logs', roles: ['admin'] },
  { href: '/admin/site-content', icon: FileEdit, labelKey: 'siteContent', roles: ['admin'] },
  { href: '/admin/subscriptions', icon: CreditCard, labelKey: 'subscriptions', roles: ['admin'] },
  { href: '/admin/plan-limits', icon: Gauge, labelKey: 'planLimits', roles: ['admin'] },
  { href: '/admin/announcements', icon: Megaphone, labelKey: 'announcements', roles: ['admin'] },
];

interface AdminSidebarProps {
  role?: StaffRole;
}

export function AdminSidebar({ role = 'admin' }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col">
      <div className="p-6">
        <h2 className="font-bold text-lg">{role === 'support' ? t('supportTitle') : t('title')}</h2>
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
