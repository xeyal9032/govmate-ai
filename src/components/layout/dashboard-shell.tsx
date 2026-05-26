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
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <MobileNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnnouncementBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
