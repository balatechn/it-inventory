'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const companies = [
  { id: '', name: 'All Companies' },
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const mockDevices = [
  { id: '1', brand: 'Apple', model: 'iPhone 14 Pro', imei: '123456789012345', status: 'ASSIGNED', company: 'ISKY', assignedTo: 'John Doe', simNumber: '+91 98765 43210' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S23', imei: '234567890123456', status: 'ASSIGNED', company: 'NCPL', assignedTo: 'Jane Smith', simNumber: '+91 98765 43211' },
  { id: '3', brand: 'OnePlus', model: '11 5G', imei: '345678901234567', status: 'IN_STOCK', company: 'NIPL', assignedTo: '-', simNumber: '-' },
  { id: '4', brand: 'Apple', model: 'iPhone 13', imei: '456789012345678', status: 'ASSIGNED', company: 'ISKY', assignedTo: 'Mike Johnson', simNumber: '+91 98765 43212' },
  { id: '5', brand: 'Samsung', model: 'Galaxy A54', imei: '567890123456789', status: 'UNDER_REPAIR', company: 'NRPL', assignedTo: '-', simNumber: '-' },
];

export default function MobileReportPage() {
  const [filters, setFilters] = useState({ company: '', status: '', search: '' });

  const filteredDevices = mockDevices.filter((device) => {
    if (filters.company && device.company !== companies.find(c => c.id === filters.company)?.name) return false;
    if (filters.status && device.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!device.brand.toLowerCase().includes(searchLower) && 
          !device.model.toLowerCase().includes(searchLower) &&
          !device.imei.includes(filters.search)) return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'success';
      case 'IN_STOCK': return 'default';
      case 'UNDER_REPAIR': return 'warning';
      case 'RETIRED': return 'destructive';
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
          <h1 className="text-2xl font-bold text-[#070B47]">Mobile Devices Report</h1>
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
                placeholder="Brand, model, IMEI..." 
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
                <option value="IN_STOCK">In Stock</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNDER_REPAIR">Under Repair</option>
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
            <span>Results ({filteredDevices.length} devices)</span>
            <Smartphone className="h-5 w-5 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>IMEI</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>SIM Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.brand}</TableCell>
                  <TableCell>{device.model}</TableCell>
                  <TableCell className="font-mono text-sm">{device.imei}</TableCell>
                  <TableCell>{device.company}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(device.status)}>
                      {device.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.assignedTo}</TableCell>
                  <TableCell>{device.simNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
