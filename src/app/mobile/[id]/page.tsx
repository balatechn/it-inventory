'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Smartphone, Calendar, MapPin, User, Building, CreditCard } from 'lucide-react';
import { statusColors, formatDate, formatCurrency } from '@/lib/utils';

// Mock data
const mockMobiles = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    imei: '123456789012345',
    serialNumber: 'F2LXXX123ABC',
    status: 'ASSIGNED',
    currentUser: 'John Doe',
    company: 'ISKY',
    location: 'Ludhiana HQ',
    department: 'Management',
    phoneNumber: '+91 98765 43210',
    simProvider: 'Airtel',
    simNumber: '8901234567890123456',
    purchaseDate: '2023-09-15',
    warrantyEndDate: '2024-09-15',
    purchasePrice: 129900,
    color: 'Space Black',
    storage: '256 GB',
    notes: 'Executive device with premium support',
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    imei: '234567890123456',
    serialNumber: 'R5CXXX456DEF',
    status: 'ASSIGNED',
    currentUser: 'Jane Smith',
    company: 'NCPL',
    location: 'Delhi Office',
    department: 'Sales',
    phoneNumber: '+91 98765 43211',
    simProvider: 'Jio',
    simNumber: '8901234567890123457',
    purchaseDate: '2023-11-20',
    warrantyEndDate: '2024-11-20',
    purchasePrice: 124999,
    color: 'Phantom Black',
    storage: '512 GB',
    notes: '',
  },
];

export default function MobileDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const mobile = mockMobiles.find(m => m.id === id);

  if (!mobile) {
    return (
      <div className="space-y-6">
        <Link href="/mobile" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Mobile Devices
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Mobile device not found</p>
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
          <Link href="/mobile" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#070B47]">{mobile.brand} {mobile.model}</h1>
            <p className="text-gray-500">IMEI: {mobile.imei}</p>
          </div>
        </div>
        <Link href={`/mobile/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Device
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{mobile.brand}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{mobile.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IMEI</p>
                <p className="font-mono text-sm">{mobile.imei}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-mono text-sm">{mobile.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{mobile.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Storage</p>
                <p className="font-medium">{mobile.storage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={statusColors[mobile.status]}>
                  {mobile.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                SIM & Network
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{mobile.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SIM Provider</p>
                <p className="font-medium">{mobile.simProvider}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">SIM Number (ICCID)</p>
                <p className="font-mono text-sm">{mobile.simNumber}</p>
              </div>
            </CardContent>
          </Card>

          {mobile.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{mobile.notes}</p>
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
                <p className="font-medium">{mobile.currentUser || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{mobile.department || '-'}</p>
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
                <p className="font-medium">{mobile.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{mobile.location}</p>
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
                <p className="font-medium">{formatDate(mobile.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Warranty End Date</p>
                <p className="font-medium">{formatDate(mobile.warrantyEndDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="font-medium">{formatCurrency(mobile.purchasePrice)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
