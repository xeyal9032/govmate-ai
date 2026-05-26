'use client';

import { localeNames, localeFlagUrls, locales } from '@/lib/utils/language';
import { useLanguage } from '@/hooks/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, changeLocale, isPending } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground disabled:opacity-50" disabled={isPending}>
        <img
          src={localeFlagUrls[locale]}
          alt={localeNames[locale]}
          width={20}
          height={14}
          className="rounded-[2px]"
          style={{ aspectRatio: '3/2', objectFit: 'cover' }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => changeLocale(loc)}
            className={`gap-2.5 ${loc === locale ? 'bg-accent' : ''}`}
          >
            <img
              src={localeFlagUrls[loc]}
              alt={localeNames[loc]}
              width={20}
              height={14}
              className="rounded-[2px]"
              style={{ aspectRatio: '3/2', objectFit: 'cover' }}
            />
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
