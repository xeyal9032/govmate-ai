import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAdminUserDetail } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  let detail;
  try {
    detail = await getAdminUserDetail(id);
  } catch {
    return <div className="p-6"><p>{t('userNotFound')}</p></div>;
  }

  const { profile, documents, letters, totalUsage } = detail;
  if (!profile) return <div className="p-6"><p>{t('userNotFound')}</p></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{profile.full_name || profile.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{profile.role}</p>
            <p className="text-sm text-muted-foreground">{t('roleColumn')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{(profile as any).subscriptions?.plan || 'free'}</p>
            <p className="text-sm text-muted-foreground">{t('planColumn')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-muted-foreground">{t('documentsCount')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{totalUsage}</p>
            <p className="text-sm text-muted-foreground">{t('totalUsage')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('userDocuments')}</CardTitle></CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('noData')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('titleColumn')}</TableHead>
                  <TableHead>{t('statusColumn')}</TableHead>
                  <TableHead>{t('dateColumn')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{doc.status}</Badge></TableCell>
                    <TableCell className="text-sm">{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t('userLetters')}</CardTitle></CardHeader>
        <CardContent>
          {letters.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t('noData')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('subjectColumn')}</TableHead>
                  <TableHead>{t('feedbackType')}</TableHead>
                  <TableHead>{t('dateColumn')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.map((letter: any) => (
                  <TableRow key={letter.id}>
                    <TableCell>{letter.subject}</TableCell>
                    <TableCell><Badge variant="outline">{letter.letter_type}</Badge></TableCell>
                    <TableCell className="text-sm">{new Date(letter.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
