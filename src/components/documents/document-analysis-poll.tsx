'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

interface DocumentAnalysisPollProps {
  /** Yenileme aralığı (ms) */
  intervalMs?: number;
}

/** Belge analiz durumu tamamlanana kadar sayfayı periyodik yeniler */
export function DocumentAnalysisPoll({ intervalMs = 3000 }: DocumentAnalysisPollProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [router, intervalMs]);

  return null;
}
