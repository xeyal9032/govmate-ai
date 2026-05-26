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

const styles = StyleSheet.create({
  page: { padding: 60, fontSize: 11, fontFamily: 'Roboto', lineHeight: 1.5 },
  sender: { fontSize: 9, color: '#666', marginBottom: 20 },
  recipient: { marginBottom: 30 },
  recipientName: { fontSize: 11 },
  dateLine: { textAlign: 'right', marginBottom: 20 },
  subject: { fontSize: 12, fontWeight: 700, marginBottom: 15 },
  body: { marginBottom: 30, textAlign: 'justify' },
  paragraph: { marginBottom: 8 },
  greeting: { marginBottom: 10 },
  signature: { marginTop: 40 },
});

export interface LetterPDFParams {
  senderName: string;
  senderAddress?: string;
  recipientName: string;
  recipientAddress?: string;
  date: string;
  subject: string;
  body: string;
}

function LetterDocument(params: LetterPDFParams) {
  const paragraphs = params.body.split('\n').filter(Boolean);

  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.sender },
        React.createElement(
          Text,
          {},
          `${params.senderName}${params.senderAddress ? ' · ' + params.senderAddress.replace(/\n/g, ' · ') : ''}`
        )
      ),
      React.createElement(
        View,
        { style: styles.recipient },
        React.createElement(Text, { style: styles.recipientName }, params.recipientName),
        params.recipientAddress
          ? React.createElement(Text, {}, params.recipientAddress)
          : null
      ),
      React.createElement(
        View,
        { style: styles.dateLine },
        React.createElement(Text, {}, params.date)
      ),
      React.createElement(Text, { style: styles.subject }, `Betreff: ${params.subject}`),
      React.createElement(Text, { style: styles.greeting }, 'Sehr geehrte Damen und Herren,'),
      React.createElement(
        View,
        { style: styles.body },
        ...paragraphs.map((p, i) =>
          React.createElement(Text, { key: String(i), style: styles.paragraph }, p)
        )
      ),
      React.createElement(Text, {}, 'Mit freundlichen Grüßen'),
      React.createElement(
        View,
        { style: styles.signature },
        React.createElement(Text, {}, params.senderName)
      )
    )
  );
}

export async function generateLetterPDF(params: LetterPDFParams): Promise<Buffer> {
  const doc = LetterDocument(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}

export { generateLetterHTML } from './generate-letter-html';
