'use client';

import { DocumentCard } from '@/components/documents/document-card';
import { DocumentDeleteButton } from '@/components/documents/document-delete-button';
import type { Document } from '@/types/database';

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="relative group">
          <DocumentCard document={doc} />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DocumentDeleteButton documentId={doc.id} size="icon" variant="destructive" />
          </div>
        </div>
      ))}
    </div>
  );
}
