'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Mail,
  Clock,
  FileStack,
  CreditCard,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app-store';
import { Logo } from '@/components/ui/logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/dashboard/documents', icon: FileText, labelKey: 'documents' },
  { href: '/dashboard/upload', icon: Upload, labelKey: 'upload' },
  { href: '/dashboard/letters', icon: Mail, labelKey: 'letters' },
  { href: '/dashboard/deadlines', icon: Clock, labelKey: 'deadlines' },
  { href: '/dashboard/templates', icon: FileStack, labelKey: 'templates' },
  { href: '/dashboard/billing', icon: CreditCard, labelKey: 'billing' },
  { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
];

export function AppSidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user } = useAppStore();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-sidebar">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
          <span className="font-bold text-lg">GovMate AI</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start gap-3', isActive && 'bg-sidebar-accent')}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Button>
              </Link>
            );
          })}
        </nav>

        {user?.role === 'admin' && (
          <>
            <Separator className="my-4" />
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Shield className="h-4 w-4" />
                {t('admin')}
              </Button>
            </Link>
          </>
        )}
      </ScrollArea>

      <div className="p-3 border-t">
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" type="submit">
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </Button>
        </form>
      </div>
    </aside>
  );
}
