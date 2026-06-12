'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { adminCreateUser } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export function CreateUserDialog() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
  });

  const reset = () => {
    setForm({ email: '', password: '', full_name: '', role: 'user' });
  };

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await adminCreateUser({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          role: form.role as 'user' | 'admin' | 'support',
        });
        toast.success(t('userCreated'));
        setOpen(false);
        reset();
      } catch {
        toast.error(t('userCreateError'));
      }
    });
  };

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        <Plus className="size-4" data-icon="inline-start" />
        {t('createUser')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('createUserTitle')}</DialogTitle>
            <DialogDescription>{t('createUserDesc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>{t('fullNameLabel')}</Label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('emailColumn')}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('passwordLabel')}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('roleColumn')}</Label>
              <Select
                value={form.role}
                onValueChange={(v) => v && setForm({ ...form, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('roles.user')}</SelectItem>
                  <SelectItem value="support">{t('roles.support')}</SelectItem>
                  <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                isPending ||
                !form.email ||
                !form.full_name ||
                form.password.length < 8
              }
            >
              {isPending ? t('saving') : t('create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
