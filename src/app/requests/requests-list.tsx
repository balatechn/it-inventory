'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
} from 'lucide-react';
import { formatDate, statusColors, priorityColors, REQUEST_TYPES } from '@/lib/utils';

interface Request {
  id: string;
  requestNumber: string;
  requestType: string;
  subject: string;
  requesterName: string;
  employeeType: string;
  priority: string;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    shortName: string;
  } | null;
  location: {
    id: string;
    name: string;
    city: string | null;
  } | null;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  ...REQUEST_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export function RequestsList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('type', typeFilter);
      if (priorityFilter) params.set('priority', priorityFilter);

      const response = await fetch(`/api/requests?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setRequests(data.data || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Calculate summary stats from fetched data
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const inProgressCount = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">IT Requests</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage IT asset requests and employee onboarding
          </p>
        </div>
        <Link href="/requests/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-[#070B47]">{pendingCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-[#070B47]">{approvedCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-[#070B47]">{inProgressCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#070B47]">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-[#070B47]">{completedCount}</p>
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
                  placeholder="Search by request number, subject, requester..."
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
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36"
              />
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48"
              />
              <Select
                options={priorityOptions}
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36"
              />
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 text-center text-red-600">
          <p>{error}</p>
          <Button onClick={fetchRequests} className="mt-4">
            Try Again
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#070B47]" />
            <p className="text-gray-500">Loading requests...</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && requests.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
          <p className="text-gray-500 mt-1">
            {search || statusFilter || typeFilter || priorityFilter
              ? 'Try adjusting your filters'
              : 'Create your first IT request'}
          </p>
          <Link href="/requests/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </Link>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && requests.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Company / Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#070B47]/10 flex items-center justify-center">
                        {getStatusIcon(request.status)}
                      </div>
                      <div>
                        <p className="font-medium text-[#070B47]">{request.requestNumber}</p>
                        <p className="text-sm text-gray-600 max-w-[250px] truncate">
                          {request.subject}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {REQUEST_TYPES.find((t) => t.value === request.requestType)?.label || request.requestType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p>{request.requesterName}</p>
                    {request.employeeType === 'NEW' && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        New Employee
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{request.company?.shortName || request.company?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{request.location?.name || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[request.priority] || ''}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[request.status] || ''}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(request.createdAt)}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/requests/${request.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {request.status === 'PENDING' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Link href={`/requests/${request.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
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
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} requests
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
    </div>
  );
}
