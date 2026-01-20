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
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { formatDate, formatCurrency, getDaysUntilExpiry, SOFTWARE_CATEGORIES, LICENSE_TYPES } from '@/lib/utils';

interface Software {
  id: string;
  name: string;
  version?: string;
  publisher?: string;
  category: string;
  licenseType: string;
  totalLicenses: number;
  usedLicenses: number;
  costPerLicense?: number;
  totalCost?: number;
  expiryDate?: string | null;
  company?: { name: string; code: string } | null;
  isActive: boolean;
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...SOFTWARE_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

const licenseTypeOptions = [
  { value: '', label: 'All License Types' },
  ...LICENSE_TYPES.map((l) => ({ value: l.value, label: l.label })),
];

export function SoftwareList() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSoftware();
  }, [currentPage, categoryFilter, licenseFilter]);

  const fetchSoftware = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (categoryFilter) params.append('category', categoryFilter);
      if (licenseFilter) params.append('licenseType', licenseFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/software?${params}`);
      const data = await response.json();
      
      if (data.data) {
        setSoftware(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching software:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSoftware();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software?')) return;
    
    try {
      const response = await fetch(`/api/software/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSoftware();
      }
    } catch (error) {
      console.error('Error deleting software:', error);
    }
  };

  const getExpiryBadge = (expiryDate: string | null | undefined) => {
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
    const percentage = total > 0 ? (used / total) * 100 : 0;
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
  const totalLicenses = software.reduce((acc, sw) => acc + sw.totalLicenses, 0);
  const usedLicenses = software.reduce((acc, sw) => acc + sw.usedLicenses, 0);
  const expiringCount = software.filter((sw) => {
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
          <p className="text-2xl font-bold text-[#070B47]">{total}</p>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-44"
              />
              <Select
                options={licenseTypeOptions}
                value={licenseFilter}
                onChange={(e) => {
                  setLicenseFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-44"
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
        ) : software.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No software found</p>
            <Link href="/software/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Software
              </Button>
            </Link>
          </div>
        ) : (
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
              {software.map((sw) => (
                <TableRow key={sw.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#6A89A7]/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-[#6A89A7]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#070B47]">{sw.name}</p>
                        <p className="text-xs text-gray-500">{sw.publisher || '-'} {sw.version ? `• v${sw.version}` : ''}</p>
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
                    <p className="font-medium">{sw.totalCost ? formatCurrency(sw.totalCost) : '-'}</p>
                    <p className="text-xs text-gray-500">
                      {sw.costPerLicense ? `${formatCurrency(sw.costPerLicense)}/license` : '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    {getExpiryBadge(sw.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sw.company?.code || '-'}</Badge>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(sw.id)}
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
