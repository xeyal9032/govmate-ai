'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { updateUserRole, adminDeleteUser, adminResetPassword } from '@/actions/admin';
import { downloadCSV } from '@/lib/utils/csv-export';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  KeyRound,
  Search,
  Trash2,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
  subscriptions: { plan: string; status: string } | null;
}

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  perPage: number;
}

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  support: 'secondary',
  user: 'outline',
};

export function UsersTable({ users, total, page, perPage }: UsersTableProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tBilling = useTranslations('billing.plans');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const totalPages = Math.ceil(total / perPage);

  const filteredUsers = search
    ? users.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const handleRoleChange = (userId: string, role: 'user' | 'admin' | 'support') => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
        toast.success(t('roleUpdated'));
      } catch {
        toast.error(t('roleUpdateError'));
      }
    });
  };

  const handleDelete = () => {
    if (!deletingUser) return;
    startTransition(async () => {
      try {
        await adminDeleteUser(deletingUser.id);
        toast.success(t('userDeleted'));
        setDeleteDialogOpen(false);
        setDeletingUser(null);
      } catch {
        toast.error(t('userDeleteError'));
      }
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        <div className="relative w-full flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchUsers')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(
          filteredUsers.map(u => ({
            name: u.full_name || '',
            email: u.email,
            role: u.role,
            plan: u.subscriptions?.plan || 'free',
            created_at: u.created_at,
          })),
          'users'
        )}>
          <Download className="size-4" data-icon="inline-start" />
          CSV
        </Button>
        <span className="text-sm text-muted-foreground">
          {t('totalUsersCount', { count: total })}
        </span>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('nameColumn')}</TableHead>
              <TableHead>{t('emailColumn')}</TableHead>
              <TableHead>{t('roleColumn')}</TableHead>
              <TableHead>{t('planColumn')}</TableHead>
              <TableHead>{t('dateColumn')}</TableHead>
              <TableHead className="w-[140px]">{t('changeRole')}</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t('noUsersFound')}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || '—'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant[user.role] || 'outline'}>
                      {t(`roles.${user.role}` as any)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {tBilling(`${user.subscriptions?.plan || 'free'}.name` as any)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(val) =>
                        val && handleRoleChange(user.id, val as 'user' | 'admin' | 'support')
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger size="sm" className="h-7 w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('roles.user')}</SelectItem>
                        <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                        <SelectItem value="support">{t('roles.support')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="size-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            const result = await adminResetPassword(user.id);
                            toast.success(t('passwordResetSent', { email: result.email }));
                          } catch {
                            toast.error(t('passwordResetError'));
                          }
                        });
                      }}
                      title={t('resetPassword')}
                    >
                      <KeyRound className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setDeletingUser(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('pageOf', { page, total: totalPages })}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', String(page - 1));
                window.location.search = params.toString();
              }}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', String(page + 1));
                window.location.search = params.toString();
              }}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('deleteUserTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteUserConfirm', { email: deletingUser?.email || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? t('deleting') : tCommon('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
