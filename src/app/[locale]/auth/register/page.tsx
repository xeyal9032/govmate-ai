'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

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

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const tErrors = useTranslations('auth.errors');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = useRegisterSchema();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
          <Logo size="lg" />
          <span className="text-lg font-bold">GovMate AI</span>
        </Link>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('fullName')}</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={termsChecked}
              onCheckedChange={(checked) =>
                setValue('terms', checked === true, { shouldValidate: true })
              }
              id="terms"
            />
            <label
              htmlFor="terms"
              className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
            >
              {t('termsAgree')}
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('submit')}
          </Button>

          <OAuthButtons />
        </CardContent>
      </form>

      <CardFooter className="justify-center">
        <CardDescription>
          {t('hasAccount')}{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            {t('login')}
          </Link>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
