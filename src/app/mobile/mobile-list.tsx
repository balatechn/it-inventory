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
  Trash2,
  Smartphone,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate, formatCurrency, statusColors, MOBILE_OPERATORS } from '@/lib/utils';

// Mock data
const mockMobiles = [
  {
    id: '1',
    deviceType: 'Phone',
    manufacturer: 'Samsung',
    model: 'Galaxy S23',
    imei1: '123456789012345',
    simNumber: '8901234567890123456',
    mobileNumber: '9876543210',
    operator: 'AIRTEL',
    planType: 'Corporate',
    monthlyRental: 999,
    status: 'ACTIVE',
    employee: 'John Smith',
    location: 'HO – Bangalore',
    company: 'NCPL',
    allocationDate: '2024-01-15',
  },
  {
    id: '2',
    deviceType: 'Phone',
    manufacturer: 'Apple',
    model: 'iPhone 14',
    imei1: '234567890123456',
    simNumber: '8901234567890123457',
    mobileNumber: '9876543211',
    operator: 'JIO',
    planType: 'Corporate',
    monthlyRental: 1499,
    status: 'ACTIVE',
    employee: 'Jane Doe',
    location: 'Rainland – Bangalore',
    company: 'RAINLAND',
    allocationDate: '2023-11-20',
  },
  {
    id: '3',
    deviceType: 'Dongle',
    manufacturer: 'Airtel',
    model: '4G Hotspot',
    imei1: '345678901234567',
    simNumber: '8901234567890123458',
    mobileNumber: '9876543212',
    operator: 'AIRTEL',
    planType: 'Data Only',
    monthlyRental: 499,
    status: 'ACTIVE',
    employee: 'IT Department',
    location: 'HO – Bangalore',
    company: 'NCPL',
    allocationDate: '2024-02-01',
  },
  {
    id: '4',
    deviceType: 'Tablet',
    manufacturer: 'Apple',
    model: 'iPad Pro',
    imei1: '456789012345678',
    simNumber: '8901234567890123459',
    mobileNumber: '9876543213',
    operator: 'VI',
    planType: 'Data Only',
    monthlyRental: 799,
    status: 'ACTIVE',
    employee: 'Alice Johnson',
    location: 'Rainland – Mangaluru',
    company: 'RAINLAND',
    allocationDate: '2023-08-10',
  },
  {
    id: '5',
    deviceType: 'Phone',
    manufacturer: 'OnePlus',
    model: '11',
    imei1: '567890123456789',
    simNumber: null,
    mobileNumber: null,
    operator: null,
    planType: null,
    monthlyRental: null,
    status: 'RETURNED',
    employee: null,
    location: 'HO – Bangalore',
    company: 'NCPL',
    allocationDate: null,
  },
];

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter mobiles
  const filteredMobiles = mockMobiles.filter((mobile) => {
    const matchesSearch =
      search === '' ||
      mobile.mobileNumber?.includes(search) ||
      mobile.employee?.toLowerCase().includes(search.toLowerCase()) ||
      mobile.model.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || mobile.status === statusFilter;
    const matchesOperator = operatorFilter === '' || mobile.operator === operatorFilter;

    return matchesSearch && matchesStatus && matchesOperator;
  });

  const totalPages = Math.ceil(filteredMobiles.length / itemsPerPage);
  const paginatedMobiles = filteredMobiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats
  const activeCount = mockMobiles.filter((m) => m.status === 'ACTIVE').length;
  const totalRental = mockMobiles
    .filter((m) => m.status === 'ACTIVE' && m.monthlyRental)
    .reduce((acc, m) => acc + (m.monthlyRental || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Mobile Devices & SIM</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage mobile devices, SIM cards, and data plans
          </p>
        </div>
        <Link href="/mobile/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Mobile
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Devices</p>
          <p className="text-2xl font-bold text-[#070B47]">{mockMobiles.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Active Devices</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Monthly Rental</p>
          <p className="text-2xl font-bold text-[#6A89A7]">{formatCurrency(totalRental)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Unallocated</p>
          <p className="text-2xl font-bold text-amber-600">
            {mockMobiles.filter((m) => !m.employee).length}
          </p>
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
                  placeholder="Search by mobile number, employee, model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              />
              <Select
                options={operatorOptions}
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="w-40"
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
              <TableHead>Device</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Operator / Plan</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Monthly Rental</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMobiles.map((mobile) => (
              <TableRow key={mobile.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      {mobile.deviceType === 'Phone' ? (
                        <Smartphone className="h-5 w-5 text-green-600" />
                      ) : (
                        <Phone className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#070B47]">
                        {mobile.manufacturer} {mobile.model}
                      </p>
                      <p className="text-xs text-gray-500">{mobile.deviceType}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {mobile.mobileNumber ? (
                    <p className="font-mono">{mobile.mobileNumber}</p>
                  ) : (
                    <span className="text-gray-400 italic">No SIM</span>
                  )}
                </TableCell>
                <TableCell>
                  {mobile.operator ? (
                    <div>
                      <Badge variant="outline">{mobile.operator}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{mobile.planType}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {mobile.employee || (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{mobile.location}</p>
                  <p className="text-xs text-gray-500">{mobile.company}</p>
                </TableCell>
                <TableCell>
                  {mobile.monthlyRental ? (
                    <p className="font-medium">{formatCurrency(mobile.monthlyRental)}/mo</p>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[mobile.status]}>
                    {mobile.status}
                  </Badge>
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
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
