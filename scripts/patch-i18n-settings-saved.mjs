import fs from 'fs';
import path from 'path';

const dir = 'messages';
const locales = ['tr', 'en', 'de', 'az', 'ru', 'uk', 'ar'];

const settingsSaved = {
  tr: 'Ayarlar kaydedildi',
  en: 'Settings saved',
  de: 'Einstellungen gespeichert',
  az: 'Tənzimləmələr saxlanıldı',
  ru: 'Настройки сохранены',
  uk: 'Налаштування збережено',
  ar: 'تم حفظ الإعدادات',
};

for (const locale of locales) {
  const filePath = path.join(dir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.admin.settingsSaved = settingsSaved[locale];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Patched ${locale}.json`);
}
