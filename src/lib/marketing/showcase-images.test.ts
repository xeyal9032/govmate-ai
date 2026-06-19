import { describe, expect, it } from 'vitest';
import {
  DEMO_VIDEO_LOCALE,
  DEMO_VIDEO_SLIDES,
  getDemoVideoSlidePath,
} from '@/lib/marketing/showcase-images';

describe('showcase-images', () => {
  it('demo slaytları İngilizce marketing klasöründen gelir', () => {
    expect(DEMO_VIDEO_LOCALE).toBe('en');
    expect(DEMO_VIDEO_SLIDES.length).toBeGreaterThan(0);

    for (const slide of DEMO_VIDEO_SLIDES) {
      expect(getDemoVideoSlidePath(slide.file)).toBe(`/marketing/en/${slide.file}`);
    }
  });
});
