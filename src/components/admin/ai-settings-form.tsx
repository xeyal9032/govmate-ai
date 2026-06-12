'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateAppSetting } from '@/actions/admin';
import {
  AI_MODEL_OPTIONS,
  DEFAULT_AI_MODEL,
  DEFAULT_TRANSLATION_MODEL,
} from '@/lib/ai/model-options';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, Cpu, FileWarning, Save, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'sonner';

const defaultPrompt = `You are an AI assistant helping immigrants in Germany understand official letters. You are NOT a lawyer and must never provide legal advice.`;

const defaultDisclaimer = `Bu uygulama yapay zeka destekli bir bilgi aracıdır ve profesyonel hukuki danışmanlık yerine geçmez.`;

interface Props {
  initialSettings: Record<string, string>;
}

export function AISettingsForm({ initialSettings }: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();
  const [prompt, setPrompt] = useState(initialSettings.ai_system_prompt || defaultPrompt);
  const [disclaimer, setDisclaimer] = useState(initialSettings.ai_disclaimer || defaultDisclaimer);
  const [analysisModel, setAnalysisModel] = useState(
    initialSettings.ai_model || DEFAULT_AI_MODEL
  );
  const [translationModel, setTranslationModel] = useState(
    initialSettings.ai_translation_model || DEFAULT_TRANSLATION_MODEL
  );
  const [maintenance, setMaintenance] = useState(initialSettings.maintenance_mode === 'true');
  const [featureTranslation, setFeatureTranslation] = useState(
    initialSettings.feature_translation !== 'false'
  );
  const [featurePdf, setFeaturePdf] = useState(initialSettings.feature_pdf_export !== 'false');
  const [featureReminders, setFeatureReminders] = useState(
    initialSettings.feature_reminders !== 'false'
  );

  const handleSave = () => {
    startTransition(async () => {
      try {
        await Promise.all([
          updateAppSetting('ai_system_prompt', prompt),
          updateAppSetting('ai_disclaimer', disclaimer),
          updateAppSetting('ai_model', analysisModel),
          updateAppSetting('ai_translation_model', translationModel),
          updateAppSetting('maintenance_mode', String(maintenance)),
          updateAppSetting('feature_translation', String(featureTranslation)),
          updateAppSetting('feature_pdf_export', String(featurePdf)),
          updateAppSetting('feature_reminders', String(featureReminders)),
        ]);
        toast.success(t('settingsSaved'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleReset = () => {
    setPrompt(defaultPrompt);
    setDisclaimer(defaultDisclaimer);
    setAnalysisModel(DEFAULT_AI_MODEL);
    setTranslationModel(DEFAULT_TRANSLATION_MODEL);
    setMaintenance(false);
    setFeatureTranslation(true);
    setFeaturePdf(true);
    setFeatureReminders(true);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="size-5 text-primary" />
            <CardTitle>{t('aiModelTitle')}</CardTitle>
          </div>
          <CardDescription>{t('aiModelDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="analysis-model">{t('aiModelLabel')}</Label>
            <Select value={analysisModel} onValueChange={(v) => v && setAnalysisModel(v)}>
              <SelectTrigger id="analysis-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="translation-model">{t('aiTranslationModelLabel')}</Label>
            <Select value={translationModel} onValueChange={(v) => v && setTranslationModel(v)}>
              <SelectTrigger id="translation-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            <CardTitle>{t('systemPrompt')}</CardTitle>
          </div>
          <CardDescription>{t('systemPromptDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="system-prompt">{t('promptText')}</Label>
          <Textarea
            id="system-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">{t('promptHint')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileWarning className="size-5 text-amber-500" />
            <CardTitle>{t('disclaimerTitle')}</CardTitle>
          </div>
          <CardDescription>{t('disclaimerDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="disclaimer">{t('disclaimerLabel')}</Label>
          <Textarea
            id="disclaimer"
            value={disclaimer}
            onChange={(e) => setDisclaimer(e.target.value)}
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <CardTitle>{t('featureFlagsTitle')}</CardTitle>
          </div>
          <CardDescription>{t('featureFlagsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('maintenanceMode')}</Label>
              <p className="text-xs text-muted-foreground">{t('maintenanceModeDesc')}</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>{t('translationFeature')}</Label>
            <Switch checked={featureTranslation} onCheckedChange={setFeatureTranslation} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('pdfExportFeature')}</Label>
            <Switch checked={featurePdf} onCheckedChange={setFeaturePdf} />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t('remindersFeature')}</Label>
            <Switch checked={featureReminders} onCheckedChange={setFeatureReminders} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="size-4" data-icon="inline-start" />
          {t('resetDefaults')}
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="size-4" data-icon="inline-start" />
          {isPending ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </div>
  );
}
