'use client';

import { useEffect } from 'react';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { MobileNav } from './mobile-nav';
import { useAppStore } from '@/store/app-store';
import type { Profile, Subscription } from '@/types/database';
import { AnnouncementBanner } from '@/components/dashboard/announcement-banner';

interface DashboardShellProps {
  children: React.ReactNode;
  profile: Profile | null;
  subscription: Subscription | null;
}

export function DashboardShell({ children, profile, subscription }: DashboardShellProps) {
  const { setUser, setSubscription } = useAppStore();

  useEffect(() => {
    setUser(profile);
    setSubscription(subscription);
  }, [profile, subscription, setUser, setSubscription]);

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden lg:flex-row">
      <AppSidebar />
      <MobileNav />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 lg:p-6">
          <AnnouncementBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
