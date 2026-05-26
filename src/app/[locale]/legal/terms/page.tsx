import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FileText, UserCheck, AlertTriangle, CreditCard, BookOpen, Lock, RefreshCw, Mail } from 'lucide-react';

function SectionCard({ icon: Icon, title, children, gradient }: { icon: React.ElementType; title: string; children: React.ReactNode; gradient: string }) {
  return (
    <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const p = await getTranslations('legal.termsPage');
  const s2Items: string[] = p.raw('s2Items');

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('terms')}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {p('subtitle')} &middot; {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      <div className="space-y-6">
        <SectionCard icon={BookOpen} title={p('s1Title')} gradient="from-blue-500 to-blue-600">
          <p>{p('s1Text')}</p>
        </SectionCard>

        <SectionCard icon={UserCheck} title={p('s2Title')} gradient="from-purple-500 to-purple-600">
          <ul className="ml-4 list-disc space-y-2">
            {s2Items.map((item, i) => (<li key={i}>{item}</li>))}
          </ul>
        </SectionCard>

        <SectionCard icon={AlertTriangle} title={p('s3Title')} gradient="from-red-500 to-red-600">
          <p>{p('s3Text')}</p>
        </SectionCard>

        <SectionCard icon={CreditCard} title={p('s4Title')} gradient="from-emerald-500 to-emerald-600">
          <ul className="ml-4 list-disc space-y-2">
            <li><strong className="text-foreground">{p('s4Free')}</strong></li>
            <li><strong className="text-foreground">{p('s4Pro')}</strong></li>
            <li>{p('s4Cancel')}</li>
          </ul>
        </SectionCard>

        <SectionCard icon={BookOpen} title={p('s5Title')} gradient="from-orange-500 to-orange-600">
          <p>{p('s5Text')}</p>
        </SectionCard>

        <SectionCard icon={Lock} title={p('s6Title')} gradient="from-cyan-500 to-cyan-600">
          <p>{p('s6Text')}</p>
        </SectionCard>

        <SectionCard icon={RefreshCw} title={p('s7Title')} gradient="from-pink-500 to-pink-600">
          <p>{p('s7Text')}</p>
        </SectionCard>
      </div>
    </div>
  );
}
