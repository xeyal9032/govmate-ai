'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { isSupportAllowedAdminPath, toAdminPath } from '@/lib/admin/access';

type StaffRole = 'admin' | 'support';

interface Props {
  role: StaffRole;
  children: React.ReactNode;
}

/** Destek rolünün yalnızca izinli admin yollarına erişmesini sağlar. */
export function AdminAccessGuard({ role, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'support') return;
    const adminPath = toAdminPath(pathname, routing.locales);
    if (!adminPath || !isSupportAllowedAdminPath(adminPath)) {
      router.replace('/admin');
    }
  }, [role, pathname, router]);

  return <>{children}</>;
}
