'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { FeedbackDialog } from '@/components/dashboard/feedback-dialog';
import { useAppStore } from '@/store/app-store';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';

export function AppHeader() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { user, toggleSidebar } = useAppStore();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 min-w-0 items-center gap-1.5 px-3 sm:gap-2 sm:px-4 lg:gap-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="touch-target shrink-0 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Menü"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1" />

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <FeedbackDialog />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="touch-target relative flex h-9 w-9 items-center justify-center rounded-full cursor-pointer sm:h-8 sm:w-8">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.full_name || tCommon('user')}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/settings">{t('settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/billing">{t('billing')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/">{tCommon('homePage')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
