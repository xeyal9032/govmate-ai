import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAdminUserDetail } from '@/actions/admin';
import { createClient } from '@/lib/supabase/server';
import { AdminUserDetailPanel } from '@/components/admin/admin-user-detail-panel';
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

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const { data: currentProfile } = currentUser
    ? await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
    : { data: null };
  const isAdmin = currentProfile?.role === 'admin';

  let detail;
  try {
    detail = await getAdminUserDetail(id);
  } catch {
    return <div className="p-6"><p>{t('userNotFound')}</p></div>;
  }

  const { profile, documents, letters, totalUsage } = detail;
  if (!profile) return <div className="p-6"><p>{t('userNotFound')}</p></div>;

  const subscription = Array.isArray((profile as { subscriptions?: unknown }).subscriptions)
    ? (profile as { subscriptions: { id: string; plan: string; status: string }[] }).subscriptions[0]
    : (profile as { subscriptions?: { id: string; plan: string; status: string } | null }).subscriptions;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{profile.full_name || profile.email}</h1>
      <p className="text-sm text-muted-foreground">{profile.email}</p>

      <AdminUserDetailPanel
        userId={id}
        initialFullName={profile.full_name || ''}
        initialAddress={profile.address || ''}
        initialRole={profile.role || 'user'}
        subscriptionId={subscription?.id ?? null}
        initialPlan={subscription?.plan || 'free'}
        initialStatus={subscription?.status || 'inactive'}
        isAdmin={isAdmin}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-muted-foreground">{t('documentsCount')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold">{letters.length}</p>
            <p className="text-sm text-muted-foreground">{t('userLetters')}</p>
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
                {documents.map((doc: { id: string; title?: string; status: string; created_at: string }) => (
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
                {letters.map((letter: { id: string; subject: string; letter_type: string; created_at: string }) => (
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
