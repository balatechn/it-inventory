'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Monitor, Calendar, MapPin, User, Building, DollarSign } from 'lucide-react';
import { statusColors, formatDate, formatCurrency } from '@/lib/utils';

// Mock data - same as in systems-list
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
    department: 'IT Department',
    purchaseDate: '2024-01-15',
    warrantyEndDate: '2027-01-15',
    purchasePrice: 85000,
    processor: 'Intel Core i7-1165G7',
    ram: '16 GB',
    storage: '512 GB SSD',
    os: 'Windows 11 Pro',
    notes: 'Primary work laptop for development team',
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
    department: 'Sales',
    purchaseDate: '2023-06-20',
    warrantyEndDate: '2026-06-20',
    purchasePrice: 65000,
    processor: 'Intel Core i5-10500',
    ram: '8 GB',
    storage: '256 GB SSD',
    os: 'Windows 10 Pro',
    notes: '',
  },
];

export default function SystemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const system = mockSystems.find(s => s.id === id);

  if (!system) {
    return (
      <div className="space-y-6">
        <Link href="/systems" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Systems
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">System not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/systems" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#070B47]">{system.assetTag}</h1>
            <p className="text-gray-500">{system.manufacturer} {system.model}</p>
          </div>
        </div>
        <Link href={`/systems/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit System
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset Tag</p>
                <p className="font-medium">{system.assetTag}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{system.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Type</p>
                <Badge variant="outline">{system.productType}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={statusColors[system.status]}>
                  {system.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p className="font-medium">{system.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{system.model}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Processor</p>
                <p className="font-medium">{system.processor || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RAM</p>
                <p className="font-medium">{system.ram || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Storage</p>
                <p className="font-medium">{system.storage || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Operating System</p>
                <p className="font-medium">{system.os || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {system.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{system.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current User</p>
                <p className="font-medium">{system.currentUser || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{system.department || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{system.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{system.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Purchase & Warranty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{formatDate(system.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Warranty End Date</p>
                <p className="font-medium">{formatDate(system.warrantyEndDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="font-medium">{formatCurrency(system.purchasePrice)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
