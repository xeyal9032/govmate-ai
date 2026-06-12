#!/usr/bin/env node
/** Admin AI model i18n anahtarlarını tüm locale dosyalarına ekler */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.join(__dirname, '..', 'messages');

const patches = {
  de: {
    aiModelTitle: 'KI-Modellauswahl',
    aiModelDesc: 'OpenAI-Modelle für Dokumentanalyse, Briefgenerierung und Übersetzung.',
    aiModelLabel: 'Analyse- und Briefmodell',
    aiTranslationModelLabel: 'Übersetzungsmodell',
    aiModelGpt4o: 'GPT-4o (Vision + hohe Qualität)',
    aiModelGpt4oMini: 'GPT-4o Mini (schnell, günstig)',
    aiModelGpt41: 'GPT-4.1 (erweitert)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (schnell)',
  },
  en: {
    aiModelTitle: 'AI Model Selection',
    aiModelDesc: 'OpenAI models for document analysis, letter generation, and translation.',
    aiModelLabel: 'Analysis and letter model',
    aiTranslationModelLabel: 'Translation model',
    aiModelGpt4o: 'GPT-4o (vision + high quality)',
    aiModelGpt4oMini: 'GPT-4o Mini (fast, lower cost)',
    aiModelGpt41: 'GPT-4.1 (advanced)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (fast)',
  },
  az: {
    aiModelTitle: 'AI Model Seçimi',
    aiModelDesc: 'Sənəd analizi, məktub yaradılması və tərcümə üçün OpenAI modelləri.',
    aiModelLabel: 'Analiz və məktub modeli',
    aiTranslationModelLabel: 'Tərcümə modeli',
    aiModelGpt4o: 'GPT-4o (vision + yüksək keyfiyyət)',
    aiModelGpt4oMini: 'GPT-4o Mini (sürətli, aşağı xərc)',
    aiModelGpt41: 'GPT-4.1 (təkmilləşdirilmiş)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (sürətli)',
  },
  ru: {
    aiModelTitle: 'Выбор модели ИИ',
    aiModelDesc: 'Модели OpenAI для анализа документов, генерации писем и перевода.',
    aiModelLabel: 'Модель анализа и писем',
    aiTranslationModelLabel: 'Модель перевода',
    aiModelGpt4o: 'GPT-4o (vision + высокое качество)',
    aiModelGpt4oMini: 'GPT-4o Mini (быстро, дешевле)',
    aiModelGpt41: 'GPT-4.1 (продвинутая)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (быстро)',
  },
  uk: {
    aiModelTitle: 'Вибір моделі ШІ',
    aiModelDesc: 'Моделі OpenAI для аналізу документів, генерації листів і перекладу.',
    aiModelLabel: 'Модель аналізу та листів',
    aiTranslationModelLabel: 'Модель перекладу',
    aiModelGpt4o: 'GPT-4o (vision + висока якість)',
    aiModelGpt4oMini: 'GPT-4o Mini (швидко, дешевше)',
    aiModelGpt41: 'GPT-4.1 (розширена)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (швидко)',
  },
  ar: {
    aiModelTitle: 'اختيار نموذج الذكاء الاصطناعي',
    aiModelDesc: 'نماذج OpenAI لتحليل المستندات وإنشاء الرسائل والترجمة.',
    aiModelLabel: 'نموذج التحليل والرسائل',
    aiTranslationModelLabel: 'نموذج الترجمة',
    aiModelGpt4o: 'GPT-4o (رؤية + جودة عالية)',
    aiModelGpt4oMini: 'GPT-4o Mini (سريع، تكلفة أقل)',
    aiModelGpt41: 'GPT-4.1 (متقدم)',
    aiModelGpt41Mini: 'GPT-4.1 Mini (سريع)',
  },
};

for (const [locale, keys] of Object.entries(patches)) {
  const file = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(data.admin, keys);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[${locale}] admin AI model keys eklendi`);
}

console.log('Tamamlandı.');
