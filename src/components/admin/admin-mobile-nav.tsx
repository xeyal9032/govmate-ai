'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppStore } from '@/store/app-store';
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

interface AdminMobileNavProps {
  role: StaffRole;
}

export function AdminMobileNav({ role }: AdminMobileNavProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="flex h-full w-[min(100vw-2rem,18rem)] flex-col gap-0 p-0">
        <SheetHeader className="shrink-0 border-b p-4 pb-3">
          <SheetTitle className="text-left text-base">
            {role === 'support' ? t('supportTitle') : t('title')}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1 px-3 py-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('h-11 w-full justify-start gap-3')}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="shrink-0 border-t p-3">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Button variant="ghost" className="h-11 w-full justify-start gap-3 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
