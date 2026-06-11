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
  title: { fontSize: 14, fontWeight: 700, marginBottom: 24 },
  body: { textAlign: 'justify' },
  paragraph: { marginBottom: 8 },
});

export interface TemplatePDFParams {
  title: string;
  content: string;
}

function TemplateDocument(params: TemplatePDFParams) {
  const paragraphs = params.content.split('\n').filter(Boolean);

  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, params.title),
      React.createElement(
        View,
        { style: styles.body },
        ...paragraphs.map((p, i) =>
          React.createElement(Text, { key: String(i), style: styles.paragraph }, p)
        )
      )
    )
  );
}

export async function generateTemplatePDF(params: TemplatePDFParams): Promise<Buffer> {
  const doc = TemplateDocument(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
