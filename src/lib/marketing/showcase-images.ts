/** Landing vitrininde kullanılan pazarlama görselleri (locale alt klasörü). */
export const MARKETING_DEFAULT_LOCALE = 'tr';

export const SHOWCASE_IMAGE_FILES = {
  dashboard: 'dashboard.png',
  upload: 'upload.png',
  analysis: 'landing-how-it-works.png',
  templates: 'templates.png',
  pricing: 'landing-pricing.png',
} as const;

export type ShowcaseTabKey = keyof typeof SHOWCASE_IMAGE_FILES;

export const SHOWCASE_TAB_KEYS = Object.keys(
  SHOWCASE_IMAGE_FILES
) as ShowcaseTabKey[];

export function getShowcaseImagePath(locale: string, tab: ShowcaseTabKey): string {
  return `/marketing/${locale}/${SHOWCASE_IMAGE_FILES[tab]}`;
}
