#!/usr/bin/env node
/**
 * Örnek landing PDF dosyalarını üretir (public/samples/).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from '@react-pdf/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'samples');
const fontsDir = path.join(root, 'src', 'lib', 'pdf', 'fonts');

Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(fontsDir, 'Roboto-Regular.ttf'), fontWeight: 400 },
    { src: path.join(fontsDir, 'Roboto-Bold.ttf'), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 50, fontSize: 11, fontFamily: 'Roboto', lineHeight: 1.5 },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  subtitle: { fontSize: 10, color: '#666', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  paragraph: { marginBottom: 6, textAlign: 'justify' },
  bullet: { marginLeft: 12, marginBottom: 4 },
  badge: {
    fontSize: 9,
    color: '#666',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  sender: { fontSize: 9, color: '#666', marginBottom: 20 },
  recipient: { marginBottom: 24 },
  dateLine: { textAlign: 'right', marginBottom: 16 },
  subject: { fontSize: 12, fontWeight: 700, marginBottom: 12 },
  greeting: { marginBottom: 10 },
  signature: { marginTop: 32 },
});

function AnalysisDocument() {
  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, 'Analyse-Zusammenfassung (Beispiel)'),
      React.createElement(
        Text,
        { style: styles.subtitle },
        'GovMate AI · Anonymisiertes Beispiel · Keine echten Personendaten'
      ),
      React.createElement(Text, { style: styles.sectionTitle }, 'Dokument'),
      React.createElement(
        Text,
        { style: styles.paragraph },
        'Absender: Jobcenter Essen · Dokumenttyp: Bescheid über Leistungsanspruch (Bürgergeld)'
      ),
      React.createElement(Text, { style: styles.sectionTitle }, 'Kurzfassung'),
      React.createElement(
        Text,
        { style: styles.paragraph },
        'Der Bescheid lehnt den Antrag auf Bürgergeld ab, weil angeforderte Unterlagen (Mietvertrag und Kontoauszüge der letzten drei Monate) nicht fristgerecht eingereicht wurden.'
      ),
      React.createElement(Text, { style: styles.sectionTitle }, 'Wichtige Frist'),
      React.createElement(
        Text,
        { style: styles.paragraph },
        'Widerspruch möglich bis: 15.06.2026 (14 Tage ab Zustellung)'
      ),
      React.createElement(Text, { style: styles.sectionTitle }, 'Erforderliche Maßnahmen'),
      React.createElement(Text, { style: styles.bullet }, '• Widerspruch schriftlich einlegen oder fehlende Unterlagen nachreichen'),
      React.createElement(Text, { style: styles.bullet }, '• Mietvertrag und Kontoauszüge als PDF hochladen'),
      React.createElement(Text, { style: styles.bullet }, '• Frist im Kalender markieren'),
      React.createElement(Text, { style: styles.sectionTitle }, 'Risiken'),
      React.createElement(
        Text,
        { style: styles.paragraph },
        'Bei versäumter Frist kann der Widerspruch als unzulässig abgelehnt werden.'
      ),
      React.createElement(
        Text,
        { style: styles.badge },
        'Dies ist ein anonymes Beispieldokument. GovMate AI ersetzt keine Rechtsberatung.'
      )
    )
  );
}

function LetterDocument() {
  const body = [
    'hiermit lege ich Widerspruch gegen Ihren Bescheid vom 01.06.2026 ein.',
    'Die angeforderten Unterlagen (Mietvertrag und Kontoauszüge) habe ich zwischenzeitlich vollständig zusammengestellt und füge diese bei.',
    'Ich bitte um erneute Prüfung meines Antrags auf Bürgergeld und um schriftliche Mitteilung des Ergebnisses.',
  ].join('\n');

  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.sender },
        React.createElement(Text, {}, 'Max M. · Musterstraße 12 · 45127 Essen')
      ),
      React.createElement(
        View,
        { style: styles.recipient },
        React.createElement(Text, {}, 'Jobcenter Essen'),
        React.createElement(Text, {}, 'Leopoldstraße 4 · 45131 Essen')
      ),
      React.createElement(
        View,
        { style: styles.dateLine },
        React.createElement(Text, {}, 'Essen, 05.06.2026')
      ),
      React.createElement(
        Text,
        { style: styles.subject },
        'Betreff: Widerspruch gegen Bescheid vom 01.06.2026'
      ),
      React.createElement(Text, { style: styles.greeting }, 'Sehr geehrte Damen und Herren,'),
      ...body.split('\n').map((p, i) =>
        React.createElement(Text, { key: String(i), style: styles.paragraph }, p)
      ),
      React.createElement(Text, {}, 'Mit freundlichen Grüßen'),
      React.createElement(View, { style: styles.signature }, React.createElement(Text, {}, 'Max M.')),
      React.createElement(
        Text,
        { style: styles.badge },
        'Anonymes Beispiel · GovMate AI · Keine Rechtsberatung'
      )
    )
  );
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const analysisBuf = await renderToBuffer(React.createElement(AnalysisDocument));
  fs.writeFileSync(path.join(outDir, 'ornek-analiz-ozeti.pdf'), Buffer.from(analysisBuf));

  const letterBuf = await renderToBuffer(React.createElement(LetterDocument));
  fs.writeFileSync(path.join(outDir, 'ornek-cevap-mektubu.pdf'), Buffer.from(letterBuf));

  console.log('Örnek PDF dosyaları oluşturuldu:', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
