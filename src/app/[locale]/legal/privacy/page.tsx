import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Shield, Database, Brain, Scale, Mail } from 'lucide-react';

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

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const p = await getTranslations('legal.privacyPage');
  const items: string[] = (await getTranslations('legal.privacyPage')).raw('s3Items');

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('privacy')}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {p('subtitle')} &middot; {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
        </p>
      </div>

      <div className="space-y-6">
        <SectionCard icon={Shield} title={p('s1Title')} gradient="from-blue-500 to-blue-600">
          <p>{p('s1Text')}</p>
        </SectionCard>

        <SectionCard icon={Database} title={p('s2Title')} gradient="from-purple-500 to-purple-600">
          <ul className="ml-4 list-disc space-y-2">
            <li><strong className="text-foreground">{p('s2Account')}</strong></li>
            <li><strong className="text-foreground">{p('s2Documents')}</strong></li>
            <li><strong className="text-foreground">{p('s2Usage')}</strong></li>
            <li><strong className="text-foreground">{p('s2Technical')}</strong></li>
          </ul>
        </SectionCard>

        <SectionCard icon={Database} title={p('s3Title')} gradient="from-emerald-500 to-emerald-600">
          <ul className="ml-4 list-disc space-y-2">
            {items.map((item, i) => (<li key={i}>{item}</li>))}
          </ul>
        </SectionCard>

        <SectionCard icon={Database} title={p('s4Title')} gradient="from-orange-500 to-orange-600">
          <p>{p('s4Text')}</p>
        </SectionCard>

        <SectionCard icon={Brain} title={p('s5Title')} gradient="from-pink-500 to-pink-600">
          <p>{p('s5Text')}</p>
        </SectionCard>

        <SectionCard icon={Scale} title={p('s6Title')} gradient="from-cyan-500 to-cyan-600">
          <ul className="ml-4 list-disc space-y-2">
            <li><strong className="text-foreground">{p('s6Access')}</strong></li>
            <li><strong className="text-foreground">{p('s6Correct')}</strong></li>
            <li><strong className="text-foreground">{p('s6Delete')}</strong></li>
            <li><strong className="text-foreground">{p('s6Export')}</strong></li>
            <li><strong className="text-foreground">{p('s6Object')}</strong></li>
          </ul>
        </SectionCard>

        <SectionCard icon={Mail} title={p('s7Title')} gradient="from-indigo-500 to-indigo-600">
          <p>{p('s7Text')} <a href={`mailto:${t('contactEmail')}`} className="font-medium text-primary hover:underline">{t('contactEmail')}</a></p>
        </SectionCard>
      </div>
    </div>
  );
}
