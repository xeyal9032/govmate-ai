/** Landing ürün turu slaytları — İngilizce arayüz ekran görüntüleri */
export const DEMO_VIDEO_LOCALE = 'en';

export const DEMO_VIDEO_SLIDES = [
  { file: 'upload.png', labelKey: 'upload' },
  { file: 'dashboard.png', labelKey: 'dashboard' },
  { file: 'templates.png', labelKey: 'templates' },
  { file: 'landing-how-it-works.png', labelKey: 'analysis' },
  { file: 'landing-pricing.png', labelKey: 'pricing' },
] as const;

export type DemoVideoSlideKey = (typeof DEMO_VIDEO_SLIDES)[number]['labelKey'];

export function getDemoVideoSlidePath(file: string): string {
  return `/marketing/${DEMO_VIDEO_LOCALE}/${file}`;
}
