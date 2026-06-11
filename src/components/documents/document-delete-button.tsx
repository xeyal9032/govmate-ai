'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteDocument } from '@/actions/documents';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentDeleteButtonProps {
  documentId: string;
  redirectAfter?: boolean;
  variant?: 'outline' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

export function DocumentDeleteButton({
  documentId,
  redirectAfter = false,
  variant = 'outline',
  size = 'sm',
}: DocumentDeleteButtonProps) {
  const t = useTranslations('documents');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteDocument(documentId);
        toast.success(t('deleteSuccess'));
        setOpen(false);
        if (redirectAfter) {
          router.push('/dashboard/documents');
        } else {
          router.refresh();
        }
      } catch {
        toast.error(t('deleteFailed'));
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        {size !== 'icon' && t('deleteDocument')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteDocument')}</DialogTitle>
            <DialogDescription>{t('deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancelDelete')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('deleteDocument')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
