import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import path from 'path';

const fontsDir = path.join(process.cwd(), 'src/lib/pdf/fonts');

Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(fontsDir, 'Roboto-Regular.ttf'), fontWeight: 400 },
    { src: path.join(fontsDir, 'Roboto-Bold.ttf'), fontWeight: 700 },
  ],
});

const colors = {
  primary: '#1a56db',
  secondary: '#6b7280',
  accent: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
  border: '#e5e7eb',
  bg: '#f9fafb',
  white: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Roboto',
    lineHeight: 1.5,
    color: colors.text,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: `2px solid ${colors.primary}`,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Roboto',
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.muted,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 10,
    marginTop: 20,
    paddingBottom: 6,
    borderBottom: `1px solid ${colors.border}`,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  profileItem: {
    width: '50%',
    marginBottom: 8,
    paddingRight: 10,
  },
  label: {
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: colors.text,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: `1px solid ${colors.border}`,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.bg,
    borderBottom: `1px solid ${colors.border}`,
  },
  tableCell: {
    fontSize: 9,
    color: colors.text,
  },
  statusBadge: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusFailed: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  letterCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
  },
  letterSubject: {
    fontSize: 11,
    fontFamily: 'Roboto',
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  letterMeta: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 6,
  },
  letterBody: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.6,
  },
  deadlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    padding: 10,
    borderRadius: 4,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
  },
  urgencyCritical: {
    fontSize: 8,
    color: colors.danger,
    fontWeight: 700,
  },
  urgencyHigh: {
    fontSize: 8,
    color: colors.warning,
    fontWeight: 700,
  },
  urgencyMedium: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: 700,
  },
  urgencyLow: {
    fontSize: 8,
    color: colors.accent,
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: colors.muted,
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 8,
  },
  emptyText: {
    fontSize: 10,
    color: colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '30%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 9,
    color: colors.muted,
  },
});

interface ExportProfile {
  full_name?: string | null;
  email?: string | null;
  preferred_language?: string | null;
  role?: string | null;
  city?: string | null;
  country_of_origin?: string | null;
  created_at?: string | null;
}

interface ExportDocument {
  id: string;
  title?: string | null;
  original_file_name?: string | null;
  status?: string | null;
  document_type?: string | null;
  authority_name?: string | null;
  created_at?: string | null;
}

interface ExportLetter {
  id: string;
  letter_type?: string | null;
  subject?: string | null;
  german_body?: string | null;
  translated_explanation?: string | null;
  created_at?: string | null;
}

interface ExportDeadline {
  id: string;
  title?: string | null;
  description?: string | null;
  deadline_date?: string | null;
  urgency?: string | null;
  status?: string | null;
}

export interface UserExportData {
  profile: ExportProfile | null;
  documents: ExportDocument[];
  letters: ExportLetter[];
  deadlines: ExportDeadline[];
  exported_at: string;
}

