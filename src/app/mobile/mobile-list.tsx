'use client';

import { useState, useEffect } from 'react';
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
  Trash2,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { formatDate, formatCurrency, statusColors, MOBILE_OPERATORS } from '@/lib/utils';

interface Mobile {
  id: string;
  deviceType?: string;
  manufacturer?: string;
  model?: string;
  imei1?: string;
  simNumber?: string;
  mobileNumber?: string;
  operator?: string;
  planType?: string;
  monthlyRental?: number;
  status: string;
  employee?: { firstName: string; lastName: string } | null;
  location?: { name: string } | null;
  company?: { name: string; code: string } | null;
  allocationDate?: string;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'LOST', label: 'Lost' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'RETURNED', label: 'Returned' },
];

const operatorOptions = [
  { value: '', label: 'All Operators' },
  ...MOBILE_OPERATORS.map((o) => ({ value: o.value, label: o.label })),
];

export function MobileList() {
  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMobiles();
  }, [currentPage, statusFilter, operatorFilter]);

  const fetchMobiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (operatorFilter) params.append('operator', operatorFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/mobile?${params}`);
      const data = await response.json();
      
      if (data.data) {
        setMobiles(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMobiles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mobile device?')) return;
    
    try {
      const response = await fetch(`/api/mobile/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMobiles();
      }
    } catch (error) {
      console.error('Error deleting mobile:', error);
    }
  };

  // Calculate summary stats
  const activeCount = mobiles.filter((m) => m.status === 'ACTIVE').length;
  const totalRental = mobiles.reduce((acc, m) => acc + (m.monthlyRental || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Mobile & SIM Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage mobile devices and SIM allocations
          </p>
        </div>
        <Link href="/mobile/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Devices</p>
          <p className="text-2xl font-bold text-[#070B47]">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Inactive/Other</p>
          <p className="text-2xl font-bold text-gray-600">{mobiles.length - activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Monthly Rental</p>
          <p className="text-2xl font-bold text-[#6A89A7]">{formatCurrency(totalRental)}</p>
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
                  placeholder="Search by IMEI, mobile number, model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
              <Select
                options={operatorOptions}
                value={operatorFilter}
                onChange={(e) => {
                  setOperatorFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                Search
              </Button>
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#070B47]" />
          </div>
        ) : mobiles.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No mobile devices found</p>
            <Link href="/mobile/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Device
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>IMEI / SIM</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rental</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mobiles.map((mobile) => (
                <TableRow key={mobile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#070B47]/10 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-[#070B47]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#070B47]">{mobile.manufacturer} {mobile.model}</p>
                        <p className="text-xs text-gray-500">{mobile.deviceType || 'Phone'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-mono">{mobile.imei1 || '-'}</p>
                    <p className="text-xs text-gray-500 font-mono">{mobile.simNumber || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{mobile.mobileNumber || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {MOBILE_OPERATORS.find((o) => o.value === mobile.operator)?.label || mobile.operator || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {mobile.employee ? (
                      <div>
                        <p className="text-sm">{mobile.employee.firstName} {mobile.employee.lastName}</p>
                        <p className="text-xs text-gray-500">{mobile.company?.code || '-'}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[mobile.status] || ''}>
                      {mobile.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{mobile.monthlyRental ? formatCurrency(mobile.monthlyRental) : '-'}</p>
                    <p className="text-xs text-gray-500">{mobile.planType || '-'}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/mobile/${mobile.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/mobile/${mobile.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(mobile.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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
