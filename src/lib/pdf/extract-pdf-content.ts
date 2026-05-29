const MIN_TEXT_CHARS = 80;
const MAX_VISION_PAGES = 3;
const RENDER_SCALE = 1.5;

export interface PdfAnalysisContent {
  text: string;
  visionImages?: string[];
  totalPages: number;
  usedVision: boolean;
}

/** PDF metin çıkarımı; taranmış belgeler için sayfa görüntüsü üretir */
export async function extractPdfForAnalysis(
  data: Uint8Array
): Promise<PdfAnalysisContent> {
  const { extractText, getDocumentProxy, renderPageAsImage } = await import('unpdf');

  const pdf = await getDocumentProxy(data);
  const { text, totalPages } = await extractText(pdf, { mergePages: true });
  const trimmed = (text || '').trim();

  if (trimmed.length >= MIN_TEXT_CHARS) {
    return { text: trimmed, totalPages, usedVision: false };
  }

  const pagesToRender = Math.min(totalPages, MAX_VISION_PAGES);
  const visionImages: string[] = [];

  for (let page = 1; page <= pagesToRender; page++) {
    try {
      const dataUrl = await renderPageAsImage(pdf, page, {
        toDataURL: true,
        scale: RENDER_SCALE,
        canvasImport: () => import('@napi-rs/canvas'),
      });
      visionImages.push(dataUrl);
    } catch (error) {
      console.warn(`PDF sayfa ${page} görüntüye çevrilemedi:`, error);
    }
  }

  if (visionImages.length === 0) {
    return {
      text: trimmed || 'PDF metni çıkarılamadı.',
      totalPages,
      usedVision: false,
    };
  }

  return {
    text:
      trimmed ||
      'Taranmış PDF — lütfen ekteki sayfa görüntülerindeki metni okuyup analiz et.',
    visionImages,
    totalPages,
    usedVision: true,
  };
}
