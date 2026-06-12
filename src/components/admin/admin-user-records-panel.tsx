'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { adminDeleteDocument, adminDeleteLetter } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentRow {
  id: string;
  title?: string | null;
  status: string;
  created_at: string;
}

interface LetterRow {
  id: string;
  subject: string;
  letter_type: string;
  created_at: string;
}

interface Props {
  userId: string;
  documents: DocumentRow[];
  letters: LetterRow[];
  isAdmin: boolean;
}

export function AdminUserRecordsPanel({
  userId,
  documents,
  letters,
  isAdmin,
}: Props) {
  const t = useTranslations('admin');
  const [isPending, startTransition] = useTransition();

  const handleDeleteDocument = (documentId: string) => {
    if (!confirm(t('deleteDocumentConfirm'))) return;
    startTransition(async () => {
      try {
        await adminDeleteDocument(documentId, userId);
        toast.success(t('documentDeleted'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  const handleDeleteLetter = (letterId: string) => {
    if (!confirm(t('deleteLetterConfirm'))) return;
    startTransition(async () => {
      try {
        await adminDeleteLetter(letterId, userId);
        toast.success(t('letterDeleted'));
      } catch {
        toast.error(t('operationError'));
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('userDocuments')}</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noData')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('titleColumn')}</TableHead>
                  <TableHead>{t('statusColumn')}</TableHead>
                  <TableHead>{t('dateColumn')}</TableHead>
                  {isAdmin && <TableHead className="w-12" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="max-w-[200px] truncate">{doc.title || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={isPending}
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('userLetters')}</CardTitle>
        </CardHeader>
        <CardContent>
          {letters.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noData')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('subjectColumn')}</TableHead>
                  <TableHead>{t('feedbackType')}</TableHead>
                  <TableHead>{t('dateColumn')}</TableHead>
                  {isAdmin && <TableHead className="w-12" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell className="max-w-[200px] truncate">{letter.subject}</TableCell>
                    <TableCell>{letter.letter_type}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(letter.created_at).toLocaleDateString()}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={isPending}
                          onClick={() => handleDeleteLetter(letter.id)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
