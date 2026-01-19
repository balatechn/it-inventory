'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { formatDate, statusColors, priorityColors, REQUEST_TYPES } from '@/lib/utils';

// Mock data
const mockRequests = [
  {
    id: '1',
    requestNumber: 'REQ-2026-0001',
    requestType: 'NEW_EMPLOYEE',
    subject: 'New Employee Onboarding - John Doe',
    requesterName: 'HR Department',
    company: 'NCPL',
    location: 'HO – Bangalore',
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: '2026-01-15T10:30:00Z',
    employeeType: 'NEW',
    joiningDate: '2026-02-01',
  },
  {
    id: '2',
    requestNumber: 'REQ-2026-0002',
    requestType: 'HARDWARE',
    subject: 'Laptop Replacement Request',
    requesterName: 'Alice Johnson',
    company: 'RAINLAND',
    location: 'Rainland – Mangaluru',
    priority: 'NORMAL',
    status: 'APPROVED',
    createdAt: '2026-01-14T14:20:00Z',
    employeeType: 'EXISTING',
  },
  {
    id: '3',
    requestNumber: 'REQ-2026-0003',
    requestType: 'SOFTWARE',
    subject: 'AutoCAD License Request',
    requesterName: 'Design Team',
    company: 'RAINLAND',
    location: 'Rainland – Bangalore',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    createdAt: '2026-01-13T09:15:00Z',
    employeeType: 'EXISTING',
  },
  {
    id: '4',
    requestNumber: 'REQ-2026-0004',
    requestType: 'ACCESS',
    subject: 'VPN Access for Remote Work',
    requesterName: 'Bob Wilson',
    company: 'NCPL',
    location: 'HO – Bangalore',
    priority: 'URGENT',
    status: 'PENDING',
    createdAt: '2026-01-15T16:45:00Z',
    employeeType: 'EXISTING',
  },
  {
    id: '5',
    requestNumber: 'REQ-2026-0005',
    requestType: 'MOBILE',
    subject: 'Corporate SIM Request',
    requesterName: 'Sales Team',
    company: 'RAINLAND',
    location: 'Rainland – Shivamogga',
    priority: 'LOW',
    status: 'COMPLETED',
    createdAt: '2026-01-10T11:00:00Z',
    employeeType: 'EXISTING',
  },
  {
    id: '6',
    requestNumber: 'REQ-2026-0006',
    requestType: 'EMAIL_ACCOUNT',
    subject: 'New Email Account Setup',
    requesterName: 'HR Department',
    company: 'ISKY',
    location: 'HO – Bangalore',
    priority: 'NORMAL',
    status: 'REJECTED',
    createdAt: '2026-01-12T08:30:00Z',
    employeeType: 'NEW',
  },
  {
    id: '7',
    requestNumber: 'REQ-2026-0007',
    requestType: 'MAINTENANCE',
    subject: 'Printer Maintenance - Canon',
    requesterName: 'Admin Department',
    company: 'NCPL',
    location: 'HO – Bangalore',
    priority: 'NORMAL',
    status: 'PENDING',
    createdAt: '2026-01-15T13:20:00Z',
    employeeType: 'EXISTING',
  },
];

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter requests
  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      search === '' ||
      request.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      request.subject.toLowerCase().includes(search.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || request.status === statusFilter;
    const matchesType = typeFilter === '' || request.requestType === typeFilter;
    const matchesPriority = priorityFilter === '' || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats
  const pendingCount = mockRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = mockRequests.filter((r) => r.status === 'APPROVED').length;
  const inProgressCount = mockRequests.filter((r) => r.status === 'IN_PROGRESS').length;
  const completedCount = mockRequests.filter((r) => r.status === 'COMPLETED').length;

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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36"
              />
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-48"
              />
              <Select
                options={priorityOptions}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
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

      {/* Table */}
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
            {paginatedRequests.map((request) => (
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
                  <p className="text-sm">{request.company}</p>
                  <p className="text-xs text-gray-500">{request.location}</p>
                </TableCell>
                <TableCell>
                  <Badge className={priorityColors[request.priority]}>
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[request.status]}>
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
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
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
              Page {currentPage} of {totalPages}
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
    </div>
  );
}
