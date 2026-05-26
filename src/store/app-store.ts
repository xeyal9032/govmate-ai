'use client';

import { create } from 'zustand';
import type { Profile, Subscription } from '@/types/database';

interface AppState {
  user: Profile | null;
  subscription: Subscription | null;
  sidebarOpen: boolean;
  setUser: (user: Profile | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  subscription: null,
  sidebarOpen: false,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
