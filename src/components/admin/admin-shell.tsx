'use client';

import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { AdminSidebar } from './admin-sidebar';
import { AdminMobileNav } from './admin-mobile-nav';
import { AdminAccessGuard } from './admin-access-guard';

type StaffRole = 'admin' | 'support';

interface AdminShellProps {
  children: React.ReactNode;
  role: StaffRole;
}

export function AdminShell({ children, role }: AdminShellProps) {
  const t = useTranslations('admin');
  const { toggleSidebar } = useAppStore();

  return (
    <AdminAccessGuard role={role}>
      <div className="flex min-h-[100dvh] flex-col lg:flex-row lg:overflow-hidden">
        <AdminSidebar role={role} />
        <AdminMobileNav role={role} />
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target shrink-0"
              onClick={toggleSidebar}
              aria-label="Menü"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="truncate font-semibold">
              {role === 'support' ? t('supportTitle') : t('title')}
            </span>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminAccessGuard>
  );
}
