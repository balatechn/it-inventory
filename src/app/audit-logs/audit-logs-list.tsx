'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  History,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  performedBy: string;
  ipAddress: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    code: string;
  } | null;
}

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
];

const entityTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'System', label: 'Systems' },
  { value: 'Software', label: 'Software' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Request', label: 'Requests' },
];

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
};

const actionIcons: Record<string, React.ReactNode> = {
  CREATE: <Plus className="h-4 w-4" />,
  UPDATE: <Pencil className="h-4 w-4" />,
  DELETE: <Trash2 className="h-4 w-4" />,
};

export function AuditLogsList() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const itemsPerPage = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      if (actionFilter) params.set('action', actionFilter);
      if (entityTypeFilter) params.set('entityType', entityTypeFilter);

      const response = await fetch(`/api/audit-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      const data = await response.json();
      setLogs(data.data || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, actionFilter, entityTypeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const formatChanges = (log: AuditLog) => {
    if (log.action === 'CREATE' && log.newValues) {
      return (
        <div className="text-xs text-gray-600 max-w-md truncate">
          Created with {Object.keys(log.newValues).length} fields
        </div>
      );
    }
    if (log.action === 'DELETE' && log.oldValues) {
      return (
        <div className="text-xs text-gray-600 max-w-md truncate">
          Deleted record
        </div>
      );
    }
    if (log.action === 'UPDATE' && log.oldValues && log.newValues) {
      const changedFields = Object.keys(log.newValues);
      return (
        <div className="text-xs text-gray-600 max-w-md truncate">
          Changed: {changedFields.join(', ')}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Audit Logs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all changes made to IT assets and requests
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Created</p>
          <p className="text-2xl font-bold text-[#070B47]">
            {logs.filter((l) => l.action === 'CREATE').length}
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">Updated</p>
          <p className="text-2xl font-bold text-[#070B47]">
            {logs.filter((l) => l.action === 'UPDATE').length}
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500">Deleted</p>
          <p className="text-2xl font-bold text-[#070B47]">
            {logs.filter((l) => l.action === 'DELETE').length}
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#070B47]">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-2xl font-bold text-[#070B47]">{totalCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by entity ID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                options={actionOptions}
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36"
              />
              <Select
                options={entityTypeOptions}
                value={entityTypeFilter}
                onChange={(e) => {
                  setEntityTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 text-center text-red-600">
          <p>{error}</p>
          <Button onClick={fetchLogs} className="mt-4">
            Try Again
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#070B47]" />
            <p className="text-gray-500">Loading audit logs...</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <Card className="p-12 text-center">
          <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No audit logs found</h3>
          <p className="text-gray-500 mt-1">
            {actionFilter || entityTypeFilter
              ? 'Try adjusting your filters'
              : 'Audit logs will appear here when changes are made'}
          </p>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && logs.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge className={actionColors[log.action] || ''}>
                      <span className="flex items-center gap-1">
                        {actionIcons[log.action]}
                        {log.action}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.entityType}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.entityId.substring(0, 12)}...
                    </code>
                  </TableCell>
                  <TableCell>{formatChanges(log)}</TableCell>
                  <TableCell>
                    {log.company?.code || '-'}
                  </TableCell>
                  <TableCell>{log.performedBy}</TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(log.createdAt)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} logs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto m-4">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#070B47]">Audit Log Details</h2>
                <Button variant="ghost" onClick={() => setSelectedLog(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Action</p>
                    <Badge className={actionColors[selectedLog.action] || ''}>
                      {selectedLog.action}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entity Type</p>
                    <p className="font-medium">{selectedLog.entityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entity ID</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {selectedLog.entityId}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Performed By</p>
                    <p className="font-medium">{selectedLog.performedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {new Date(selectedLog.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">
                      {selectedLog.company?.name || '-'}
                    </p>
                  </div>
                </div>

                {selectedLog.oldValues && Object.keys(selectedLog.oldValues).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Previous Values</p>
                    <pre className="bg-red-50 p-3 rounded text-xs overflow-auto max-h-48">
                      {JSON.stringify(selectedLog.oldValues, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.newValues && Object.keys(selectedLog.newValues).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">New Values</p>
                    <pre className="bg-green-50 p-3 rounded text-xs overflow-auto max-h-48">
                      {JSON.stringify(selectedLog.newValues, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
