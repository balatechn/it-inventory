'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const companies = [
  { id: '', name: 'All Companies' },
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const mockSystems = [
  { id: '1', assetTag: 'SYS-001', productType: 'LAPTOP', model: 'ThinkPad T14', company: 'ISKY', location: 'Ludhiana HQ', status: 'ACTIVE', assignedTo: 'John Doe' },
  { id: '2', assetTag: 'SYS-002', productType: 'DESKTOP', model: 'OptiPlex 7090', company: 'NCPL', location: 'Delhi Office', status: 'ACTIVE', assignedTo: 'Jane Smith' },
  { id: '3', assetTag: 'SYS-003', productType: 'LAPTOP', model: 'HP ProBook', company: 'NIPL', location: 'Mumbai Office', status: 'IN_STOCK', assignedTo: '-' },
  { id: '4', assetTag: 'SYS-004', productType: 'SERVER', model: 'Dell PowerEdge', company: 'ISKY', location: 'Ludhiana HQ', status: 'ACTIVE', assignedTo: 'Server Room' },
  { id: '5', assetTag: 'SYS-005', productType: 'LAPTOP', model: 'MacBook Pro', company: 'NRPL', location: 'Bangalore Office', status: 'MAINTENANCE', assignedTo: 'Mike Johnson' },
];

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  IN_STOCK: 'default',
  MAINTENANCE: 'warning',
  RETIRED: 'destructive',
};

export default function SystemsReportPage() {
  const [filters, setFilters] = useState({ company: '', status: '', search: '' });

  const filteredSystems = mockSystems.filter((system) => {
    if (filters.company && system.company !== companies.find(c => c.id === filters.company)?.name) return false;
    if (filters.status && system.status !== filters.status) return false;
    if (filters.search && !system.assetTag.toLowerCase().includes(filters.search.toLowerCase()) && 
        !system.model.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#070B47]">Systems Report</h1>
        </div>
        <Button className="bg-[#070B47]">
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <Input 
                placeholder="Asset tag, model..." 
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
                <option value="ACTIVE">Active</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({ company: '', status: '', search: '' })}>
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
            <span>Results ({filteredSystems.length} systems)</span>
            <FileSpreadsheet className="h-5 w-5 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSystems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.assetTag}</TableCell>
                  <TableCell>{system.productType}</TableCell>
                  <TableCell>{system.model}</TableCell>
                  <TableCell>{system.company}</TableCell>
                  <TableCell>{system.location}</TableCell>
                  <TableCell>{system.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[system.status] || 'default'}>
                      {system.status.replace('_', ' ')}
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
