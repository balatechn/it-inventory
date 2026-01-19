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
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntilExpiry, SOFTWARE_CATEGORIES, LICENSE_TYPES } from '@/lib/utils';

// Mock data
const mockSoftware = [
  {
    id: '1',
    name: 'Microsoft 365 Business',
    version: 'Latest',
    publisher: 'Microsoft',
    category: 'OFFICE_SUITE',
    licenseType: 'SUBSCRIPTION',
    totalLicenses: 50,
    usedLicenses: 45,
    costPerLicense: 850,
    totalCost: 42500,
    expiryDate: '2026-03-15',
    company: 'NCPL',
    isActive: true,
  },
  {
    id: '2',
    name: 'Windows 11 Pro',
    version: '22H2',
    publisher: 'Microsoft',
    category: 'OPERATING_SYSTEM',
    licenseType: 'PERPETUAL',
    totalLicenses: 100,
    usedLicenses: 89,
    costPerLicense: 12500,
    totalCost: 1250000,
    expiryDate: null,
    company: 'NCPL',
    isActive: true,
  },
  {
    id: '3',
    name: 'Norton Antivirus',
    version: '2024',
    publisher: 'Symantec',
    category: 'ANTIVIRUS',
    licenseType: 'SUBSCRIPTION',
    totalLicenses: 75,
    usedLicenses: 68,
    costPerLicense: 450,
    totalCost: 33750,
    expiryDate: '2026-02-01',
    company: 'RAINLAND',
    isActive: true,
  },
  {
    id: '4',
    name: 'AutoCAD',
    version: '2024',
    publisher: 'Autodesk',
    category: 'DESIGN',
    licenseType: 'SUBSCRIPTION',
    totalLicenses: 5,
    usedLicenses: 5,
    costPerLicense: 85000,
    totalCost: 425000,
    expiryDate: '2026-01-30',
    company: 'RAINLAND',
    isActive: true,
  },
  {
    id: '5',
    name: 'Tally Prime',
    version: '3.0',
    publisher: 'Tally Solutions',
    category: 'ACCOUNTING',
    licenseType: 'PERPETUAL',
    totalLicenses: 10,
    usedLicenses: 8,
    costPerLicense: 54000,
    totalCost: 540000,
    expiryDate: null,
    company: 'NCPL',
    isActive: true,
  },
  {
    id: '6',
    name: 'Adobe Creative Cloud',
    version: '2024',
    publisher: 'Adobe',
    category: 'DESIGN',
    licenseType: 'SUBSCRIPTION',
    totalLicenses: 3,
    usedLicenses: 3,
    costPerLicense: 28000,
    totalCost: 84000,
    expiryDate: '2026-06-15',
    company: 'ISKY',
    isActive: true,
  },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...SOFTWARE_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

const licenseTypeOptions = [
  { value: '', label: 'All License Types' },
  ...LICENSE_TYPES.map((l) => ({ value: l.value, label: l.label })),
];

export function SoftwareList() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter software
  const filteredSoftware = mockSoftware.filter((sw) => {
    const matchesSearch =
      search === '' ||
      sw.name.toLowerCase().includes(search.toLowerCase()) ||
      sw.publisher.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === '' || sw.category === categoryFilter;
    const matchesLicense = licenseFilter === '' || sw.licenseType === licenseFilter;

    return matchesSearch && matchesCategory && matchesLicense;
  });

  const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage);
  const paginatedSoftware = filteredSoftware.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getExpiryBadge = (expiryDate: string | null) => {
    if (!expiryDate) {
      return <Badge variant="outline">Perpetual</Badge>;
    }
    const daysUntil = getDaysUntilExpiry(expiryDate);
    if (daysUntil === null) return null;
    if (daysUntil < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (daysUntil <= 30) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {daysUntil} days
        </Badge>
      );
    }
    return <Badge variant="success">{formatDate(expiryDate)}</Badge>;
  };

  const getLicenseUsage = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    let color = 'bg-green-500';
    if (percentage >= 90) color = 'bg-red-500';
    else if (percentage >= 75) color = 'bg-amber-500';

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>{used} / {total}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  // Calculate summary stats
  const totalLicenses = mockSoftware.reduce((acc, sw) => acc + sw.totalLicenses, 0);
  const usedLicenses = mockSoftware.reduce((acc, sw) => acc + sw.usedLicenses, 0);
  const expiringCount = mockSoftware.filter((sw) => {
    if (!sw.expiryDate) return false;
    const days = getDaysUntilExpiry(sw.expiryDate);
    return days !== null && days <= 30 && days >= 0;
  }).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Software & Licenses</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage software licenses and subscriptions
          </p>
        </div>
        <Link href="/software/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Software
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Software</p>
          <p className="text-2xl font-bold text-[#070B47]">{mockSoftware.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Licenses</p>
          <p className="text-2xl font-bold text-[#070B47]">{totalLicenses}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Used Licenses</p>
          <p className="text-2xl font-bold text-[#6A89A7]">{usedLicenses}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
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
                  placeholder="Search by software name, publisher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-44"
              />
              <Select
                options={licenseTypeOptions}
                value={licenseFilter}
                onChange={(e) => setLicenseFilter(e.target.value)}
                className="w-44"
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
              <TableHead>Software</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>License Type</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSoftware.map((sw) => (
              <TableRow key={sw.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#6A89A7]/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-[#6A89A7]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#070B47]">{sw.name}</p>
                      <p className="text-xs text-gray-500">{sw.publisher} • v{sw.version}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {SOFTWARE_CATEGORIES.find((c) => c.value === sw.category)?.label || sw.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={sw.licenseType === 'SUBSCRIPTION' ? 'secondary' : 'default'}>
                    {sw.licenseType}
                  </Badge>
                </TableCell>
                <TableCell className="w-32">
                  {getLicenseUsage(sw.usedLicenses, sw.totalLicenses)}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{formatCurrency(sw.totalCost)}</p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(sw.costPerLicense)}/license
                  </p>
                </TableCell>
                <TableCell>
                  {getExpiryBadge(sw.expiryDate)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{sw.company}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/software/${sw.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/software/${sw.id}/edit`}>
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
