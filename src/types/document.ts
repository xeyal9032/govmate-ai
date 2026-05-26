export interface UploadDocumentInput {
  file: File;
  targetLanguage: string;
  title?: string;
}

export interface DocumentWithAnalysis {
  document: import('./database').Document;
  analysis: import('./database').DocumentAnalysis | null;
  deadlines: import('./database').Deadline[];
  letters: import('./database').GeneratedLetter[];
}
