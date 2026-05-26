'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Download, Eye, Filter, X } from 'lucide-react';
import { downloadCSV } from '@/lib/utils/csv-export';

interface AuditLog {
  id: string;
  action: string;
  user_id: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface LogsTableProps {
  logs: AuditLog[];
  total: number;
  page: number;
  perPage: number;
}

const actionColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  login: 'default',
  logout: 'secondary',
  delete: 'destructive',
  update: 'outline',
  create: 'default',
};

export function LogsTable({ logs, total, page, perPage }: LogsTableProps) {
  const t = useTranslations('admin');
  const [selectedMeta, setSelectedMeta] = useState<Record<string, unknown> | null>(null);
  const [metaDialogOpen, setMetaDialogOpen] = useState(false);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((l) => l.action));
    return Array.from(actions).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (actionFilter && actionFilter !== 'all') {
      result = result.filter((l) => l.action === actionFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((l) => new Date(l.created_at) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59');
      result = result.filter((l) => new Date(l.created_at) <= to);
    }
    return result;
  }, [logs, actionFilter, dateFrom, dateTo]);

  const hasActiveFilters = actionFilter !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setActionFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const totalPages = Math.ceil(total / perPage);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionBadgeVariant = (action: string) => {
    const key = Object.keys(actionColors).find((k) =>
      action.toLowerCase().includes(k)
    );
    return actionColors[key || ''] || 'outline';
  };

  const showMetadata = (meta: Record<string, unknown> | null) => {
    setSelectedMeta(meta);
    setMetaDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={actionFilter} onValueChange={(v) => setActionFilter(v ?? 'all')}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder={t('filterByAction')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allActions')}</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 w-[150px]"
            placeholder={t('dateFrom')}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-8 w-[150px]"
            placeholder={t('dateTo')}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="size-3.5" />
            {t('clearFilters')}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => downloadCSV(
          filteredLogs.map(l => ({
            action: l.action,
            user_id: l.user_id || '',
            ip_address: l.ip_address || '',
            created_at: l.created_at,
          })),
          'audit_logs'
        )}>
          <Download className="size-4" data-icon="inline-start" />
          CSV
        </Button>
        <span className="ml-auto text-sm text-muted-foreground">
          {t('totalLogsCount', { count: filteredLogs.length })}
        </span>
      </div>

      <div className="rounded-lg border">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('actionColumn')}</TableHead>
                <TableHead>{t('userIdColumn')}</TableHead>
                <TableHead>{t('ipColumn')}</TableHead>
                <TableHead>{t('dateColumn')}</TableHead>
                <TableHead className="w-[80px]">{t('detailColumn')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t('noLogsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.user_id ? log.user_id.slice(0, 8) + '…' : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.ip_address || '—'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell>
                      {log.metadata && Object.keys(log.metadata).length > 0 ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => showMetadata(log.metadata)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
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

      {/* Metadata detay dialog */}
      <Dialog open={metaDialogOpen} onOpenChange={setMetaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('metadataDetail')}</DialogTitle>
            <DialogDescription>
              {t('metadataDesc')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <pre className="rounded-md bg-muted p-4 text-xs font-mono overflow-x-auto">
              {selectedMeta
                ? JSON.stringify(selectedMeta, null, 2)
                : t('noData')}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
