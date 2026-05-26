import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
};

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
    >
      {/* Kalkan — merkez x=50 */}
      <path
        d="M50 2C28 2 4 15 4 15V62C4 88 30 112 50 120C70 112 96 88 96 62V15C96 15 72 2 50 2Z"
        fill="url(#shieldGrad)"
      />

      {/* Belge — merkez x=50 (x: 24–76, y: 18–98) */}
      <path
        d="M24 18H66L76 28V98H24V18Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M66 18V28H76"
        fill="none"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {/* Belge satırları — sola hizalı, merkez x=50 civarı */}
      <rect x="32" y="30" width="22" height="2.5" rx="1.25" fill="white" fillOpacity="0.7" />
      <rect x="32" y="37" width="30" height="2.5" rx="1.25" fill="white" fillOpacity="0.7" />
      <rect x="32" y="44" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.7" />

      {/* AI ağ merkezi — tam x=50 */}
      <circle cx="50" cy="72" r="5.5" fill="white" />

      {/* Dış düğümler — simetrik x=50 etrafında */}
      <circle cx="32" cy="62" r="3" fill="white" />
      <circle cx="68" cy="62" r="3" fill="white" />
      <circle cx="32" cy="85" r="3" fill="white" />
      <circle cx="68" cy="85" r="3" fill="white" />
      <circle cx="39" cy="55" r="2.5" fill="white" />
      <circle cx="61" cy="55" r="2.5" fill="white" />
      <circle cx="39" cy="91" r="2.5" fill="white" />
      <circle cx="61" cy="91" r="2.5" fill="white" />

      {/* Bağlantı çizgileri — merkez x=50 */}
      <line x1="50" y1="72" x2="32" y2="62" stroke="white" strokeWidth="1.8" />
      <line x1="50" y1="72" x2="68" y2="62" stroke="white" strokeWidth="1.8" />
      <line x1="50" y1="72" x2="32" y2="85" stroke="white" strokeWidth="1.8" />
      <line x1="50" y1="72" x2="68" y2="85" stroke="white" strokeWidth="1.8" />
      <line x1="50" y1="72" x2="39" y2="55" stroke="white" strokeWidth="1.4" />
      <line x1="50" y1="72" x2="61" y2="55" stroke="white" strokeWidth="1.4" />
      <line x1="50" y1="72" x2="39" y2="91" stroke="white" strokeWidth="1.4" />
      <line x1="50" y1="72" x2="61" y2="91" stroke="white" strokeWidth="1.4" />

      <defs>
        <linearGradient id="shieldGrad" x1="10" y1="2" x2="90" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
