import fs from 'fs';
import path from 'path';

const dir = 'messages';
const locales = ['tr', 'en', 'de', 'az', 'ru', 'uk', 'ar'];

const scrollToTop = {
  tr: 'Yukarı çık',
  en: 'Scroll to top',
  de: 'Nach oben',
  az: 'Yuxarı qalx',
  ru: 'Наверх',
  uk: 'Вгору',
  ar: 'العودة للأعلى',
};

for (const locale of locales) {
  const filePath = path.join(dir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.common.scrollToTop = scrollToTop[locale];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Patched ${locale}.json`);
}
