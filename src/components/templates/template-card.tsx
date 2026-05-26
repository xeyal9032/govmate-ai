'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const titleToI18nKey: Record<string, string> = {
  'Unterlagen nachreichen': 'unterlagenNachreichen',
  'Fristverlängerung beantragen': 'fristverlaengerungBeantragen',
  'Termin verschieben': 'terminVerschieben',
  'Veränderungsmitteilung': 'veraenderungsmitteilung',
  'Nachfrage zum Bescheid': 'nachfrageZumBescheid',
  'Termin anfragen': 'terminAnfragen',
  'Aufenthaltstitel Abholung nachfragen': 'aufenthaltstitelAbholung',
  'Fristverlängerung bitten': 'fristverlaengerungBitten',
  'Dokumente nachreichen': 'dokumenteNachreichen',
  'Mitgliedsbescheinigung anfordern': 'mitgliedsbescheinigung',
  'Rechnung/Beitrag klären': 'rechnungBeitragKlaeren',
  'Adresse ändern': 'adresseAendern',
  'Steuernummer anfragen': 'steuernummerAnfragen',
  'Fristverlängerung Steuererklärung': 'fristverlaengerungSteuer',
  'Nachweise einreichen': 'nachweiseEinreichen',
  'Mietbescheinigung anfordern': 'mietbescheinigung',
  'Reparatur melden': 'reparaturMelden',
  'Kündigungsbestätigung anfragen': 'kuendigungsbestaetigung',
  'Empfangsbestätigung bitten': 'empfangsbestaetigung',
  'Sachstandsanfrage': 'sachstandsanfrage',
  'Widerspruch einlegen': 'widerspruchEinlegen',
  'Schadensmeldung': 'schadensmeldung',
  'Kündigung der Versicherung': 'versicherungKuendigung',
  'Vertragsänderung mitteilen': 'vertragsaenderung',
  'Krankmeldung für das Kind': 'krankmeldungKind',
  'Beurlaubung beantragen': 'beurlaubung',
  'Schulanmeldung': 'schulanmeldung',
  'Kindergeld-Antrag begleiten': 'kindergeldAntrag',
  'Terminanfrage': 'terminanfrage',
  'Ummeldung mitteilen': 'ummeldung',
  'Abmeldung bei Wegzug ins Ausland': 'abmeldungAusland',
  'Kontoklärung anfragen': 'kontoklaerung',
  'Versicherungsverlauf anfordern': 'versicherungsverlauf',
  'Allgemeiner Widerspruch': 'allgemeinerWiderspruch',
  'Vollmacht erteilen': 'vollmacht',
};

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    category: string;
    description?: string;
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  const t = useTranslations('templates');

  function getDescription(): string {
    const i18nKey = titleToI18nKey[template.title];
    if (i18nKey) {
      try {
        return t(`descriptions.${i18nKey}` as any);
      } catch {
        return template.description || '';
      }
    }
    return template.description || '';
  }

  const description = getDescription();

  return (
    <Card className="flex flex-col hover:ring-2 hover:ring-primary/20 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{template.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {t(`categories.${template.category}` as any)}
          </Badge>
        </div>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <Link href={`/dashboard/templates/${template.id}`}>
          <Button className="w-full" variant="outline">
            <FileText className="size-4" />
            {t('fillTemplate')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
