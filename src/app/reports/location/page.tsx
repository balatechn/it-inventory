'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Download, MapPin, Filter, ArrowLeft, Monitor, Smartphone, FileText } from 'lucide-react';
import Link from 'next/link';

const companies = [
  { id: '', name: 'All Companies' },
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const mockLocations = [
  { id: '1', name: 'Head Office - Chennai', company: 'ISKY', address: '123 Mount Road, Chennai', systems: 45, mobiles: 12, software: 150 },
  { id: '2', name: 'Branch Office - Mumbai', company: 'NCPL', address: '456 Marine Drive, Mumbai', systems: 30, mobiles: 8, software: 90 },
  { id: '3', name: 'Warehouse - Bangalore', company: 'NIPL', address: '789 Electronic City, Bangalore', systems: 15, mobiles: 5, software: 45 },
  { id: '4', name: 'Regional Office - Delhi', company: 'NRPL', address: '321 Connaught Place, Delhi', systems: 25, mobiles: 6, software: 75 },
  { id: '5', name: 'Service Center - Hyderabad', company: 'Rainland Auto Corp', address: '654 HITEC City, Hyderabad', systems: 20, mobiles: 10, software: 60 },
];

export default function LocationReportPage() {
  const [filters, setFilters] = useState({ company: '', search: '' });

  const filteredLocations = mockLocations.filter((loc) => {
    if (filters.company && loc.company !== companies.find(c => c.id === filters.company)?.name) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!loc.name.toLowerCase().includes(searchLower) && 
          !loc.address.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });

  const totals = filteredLocations.reduce((acc, loc) => ({
    systems: acc.systems + loc.systems,
    mobiles: acc.mobiles + loc.mobiles,
    software: acc.software + loc.software,
  }), { systems: 0, mobiles: 0, software: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#070B47]">Location-wise Asset Report</h1>
        </div>
        <Button className="bg-[#070B47]">
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Systems</p>
                <p className="text-2xl font-bold text-[#070B47]">{totals.systems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Mobiles</p>
                <p className="text-2xl font-bold text-[#070B47]">{totals.mobiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Software Licenses</p>
                <p className="text-2xl font-bold text-[#070B47]">{totals.software}</p>
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Search</Label>
              <Input 
                placeholder="Location name or address..." 
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
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({ company: '', search: '' })}>
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
            <span>Results ({filteredLocations.length} locations)</span>
            <MapPin className="h-5 w-5 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Systems</TableHead>
                <TableHead className="text-center">Mobiles</TableHead>
                <TableHead className="text-center">Software</TableHead>
                <TableHead className="text-center">Total Assets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.name}</TableCell>
                  <TableCell>{loc.company}</TableCell>
                  <TableCell className="text-sm text-gray-500">{loc.address}</TableCell>
                  <TableCell className="text-center">{loc.systems}</TableCell>
                  <TableCell className="text-center">{loc.mobiles}</TableCell>
                  <TableCell className="text-center">{loc.software}</TableCell>
                  <TableCell className="text-center font-bold">{loc.systems + loc.mobiles + loc.software}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
