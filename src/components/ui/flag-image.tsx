'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FlagImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md';
}

const sizes = {
  sm: 'h-3.5 w-5',
  md: 'h-8 w-12',
} as const;

/** Next.js Image aspect-ratio uyarısını önlemek için sabit konteyner */
export function FlagImage({ src, alt, className, size = 'sm' }: FlagImageProps) {
  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-[2px]',
        sizes[size],
        className
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" unoptimized sizes={size === 'sm' ? '20px' : '48px'} />
    </span>
  );
}
