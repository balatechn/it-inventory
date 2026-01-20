'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, ClipboardList, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const companies = [
  { id: '', name: 'All Companies' },
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const mockRequests = [
  { id: '1', requestId: 'REQ-2024-001', type: 'NEW_HARDWARE', itemName: 'Dell Laptop', requestedBy: 'John Doe', company: 'ISKY', status: 'APPROVED', date: '2024-01-15', priority: 'HIGH' },
  { id: '2', requestId: 'REQ-2024-002', type: 'SOFTWARE_LICENSE', itemName: 'Adobe Creative Cloud', requestedBy: 'Jane Smith', company: 'NCPL', status: 'PENDING', date: '2024-01-18', priority: 'MEDIUM' },
  { id: '3', requestId: 'REQ-2024-003', type: 'REPAIR', itemName: 'HP Desktop PC', requestedBy: 'Mike Johnson', company: 'NIPL', status: 'IN_PROGRESS', date: '2024-01-20', priority: 'LOW' },
  { id: '4', requestId: 'REQ-2024-004', type: 'MOBILE_DEVICE', itemName: 'iPhone 14', requestedBy: 'Sarah Wilson', company: 'ISKY', status: 'REJECTED', date: '2024-01-22', priority: 'MEDIUM' },
  { id: '5', requestId: 'REQ-2024-005', type: 'NEW_HARDWARE', itemName: 'MacBook Pro', requestedBy: 'Tom Brown', company: 'NRPL', status: 'COMPLETED', date: '2024-01-10', priority: 'HIGH' },
  { id: '6', requestId: 'REQ-2024-006', type: 'ACCESSORY', itemName: 'Wireless Mouse & Keyboard', requestedBy: 'Lisa Davis', company: 'Rainland Auto Corp', status: 'PENDING', date: '2024-01-25', priority: 'LOW' },
];

export default function RequestsReportPage() {
  const [filters, setFilters] = useState({ company: '', status: '', type: '', search: '' });

  const filteredRequests = mockRequests.filter((req) => {
    if (filters.company && req.company !== companies.find(c => c.id === filters.company)?.name) return false;
    if (filters.status && req.status !== filters.status) return false;
    if (filters.type && req.type !== filters.type) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!req.requestId.toLowerCase().includes(searchLower) && 
          !req.itemName.toLowerCase().includes(searchLower) &&
          !req.requestedBy.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'success';
      case 'REJECTED': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#070B47]">Requests Report</h1>
        </div>
        <Button className="bg-[#070B47]">
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#070B47]">{mockRequests.length}</p>
            <p className="text-sm text-gray-500">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{mockRequests.filter(r => r.status === 'PENDING').length}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{mockRequests.filter(r => r.status === 'IN_PROGRESS').length}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{mockRequests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length}</p>
            <p className="text-sm text-gray-500">Approved/Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{mockRequests.filter(r => r.status === 'REJECTED').length}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Search</Label>
              <Input 
                placeholder="Request ID, item, requester..." 
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Select value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })}>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Types</option>
                <option value="NEW_HARDWARE">New Hardware</option>
                <option value="SOFTWARE_LICENSE">Software License</option>
                <option value="MOBILE_DEVICE">Mobile Device</option>
                <option value="REPAIR">Repair</option>
                <option value="ACCESSORY">Accessory</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({ company: '', status: '', type: '', search: '' })}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Results ({filteredRequests.length} requests)</span>
            <ClipboardList className="h-5 w-5 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono font-medium">{req.requestId}</TableCell>
                  <TableCell>{req.type.replace(/_/g, ' ')}</TableCell>
                  <TableCell>{req.itemName}</TableCell>
                  <TableCell>{req.requestedBy}</TableCell>
                  <TableCell>{req.company}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(req.priority)}>
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(req.status)}>
                      {req.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
