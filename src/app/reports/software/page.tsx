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

const mockSoftware = [
  { id: '1', name: 'Microsoft 365', category: 'OFFICE_SUITE', licenseType: 'SUBSCRIPTION', totalLicenses: 100, usedLicenses: 85, company: 'ISKY', expiryDate: '2026-12-31' },
  { id: '2', name: 'Adobe Creative Cloud', category: 'DESIGN', licenseType: 'SUBSCRIPTION', totalLicenses: 20, usedLicenses: 18, company: 'NCPL', expiryDate: '2026-06-15' },
  { id: '3', name: 'Windows 11 Pro', category: 'OPERATING_SYSTEM', licenseType: 'PERPETUAL', totalLicenses: 150, usedLicenses: 120, company: 'NIPL', expiryDate: '-' },
  { id: '4', name: 'Kaspersky Endpoint', category: 'ANTIVIRUS', licenseType: 'SUBSCRIPTION', totalLicenses: 200, usedLicenses: 180, company: 'ISKY', expiryDate: '2026-03-01' },
  { id: '5', name: 'AutoCAD', category: 'DESIGN', licenseType: 'SUBSCRIPTION', totalLicenses: 10, usedLicenses: 8, company: 'NRPL', expiryDate: '2026-09-30' },
];

export default function SoftwareReportPage() {
  const [filters, setFilters] = useState({ company: '', category: '', search: '' });

  const filteredSoftware = mockSoftware.filter((sw) => {
    if (filters.company && sw.company !== companies.find(c => c.id === filters.company)?.name) return false;
    if (filters.category && sw.category !== filters.category) return false;
    if (filters.search && !sw.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#070B47]">Software & Licenses Report</h1>
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
                placeholder="Software name..." 
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
              <Label>Category</Label>
              <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All Categories</option>
                <option value="OPERATING_SYSTEM">Operating System</option>
                <option value="OFFICE_SUITE">Office Suite</option>
                <option value="ANTIVIRUS">Antivirus</option>
                <option value="DESIGN">Design</option>
                <option value="DEVELOPMENT">Development</option>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => setFilters({ company: '', category: '', search: '' })}>
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
            <span>Results ({filteredSoftware.length} software)</span>
            <FileSpreadsheet className="h-5 w-5 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Software Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Total Licenses</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSoftware.map((sw) => (
                <TableRow key={sw.id}>
                  <TableCell className="font-medium">{sw.name}</TableCell>
                  <TableCell>{sw.category.replace('_', ' ')}</TableCell>
                  <TableCell>{sw.licenseType}</TableCell>
                  <TableCell>{sw.company}</TableCell>
                  <TableCell>{sw.totalLicenses}</TableCell>
                  <TableCell>{sw.usedLicenses}</TableCell>
                  <TableCell>
                    <Badge variant={sw.totalLicenses - sw.usedLicenses > 5 ? 'success' : 'warning'}>
                      {sw.totalLicenses - sw.usedLicenses}
                    </Badge>
                  </TableCell>
                  <TableCell>{sw.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