const labels: Record<string, Record<string, string>> = {
  tr: {
    title: 'Kullanıcı Veri Raporu',
    subtitle: 'GovMate AI tarafından oluşturuldu',
    profile: 'Profil Bilgileri',
    documents: 'Belgeler',
    letters: 'Mektuplar',
    deadlines: 'Son Tarihler',
    name: 'Ad Soyad',
    email: 'E-posta',
    language: 'Tercih Edilen Dil',
    city: 'Şehir',
    country: 'Menşe Ülke',
    memberSince: 'Üyelik Tarihi',
    fileName: 'Dosya Adı',
    status: 'Durum',
    type: 'Tür',
    authority: 'Kurum',
    date: 'Tarih',
    subject: 'Konu',
    deadline: 'Son Tarih',
    urgency: 'Aciliyet',
    noDocuments: 'Henüz belge yok',
    noLetters: 'Henüz mektup yok',
    noDeadlines: 'Henüz son tarih yok',
    exportDate: 'Dışa aktarma tarihi',
    disclaimer: 'Bu rapor otomatik olarak oluşturulmuştur. Hukuki danışmanlık niteliği taşımaz.',
    summary: 'Özet',
    completed: 'Tamamlandı',
    failed: 'Başarısız',
    analyzing: 'Analiz Ediliyor',
    uploaded: 'Yüklendi',
    done: 'Tamamlandı',
    open: 'Açık',
    critical: 'Kritik',
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük',
    notSpecified: 'Belirtilmemiş',
  },
  de: {
    title: 'Benutzerdaten-Bericht',
    subtitle: 'Erstellt von GovMate AI',
    profile: 'Profilinformationen',
    documents: 'Dokumente',
    letters: 'Briefe',
    deadlines: 'Fristen',
    name: 'Vollständiger Name',
    email: 'E-Mail',
    language: 'Bevorzugte Sprache',
    city: 'Stadt',
    country: 'Herkunftsland',
    memberSince: 'Mitglied seit',
    fileName: 'Dateiname',
    status: 'Status',
    type: 'Typ',
    authority: 'Behörde',
    date: 'Datum',
    subject: 'Betreff',
    deadline: 'Frist',
    urgency: 'Dringlichkeit',
    noDocuments: 'Keine Dokumente',
    noLetters: 'Keine Briefe',
    noDeadlines: 'Keine Fristen',
    exportDate: 'Exportdatum',
    disclaimer: 'Dieser Bericht wurde automatisch erstellt. Er stellt keine Rechtsberatung dar.',
    summary: 'Zusammenfassung',
    completed: 'Abgeschlossen',
    failed: 'Fehlgeschlagen',
    analyzing: 'Wird analysiert',
    uploaded: 'Hochgeladen',
    done: 'Erledigt',
    open: 'Offen',
    critical: 'Kritisch',
    high: 'Hoch',
    medium: 'Mittel',
    low: 'Niedrig',
    notSpecified: 'Nicht angegeben',
  },
  en: {
    title: 'User Data Report',
    subtitle: 'Generated by GovMate AI',
    profile: 'Profile Information',
    documents: 'Documents',
    letters: 'Letters',
    deadlines: 'Deadlines',
    name: 'Full Name',
    email: 'Email',
    language: 'Preferred Language',
    city: 'City',
    country: 'Country of Origin',
    memberSince: 'Member Since',
    fileName: 'File Name',
    status: 'Status',
    type: 'Type',
    authority: 'Authority',
    date: 'Date',
    subject: 'Subject',
    deadline: 'Deadline',
    urgency: 'Urgency',
    noDocuments: 'No documents yet',
    noLetters: 'No letters yet',
    noDeadlines: 'No deadlines yet',
    exportDate: 'Export date',
    disclaimer: 'This report was automatically generated. It does not constitute legal advice.',
    summary: 'Summary',
    completed: 'Completed',
    failed: 'Failed',
    analyzing: 'Analyzing',
    uploaded: 'Uploaded',
    done: 'Done',
    open: 'Open',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    notSpecified: 'Not specified',
  },
};

