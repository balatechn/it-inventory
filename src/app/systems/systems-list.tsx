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
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { statusColors, PRODUCT_TYPES, formatDate, formatCurrency } from '@/lib/utils';

interface System {
  id: string;
  assetTag: string;
  productType: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status: string;
  currentUser?: { firstName: string; lastName: string } | null;
  location?: { name: string } | null;
  company?: { name: string; code: string } | null;
  purchaseDate?: string;
  warrantyEndDate?: string;
  purchasePrice?: number;
}

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
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSystems();
  }, [currentPage, statusFilter, typeFilter]);

  const fetchSystems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('productType', typeFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/systems?${params}`);
      const data = await response.json();
      
      if (data.data) {
        setSystems(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSystems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this system?')) return;
    
    try {
      const response = await fetch(`/api/systems/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSystems();
      }
    } catch (error) {
      console.error('Error deleting system:', error);
    }
  };

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
                  placeholder="Search by asset tag, manufacturer, model..."
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
                options={productTypeOptions}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
              <Button variant="outline" onClick={handleSearch}>
                <Filter className="h-4 w-4" />
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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>
          {loading ? 'Loading...' : `Showing ${systems.length} of ${total} systems`}
        </p>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#070B47]" />
          </div>
        ) : systems.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No systems found</p>
            <Link href="/systems/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First System
              </Button>
            </Link>
          </div>
        ) : (
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
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#070B47]/10 flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-[#070B47]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#070B47]">{system.assetTag}</p>
                        <p className="text-xs text-gray-500">{system.serialNumber || '-'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{system.productType}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{system.manufacturer || '-'}</p>
                    <p className="text-sm text-gray-500">{system.model || '-'}</p>
                  </TableCell>
                  <TableCell>
                    {system.currentUser ? (
                      `${system.currentUser.firstName} ${system.currentUser.lastName}`
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{system.location?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{system.company?.code || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[system.status] || ''}>
                      {system.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{system.warrantyEndDate ? formatDate(system.warrantyEndDate) : '-'}</p>
                    <p className="text-xs text-gray-500">
                      {system.purchasePrice ? formatCurrency(system.purchasePrice) : '-'}
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(system.id)}
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
