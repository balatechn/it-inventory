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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { statusColors, PRODUCT_TYPES, formatDate, formatCurrency } from '@/lib/utils';

// Mock data
const mockSystems = [
  {
    id: '1',
    assetTag: 'AST-00001',
    productType: 'LAPTOP',
    manufacturer: 'Dell',
    model: 'Latitude 5520',
    serialNumber: 'ABC123XYZ',
    status: 'ACTIVE',
    currentUser: 'John Smith',
    location: 'HO – Bangalore',
    company: 'NCPL',
    purchaseDate: '2024-01-15',
    warrantyEndDate: '2027-01-15',
    purchasePrice: 85000,
  },
  {
    id: '2',
    assetTag: 'AST-00002',
    productType: 'DESKTOP',
    manufacturer: 'HP',
    model: 'ProDesk 400 G7',
    serialNumber: 'DEF456UVW',
    status: 'ACTIVE',
    currentUser: 'Jane Doe',
    location: 'Rainland – Bangalore',
    company: 'RAINLAND',
    purchaseDate: '2023-06-20',
    warrantyEndDate: '2026-06-20',
    purchasePrice: 65000,
  },
  {
    id: '3',
    assetTag: 'AST-00003',
    productType: 'LAPTOP',
    manufacturer: 'Lenovo',
    model: 'ThinkPad T14',
    serialNumber: 'GHI789RST',
    status: 'IN_STOCK',
    currentUser: null,
    location: 'HO – Bangalore',
    company: 'NCPL',
    purchaseDate: '2024-03-10',
    warrantyEndDate: '2027-03-10',
    purchasePrice: 92000,
  },
  {
    id: '4',
    assetTag: 'AST-00004',
    productType: 'PRINTER',
    manufacturer: 'Canon',
    model: 'imageRUNNER 2625i',
    serialNumber: 'JKL012OPQ',
    status: 'ACTIVE',
    currentUser: 'IT Department',
    location: 'HO – Bangalore',
    company: 'NCPL',
    purchaseDate: '2023-09-05',
    warrantyEndDate: '2025-09-05',
    purchasePrice: 125000,
  },
  {
    id: '5',
    assetTag: 'AST-00005',
    productType: 'SERVER',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    serialNumber: 'MNO345LMN',
    status: 'ACTIVE',
    currentUser: 'Server Room',
    location: 'HO – Bangalore',
    company: 'NCPL',
    purchaseDate: '2022-12-01',
    warrantyEndDate: '2025-12-01',
    purchasePrice: 450000,
  },
  {
    id: '6',
    assetTag: 'AST-00006',
    productType: 'LAPTOP',
    manufacturer: 'Dell',
    model: 'Latitude 3520',
    serialNumber: 'PQR678IJK',
    status: 'MAINTENANCE',
    currentUser: 'Alice Johnson',
    location: 'Rainland – Mangaluru',
    company: 'RAINLAND',
    purchaseDate: '2023-04-18',
    warrantyEndDate: '2026-04-18',
    purchasePrice: 72000,
  },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'DISPOSED', label: 'Disposed' },
];

const productTypeOptions = [
  { value: '', label: 'All Types' },
  ...PRODUCT_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

export function SystemsList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter systems
  const filteredSystems = mockSystems.filter((system) => {
    const matchesSearch =
      search === '' ||
      system.assetTag.toLowerCase().includes(search.toLowerCase()) ||
      system.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      system.model.toLowerCase().includes(search.toLowerCase()) ||
      system.currentUser?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || system.status === statusFilter;
    const matchesType = typeFilter === '' || system.productType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredSystems.length / itemsPerPage);
  const paginatedSystems = filteredSystems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Systems Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage hardware assets across all locations
          </p>
        </div>
        <Link href="/systems/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add System
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by asset tag, manufacturer, model, user..."
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
                options={productTypeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-40"
              />
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>
          Showing {paginatedSystems.length} of {filteredSystems.length} systems
        </p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Active: {mockSystems.filter((s) => s.status === 'ACTIVE').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            In Stock: {mockSystems.filter((s) => s.status === 'IN_STOCK').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Maintenance: {mockSystems.filter((s) => s.status === 'MAINTENANCE').length}
          </span>
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSystems.map((system) => (
              <TableRow key={system.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#070B47]/10 flex items-center justify-center">
                      <Monitor className="h-5 w-5 text-[#070B47]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#070B47]">{system.assetTag}</p>
                      <p className="text-xs text-gray-500">{system.serialNumber}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{system.productType}</Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{system.manufacturer}</p>
                  <p className="text-sm text-gray-500">{system.model}</p>
                </TableCell>
                <TableCell>
                  {system.currentUser || (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{system.location}</p>
                  <p className="text-xs text-gray-500">{system.company}</p>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[system.status]}>
                    {system.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatDate(system.warrantyEndDate)}</p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(system.purchasePrice)}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/systems/${system.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/systems/${system.id}/edit`}>
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
