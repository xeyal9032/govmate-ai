import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AlertTriangle, Scale, Clock, FileText, Users, Mail } from 'lucide-react';

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

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const p = await getTranslations('legal.disclaimerPage');
  const s5Items: string[] = p.raw('s5Items');

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('legalNotice')}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {p('subtitle')} &middot; {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      {/* Ana uyarı kutusu */}
      <div className="mb-8 rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 text-center shadow-sm">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="text-base font-semibold text-foreground">{p('mainWarning')}</p>
        <p className="mt-2 text-sm text-muted-foreground">{p('mainWarningDetail')}</p>
      </div>

      <div className="space-y-6">
        <SectionCard icon={Scale} title={p('s1Title')} gradient="from-red-500 to-red-600">
          <p>{p('s1Text')}</p>
        </SectionCard>

        <SectionCard icon={AlertTriangle} title={p('s2Title')} gradient="from-orange-500 to-orange-600">
          <p>{p('s2Text')}</p>
        </SectionCard>

        <SectionCard icon={Clock} title={p('s3Title')} gradient="from-amber-500 to-amber-600">
          <p>{p('s3Text')}</p>
        </SectionCard>

        <SectionCard icon={FileText} title={p('s4Title')} gradient="from-blue-500 to-blue-600">
          <p>{p('s4Text')}</p>
        </SectionCard>

        <SectionCard icon={Users} title={p('s5Title')} gradient="from-emerald-500 to-emerald-600">
          <ul className="ml-4 list-disc space-y-2">
            {s5Items.map((item, i) => (<li key={i}>{item}</li>))}
          </ul>
        </SectionCard>

        <SectionCard icon={Mail} title={p('s6Title')} gradient="from-indigo-500 to-indigo-600">
          <p>{p('s6Text')} <a href={`mailto:${t('contactEmail')}`} className="font-medium text-primary hover:underline">{t('contactEmail')}</a></p>
        </SectionCard>
      </div>
    </div>
  );
}
