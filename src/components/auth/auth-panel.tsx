'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import styles from '@/components/auth/auth-panel.module.css';

type AuthMode = 'login' | 'register';

interface AuthPanelProps {
  initialMode?: AuthMode;
}

function useRegisterSchema() {
  const tErrors = useTranslations('auth.errors');
  return z
    .object({
      fullName: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8, tErrors('weakPassword')),
      confirmPassword: z.string(),
      terms: z.boolean().refine((v) => v === true),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tErrors('passwordMismatch'),
      path: ['confirmPassword'],
    });
}

type RegisterFormValues = z.infer<ReturnType<typeof useRegisterSchema>>;

export function AuthPanel({ initialMode = 'login' }: AuthPanelProps) {
  const tLogin = useTranslations('auth.login');
  const tRegister = useTranslations('auth.register');
  const tPanel = useTranslations('auth.panel');
  const tErrors = useTranslations('auth.errors');
  const locale = useLocale();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const schema = useRegisterSchema();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const termsChecked = watch('terms');
  const isRegister = mode === 'register';

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'auth_callback_failed') {
      toast.error(tErrors('oauthFailed'));
      window.history.replaceState(null, '', window.location.pathname);
    }
    const hash = window.location.hash;
    if (hash.includes('error=')) {
      toast.error(tErrors('oauthConfigError'));
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [tErrors]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        toast.error(tErrors('invalidCredentials'));
        return;
      }
      router.push('/dashboard');
    } catch {
      toast.error(tErrors('invalidCredentials'));
    } finally {
      setLoginLoading(false);
    }
  }

  async function onRegister(data: RegisterFormValues) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName } },
      });
      if (error) {
        if (error.message.includes('already')) {
          toast.error(tErrors('emailInUse'));
        } else {
          toast.error(error.message);
        }
        return;
      }
      router.push('/dashboard');
    } catch {
      toast.error(tErrors('emailInUse'));
    }
  }

  async function signInWithGoogle() {
    setOauthLoading(true);
    try {
      const supabase = createClient();
      const next = encodeURIComponent(`/${locale}/dashboard`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${next}`,
        },
      });
      if (error) toast.error(tErrors('oauthFailed'));
    } catch {
      toast.error(tErrors('oauthFailed'));
    } finally {
      setOauthLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary';

  const formShell =
    'flex h-full w-full flex-col items-center justify-center px-4 py-6 text-center sm:px-10 sm:py-8';

  return (
    <div
      className={cn(
        styles.container,
        isRegister && styles.rightPanelActive,
        'mx-auto w-full max-w-full',
      )}
    >
      {/* Kayıt formu */}
      <div
        className={cn(
          styles.formContainer,
          styles.signUpContainer,
          !isRegister && 'max-md:hidden',
          isRegister && 'max-md:block',
        )}
      >
        <form
          onSubmit={handleSubmit(onRegister)}
          className={cn(formShell, 'bg-card')}
        >
          <Link href="/" className="mb-4 hidden items-center gap-2 md:flex">
            <Logo size="sm" />
            <span className="text-base font-bold">GovMate AI</span>
          </Link>
          <h1 className="text-xl font-bold">{tRegister('title')}</h1>

          <GoogleSocialButton
            loading={oauthLoading}
            onClick={signInWithGoogle}
            label={tLogin('google')}
          />

          <span className="my-3 text-xs text-muted-foreground">{tPanel('orUseEmail')}</span>

          <input
            className={inputClass}
            placeholder={tRegister('fullName')}
            autoComplete="name"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1 w-full text-left text-xs text-destructive">{errors.fullName.message}</p>
          )}

          <input
            className={cn(inputClass, 'mt-2')}
            type="email"
            placeholder={tRegister('email')}
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 w-full text-left text-xs text-destructive">{errors.email.message}</p>
          )}

          <input
            className={cn(inputClass, 'mt-2')}
            type="password"
            placeholder={tRegister('password')}
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 w-full text-left text-xs text-destructive">{errors.password.message}</p>
          )}

          <input
            className={cn(inputClass, 'mt-2')}
            type="password"
            placeholder={tRegister('confirmPassword')}
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 w-full text-left text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}

          <div className="mt-3 flex w-full items-start gap-2 text-left">
            <Checkbox
              checked={termsChecked}
              onCheckedChange={(checked) =>
                setValue('terms', checked === true, { shouldValidate: true })
              }
              id="terms"
            />
            <label htmlFor="terms" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
              {tRegister('termsAgree')}
            </label>
          </div>

          <button type="submit" className={cn(styles.primaryAuthButton, 'mt-4')} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
            {tRegister('submit')}
          </button>

          <p className="mt-4 text-sm text-muted-foreground md:hidden">
            {tRegister('hasAccount')}{' '}
            <button type="button" className="font-medium text-primary" onClick={() => setMode('login')}>
              {tRegister('login')}
            </button>
          </p>
        </form>
      </div>

      {/* Giriş formu */}
      <div
        className={cn(
          styles.formContainer,
          styles.signInContainer,
          isRegister && 'max-md:hidden',
          !isRegister && 'max-md:block',
        )}
      >
        <form onSubmit={handleLogin} className={cn(formShell, 'bg-card')}>
          <Link href="/" className="mb-4 hidden items-center gap-2 md:flex">
            <Logo size="sm" />
            <span className="text-base font-bold">GovMate AI</span>
          </Link>
          <h1 className="text-xl font-bold">{tLogin('title')}</h1>

          <GoogleSocialButton
            loading={oauthLoading}
            onClick={signInWithGoogle}
            label={tLogin('google')}
          />

          <span className="my-3 text-xs text-muted-foreground">{tPanel('orUseEmail')}</span>

          <input
            id="email"
            name="email"
            className={inputClass}
            type="email"
            placeholder={tLogin('email')}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            id="password"
            name="password"
            className={cn(inputClass, 'mt-2')}
            type="password"
            placeholder={tLogin('password')}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Link
            href="/auth/forgot-password"
            className="mt-3 text-xs text-primary hover:underline"
          >
            {tLogin('forgotPassword')}
          </Link>

          <button type="submit" className={cn(styles.primaryAuthButton, 'mt-4')} disabled={loginLoading}>
            {loginLoading && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
            {tLogin('submit')}
          </button>

          <p className="mt-4 text-sm text-muted-foreground md:hidden">
            {tLogin('noAccount')}{' '}
            <button type="button" className="font-medium text-primary" onClick={() => setMode('register')}>
              {tLogin('register')}
            </button>
          </p>
        </form>
      </div>

      {/* Masaüstü kaydırma paneli */}
      <div className={cn(styles.overlayContainer, 'hidden md:block')}>
        <div className={styles.overlay}>
          <div className={cn(styles.overlayPanel, styles.overlayLeft)}>
            <h2 className="text-2xl font-bold text-white">{tPanel('welcomeBack')}</h2>
            <p className="my-5 max-w-xs text-sm leading-relaxed text-white/90">{tPanel('signInHint')}</p>
            <button type="button" className={styles.ghostButton} onClick={() => setMode('login')}>
              {tPanel('signInCta')}
            </button>
          </div>
          <div className={cn(styles.overlayPanel, styles.overlayRight)}>
            <h2 className="text-2xl font-bold text-white">{tPanel('heyThere')}</h2>
            <p className="my-5 max-w-xs text-sm leading-relaxed text-white/90">{tPanel('signUpHint')}</p>
            <button type="button" className={styles.ghostButton} onClick={() => setMode('register')}>
              {tPanel('signUpCta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleSocialButton({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:border-primary hover:bg-primary/5 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
      </button>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
