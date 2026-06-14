/**
 * @vitest-environment happy-dom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DocumentStatusBadge } from './document-status-badge';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const labels: Record<string, string> = {
      uploaded: 'Yüklendi',
      analyzing: 'Analiz ediliyor',
      completed: 'Tamamlandı',
      failed: 'Başarısız',
    };
    return labels[key] ?? key;
  },
}));

describe('DocumentStatusBadge', () => {
  it('completed durumunu gösterir', () => {
    render(<DocumentStatusBadge status="completed" />);
    expect(screen.getByText('Tamamlandı')).toBeTruthy();
  });

  it('analyzing durumunu gösterir', () => {
    render(<DocumentStatusBadge status="analyzing" />);
    expect(screen.getByText('Analiz ediliyor')).toBeTruthy();
  });
});
