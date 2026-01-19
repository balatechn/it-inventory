'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileSpreadsheet,
  Filter,
  BarChart3,
  PieChart,
  FileText,
  Printer,
} from 'lucide-react';

// Mock data for reports
const reportTypes = [
  { id: 'asset-inventory', name: 'Asset Inventory Report', icon: FileText },
  { id: 'software-licenses', name: 'Software Licenses Report', icon: FileSpreadsheet },
  { id: 'mobile-expenses', name: 'Mobile & SIM Expenses Report', icon: BarChart3 },
  { id: 'asset-allocation', name: 'Asset Allocation Report', icon: PieChart },
  { id: 'warranty-expiry', name: 'Warranty Expiry Report', icon: FileText },
  { id: 'license-expiry', name: 'License Expiry Report', icon: FileSpreadsheet },
  { id: 'depreciation', name: 'Depreciation Report', icon: BarChart3 },
  { id: 'maintenance', name: 'Maintenance Schedule Report', icon: FileText },
];

const companies = [
  { id: '', name: 'All Companies' },
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const locations = [
  { id: '', name: 'All Locations' },
  { id: '1', name: 'Ludhiana HQ' },
  { id: '2', name: 'Delhi Office' },
  { id: '3', name: 'Mumbai Office' },
  { id: '4', name: 'Bangalore Office' },
];

// Mock report data
const mockAssetData = [
  {
    id: '1',
    assetTag: 'ISKY-LP-001',
    productType: 'Laptop',
    model: 'Dell Latitude 5520',
    company: 'ISKY',
    location: 'Ludhiana HQ',
    status: 'ACTIVE',
    assignedTo: 'John Doe',
    purchaseDate: '2023-01-15',
    purchaseCost: 75000,
    warrantyExpiry: '2026-01-15',
  },
  {
    id: '2',
    assetTag: 'NCPL-DT-001',
    productType: 'Desktop',
    model: 'HP ProDesk 400',
    company: 'NCPL',
    location: 'Delhi Office',
    status: 'ACTIVE',
    assignedTo: 'Jane Smith',
    purchaseDate: '2022-08-20',
    purchaseCost: 55000,
    warrantyExpiry: '2025-08-20',
  },
  {
    id: '3',
    assetTag: 'NIPL-LP-001',
    productType: 'Laptop',
    model: 'Lenovo ThinkPad T14',
    company: 'NIPL',
    location: 'Mumbai Office',
    status: 'IN_REPAIR',
    assignedTo: 'Bob Johnson',
    purchaseDate: '2023-03-10',
    purchaseCost: 82000,
    warrantyExpiry: '2026-03-10',
  },
  {
    id: '4',
    assetTag: 'NRPL-PR-001',
    productType: 'Printer',
    model: 'HP LaserJet Pro',
    company: 'NRPL',
    location: 'Bangalore Office',
    status: 'ACTIVE',
    assignedTo: 'Shared',
    purchaseDate: '2022-12-01',
    purchaseCost: 35000,
    warrantyExpiry: '2024-12-01',
  },
];

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  IN_REPAIR: 'warning',
  DISPOSED: 'destructive',
  IN_STOCK: 'default',
};

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('asset-inventory');
  const [filters, setFilters] = useState({
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1000);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // In real implementation, this would trigger a download
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalValue = mockAssetData.reduce((sum, asset) => sum + asset.purchaseCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600">Generate and export comprehensive reports</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Report Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report.id);
                    setShowReport(false);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedReport === report.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 mb-2 ${
                      selectedReport === report.id ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      selectedReport === report.id ? 'text-primary' : 'text-gray-700'
                    }`}
                  >
                    {report.name}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select
                id="company"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                id="location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="IN_REPAIR">In Repair</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="DISPOSED">Disposed</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {showReport && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {reportTypes.find((r) => r.id === selectedReport)?.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Generated on {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-primary">{mockAssetData.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Active Assets</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockAssetData.filter((a) => a.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{totalValue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Avg. Asset Value</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{Math.round(totalValue / mockAssetData.length).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
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
                    <TableHead className="text-right">Purchase Cost</TableHead>
                    <TableHead>Warranty Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssetData.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.assetTag}</TableCell>
                      <TableCell>{asset.productType}</TableCell>
                      <TableCell>{asset.model}</TableCell>
                      <TableCell>{asset.company}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{asset.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[asset.status] || 'default'}>
                          {asset.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{asset.purchaseCost.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {new Date(asset.warrantyExpiry).toLocaleDateString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer Summary */}
            <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
              <span>Showing {mockAssetData.length} records</span>
              <span>
                Total Value: <strong>₹{totalValue.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
