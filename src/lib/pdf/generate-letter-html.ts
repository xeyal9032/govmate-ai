function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface LetterPDFData {
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  date: string;
  subject: string;
  body: string;
  customerNumber?: string;
}

export function generateLetterHTML(data: LetterPDFData): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 2cm 2.5cm;
      color: #000;
    }
    .sender { margin-bottom: 2cm; }
    .recipient { margin-bottom: 1.5cm; }
    .date { text-align: right; margin-bottom: 1cm; }
    .subject { font-weight: bold; margin-bottom: 1cm; }
    .body { margin-bottom: 1.5cm; white-space: pre-wrap; }
    .closing { margin-top: 2cm; }
    .disclaimer {
      margin-top: 3cm;
      font-size: 8pt;
      color: #666;
      border-top: 1px solid #ccc;
      padding-top: 0.5cm;
    }
  </style>
</head>
<body>
  <div class="sender">
    ${escapeHtml(data.senderName)}<br>
    ${escapeHtml(data.senderAddress).replace(/\n/g, '<br>')}
  </div>

  <div class="recipient">
    ${escapeHtml(data.recipientName)}<br>
    ${escapeHtml(data.recipientAddress).replace(/\n/g, '<br>')}
  </div>

  <div class="date">${escapeHtml(data.date)}</div>

  ${data.customerNumber ? `<div>Kundennummer: ${escapeHtml(data.customerNumber)}</div>` : ''}

  <div class="subject">Betreff: ${escapeHtml(data.subject)}</div>

  <div>Sehr geehrte Damen und Herren,</div>

  <div class="body">${escapeHtml(data.body)}</div>

  <div class="closing">
    Mit freundlichen Grüßen<br><br><br>
    ${escapeHtml(data.senderName)}
  </div>

  <div class="disclaimer">
    Erstellt mit GovMate AI. Dies ist keine Rechtsberatung.
    Für verbindliche Auskünfte wenden Sie sich bitte an die zuständige Behörde oder einen Rechtsanwalt.
  </div>
</body>
</html>`;
}
