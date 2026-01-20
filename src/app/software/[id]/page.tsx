'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, FileText, Calendar, Building, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Mock data
const mockSoftware = [
  {
    id: '1',
    name: 'Microsoft 365 Business',
    vendor: 'Microsoft',
    category: 'OFFICE_SUITE',
    version: 'Latest',
    licenseType: 'SUBSCRIPTION',
    licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
    totalLicenses: 100,
    usedLicenses: 85,
    purchaseDate: '2024-01-01',
    expiryDate: '2025-01-01',
    cost: 950000,
    company: 'NCPL',
    notes: 'Enterprise subscription for all employees',
  },
  {
    id: '2',
    name: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    category: 'DESIGN',
    version: '2024',
    licenseType: 'SUBSCRIPTION',
    licenseKey: 'YYYYY-YYYYY-YYYYY-YYYYY',
    totalLicenses: 20,
    usedLicenses: 18,
    purchaseDate: '2024-03-15',
    expiryDate: '2025-03-15',
    cost: 240000,
    company: 'ISKY',
    notes: 'Design team licenses',
  },
];

const categoryLabels: Record<string, string> = {
  'OFFICE_SUITE': 'Office Suite',
  'DESIGN': 'Design',
  'OPERATING_SYSTEM': 'Operating System',
  'ANTIVIRUS': 'Antivirus',
  'DEVELOPMENT': 'Development',
  'DATABASE': 'Database',
  'UTILITY': 'Utility',
  'OTHER': 'Other',
};

export default function SoftwareDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const software = mockSoftware.find(s => s.id === id);

  if (!software) {
    return (
      <div className="space-y-6">
        <Link href="/software" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Software
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Software not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableLicenses = software.totalLicenses - software.usedLicenses;
  const usagePercentage = Math.round((software.usedLicenses / software.totalLicenses) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/software" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#070B47]">{software.name}</h1>
            <p className="text-gray-500">{software.vendor}</p>
          </div>
        </div>
        <Link href={`/software/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Software
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Software Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Software Name</p>
                <p className="font-medium">{software.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">{software.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <Badge variant="outline">{categoryLabels[software.category] || software.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium">{software.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Type</p>
                <Badge variant={software.licenseType === 'SUBSCRIPTION' ? 'default' : 'secondary'}>
                  {software.licenseType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Key</p>
                <p className="font-mono text-sm">{software.licenseKey}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                License Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#070B47]">{software.totalLicenses}</p>
                  <p className="text-sm text-gray-500">Total Licenses</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{software.usedLicenses}</p>
                  <p className="text-sm text-gray-500">In Use</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{availableLicenses}</p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Usage</span>
                  <span>{usagePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {software.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{software.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{software.company}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates & Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">{formatDate(software.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">{formatDate(software.expiryDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="font-medium text-lg">₹{software.cost.toLocaleString('en-IN')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
