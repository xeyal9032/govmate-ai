import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <div className="min-h-screen bg-background">
      {/* Üst header */}
      <div className="border-b bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('homePage')}
            </Button>
          </Link>
        </div>
      </div>

      {/* İçerik */}
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {children}
      </div>

      {/* Alt footer */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} GovMate AI
        </div>
      </div>
    </div>
  );
}
