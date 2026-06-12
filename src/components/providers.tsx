'use client';

import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollToTopButton } from '@/components/layout/scroll-to-top-button';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <ScrollToTopButton />
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}
