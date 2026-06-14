/**
 * @vitest-environment happy-dom
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ScrollToTopButton } from './scroll-to-top-button';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => (key === 'scrollToTop' ? 'Yukarı çık' : key),
}));

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    document.documentElement.scrollTop = 0;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('scroll eşiği aşılmadan gizli kalır', () => {
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button', { name: 'Yukarı çık' });
    expect(button.className).toContain('opacity-0');
  });

  it('tıklanınca yukarı kaydırır', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<ScrollToTopButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Yukarı çık' }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
