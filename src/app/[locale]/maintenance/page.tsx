import { getTranslations } from 'next-intl/server';
import { Wrench } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function MaintenancePage() {
  const t = await getTranslations('maintenance');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <div className="max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Wrench className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
        <Link
          href="/auth/login"
          className={cn(buttonVariants({ variant: 'outline', size: 'default' }))}
        >
          {t('adminLogin')}
        </Link>
      </div>
    </div>
  );
}