function getLabels(lang?: string | null) {
  return labels[lang || 'en'] || labels.en;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getStatusStyle(status?: string | null) {
  switch (status) {
    case 'completed':
    case 'done':
      return { ...styles.statusBadge, ...styles.statusCompleted };
    case 'failed':
      return { ...styles.statusBadge, ...styles.statusFailed };
    default:
      return { ...styles.statusBadge, ...styles.statusPending };
  }
}

function getUrgencyStyle(urgency?: string | null) {
  switch (urgency) {
    case 'critical': return styles.urgencyCritical;
    case 'high': return styles.urgencyHigh;
    case 'medium': return styles.urgencyMedium;
    case 'low': return styles.urgencyLow;
    default: return styles.urgencyMedium;
  }
}

function ExportDocument(data: UserExportData) {
  const l = getLabels(data.profile?.preferred_language);
  const completedDocs = data.documents.filter(d => d.status === 'completed').length;
  const failedDocs = data.documents.filter(d => d.status === 'failed').length;
  const el = React.createElement;

  return el(Document, {},
    el(Page, { size: 'A4', style: styles.page },
      // Header
      el(View, { style: styles.header },
        el(Text, { style: styles.headerTitle }, l.title),
        el(Text, { style: styles.headerSubtitle },
          `${l.subtitle} — ${l.exportDate}: ${formatDate(data.exported_at)}`
        ),
      ),

      // Summary cards
      el(View, { style: styles.summaryRow },
        el(View, { style: styles.summaryCard },
          el(Text, { style: styles.summaryNumber }, String(data.documents.length)),
          el(Text, { style: styles.summaryLabel }, l.documents),
        ),
        el(View, { style: styles.summaryCard },
          el(Text, { style: styles.summaryNumber }, String(data.letters.length)),
          el(Text, { style: styles.summaryLabel }, l.letters),
        ),
        el(View, { style: styles.summaryCard },
          el(Text, { style: styles.summaryNumber }, String(data.deadlines.length)),
          el(Text, { style: styles.summaryLabel }, l.deadlines),
        ),
      ),

      // Profile
      el(Text, { style: styles.sectionTitle }, l.profile),
      el(View, { style: styles.profileGrid },
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.name),
          el(Text, { style: styles.value }, data.profile?.full_name || l.notSpecified),
        ),
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.email),
          el(Text, { style: styles.value }, data.profile?.email || '-'),
        ),
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.city),
          el(Text, { style: styles.value }, data.profile?.city || l.notSpecified),
        ),
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.country),
          el(Text, { style: styles.value }, data.profile?.country_of_origin || l.notSpecified),
        ),
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.language),
          el(Text, { style: styles.value }, data.profile?.preferred_language?.toUpperCase() || '-'),
        ),
        el(View, { style: styles.profileItem },
          el(Text, { style: styles.label }, l.memberSince),
          el(Text, { style: styles.value }, formatDate(data.profile?.created_at)),
        ),
      ),

      // Documents
      el(Text, { style: styles.sectionTitle },
        `${l.documents} (${completedDocs} ${l.completed}, ${failedDocs} ${l.failed})`
      ),
      ...(data.documents.length > 0
        ? [
            el(View, { style: styles.tableHeader, key: 'doc-head' },
              el(Text, { style: { ...styles.tableHeaderText, width: '35%' } }, l.fileName),
              el(Text, { style: { ...styles.tableHeaderText, width: '20%' } }, l.type),
              el(Text, { style: { ...styles.tableHeaderText, width: '20%' } }, l.authority),
              el(Text, { style: { ...styles.tableHeaderText, width: '12%' } }, l.status),
              el(Text, { style: { ...styles.tableHeaderText, width: '13%' } }, l.date),
            ),
            ...data.documents.map((doc, i) =>
              el(View, {
                key: `doc-${i}`,
                style: i % 2 === 0 ? styles.tableRow : styles.tableRowAlt,
              },
                el(Text, { style: { ...styles.tableCell, width: '35%' } },
                  truncate(doc.original_file_name || doc.title || '-', 30)
                ),
                el(Text, { style: { ...styles.tableCell, width: '20%' } },
                  doc.document_type?.replace(/_/g, ' ') || '-'
                ),
                el(Text, { style: { ...styles.tableCell, width: '20%' } },
                  truncate(doc.authority_name || '-', 22)
                ),
                el(Text, { style: { ...getStatusStyle(doc.status), width: '12%' } },
                  l[doc.status || 'uploaded'] || doc.status || '-'
                ),
                el(Text, { style: { ...styles.tableCell, width: '13%' } },
                  formatDate(doc.created_at)
                ),
              )
            ),
          ]
        : [el(Text, { style: styles.emptyText, key: 'no-docs' }, l.noDocuments)]
      ),

      // Footer
      el(View, { style: styles.footer, fixed: true } as Record<string, unknown>,
        el(Text, {}, `GovMate AI — ${l.disclaimer}`),
      ),
    ),

    // Page 2: Letters & Deadlines
    (data.letters.length > 0 || data.deadlines.length > 0)
      ? el(Page, { size: 'A4', style: styles.page, key: 'page2' },
          // Letters
          el(Text, { style: styles.sectionTitle }, `${l.letters} (${data.letters.length})`),
          ...(data.letters.length > 0
            ? data.letters.map((letter, i) =>
                el(View, { key: `letter-${i}`, style: styles.letterCard },
                  el(Text, { style: styles.letterSubject },
                    letter.subject || l.notSpecified
                  ),
                  el(Text, { style: styles.letterMeta },
                    `${letter.letter_type?.replace(/_/g, ' ') || '-'} — ${formatDate(letter.created_at)}`
                  ),
                  letter.german_body
                    ? el(Text, { style: styles.letterBody },
                        truncate(letter.german_body, 500)
                      )
                    : null,
                )
              )
            : [el(Text, { style: styles.emptyText, key: 'no-letters' }, l.noLetters)]
          ),

          // Deadlines
          el(Text, { style: styles.sectionTitle }, `${l.deadlines} (${data.deadlines.length})`),
          ...(data.deadlines.length > 0
            ? data.deadlines.map((dl, i) =>
                el(View, { key: `dl-${i}`, style: styles.deadlineCard },
                  el(View, {},
                    el(Text, { style: { fontSize: 10, fontWeight: 700 } },
                      dl.title || l.notSpecified
                    ),
                    dl.description
                      ? el(Text, { style: { fontSize: 8, color: colors.muted } }, dl.description)
                      : null,
                  ),
                  el(View, { style: { alignItems: 'flex-end' } },
                    el(Text, { style: { fontSize: 10 } }, formatDate(dl.deadline_date)),
                    el(Text, { style: getUrgencyStyle(dl.urgency) },
                      l[dl.urgency || 'medium'] || dl.urgency || '-'
                    ),
                    el(Text, { style: getStatusStyle(dl.status) },
                      l[dl.status === 'done' ? 'done' : 'open'] || dl.status || '-'
                    ),
                  ),
                )
              )
            : [el(Text, { style: styles.emptyText, key: 'no-dl' }, l.noDeadlines)]
          ),

          // Footer
          el(View, { style: styles.footer, fixed: true } as Record<string, unknown>,
            el(Text, {}, `GovMate AI — ${l.disclaimer}`),
          ),
        )
      : null,
  );
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export async function generateExportPDF(data: UserExportData): Promise<Buffer> {
  const doc = ExportDocument(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
