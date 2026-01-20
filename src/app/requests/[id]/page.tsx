'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, ClipboardList, Calendar, User, Building, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Mock data
const mockRequests = [
  {
    id: '1',
    requestNumber: 'REQ-2024-001',
    type: 'NEW_HARDWARE',
    itemType: 'LAPTOP',
    itemDescription: 'Dell Latitude 5540 Laptop',
    quantity: 1,
    reason: 'New employee joining the development team requires a laptop for daily work.',
    urgency: 'HIGH',
    status: 'PENDING',
    requestedBy: 'John Smith',
    department: 'IT Department',
    company: 'NCPL',
    requestDate: '2024-01-15',
    expectedDate: '2024-01-22',
    approvedBy: null,
    approvedDate: null,
    notes: 'Please expedite as the employee is starting next week.',
  },
  {
    id: '2',
    requestNumber: 'REQ-2024-002',
    type: 'SOFTWARE_LICENSE',
    itemType: 'SOFTWARE',
    itemDescription: 'Adobe Creative Cloud License',
    quantity: 5,
    reason: 'Design team expansion requires additional Adobe licenses.',
    urgency: 'MEDIUM',
    status: 'APPROVED',
    requestedBy: 'Jane Doe',
    department: 'Design',
    company: 'ISKY',
    requestDate: '2024-01-10',
    expectedDate: '2024-01-17',
    approvedBy: 'Manager Singh',
    approvedDate: '2024-01-12',
    notes: 'Approved for Q1 budget allocation.',
  },
];

const typeLabels: Record<string, string> = {
  'NEW_HARDWARE': 'New Hardware',
  'SOFTWARE_LICENSE': 'Software License',
  'REPAIR': 'Repair',
  'REPLACEMENT': 'Replacement',
  'MOBILE_DEVICE': 'Mobile Device',
  'ACCESSORY': 'Accessory',
  'OTHER': 'Other',
};

const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'IN_PROGRESS': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-gray-100 text-gray-800',
  'CANCELLED': 'bg-gray-100 text-gray-500',
};

const urgencyColors: Record<string, string> = {
  'LOW': 'bg-gray-100 text-gray-800',
  'MEDIUM': 'bg-blue-100 text-blue-800',
  'HIGH': 'bg-orange-100 text-orange-800',
  'CRITICAL': 'bg-red-100 text-red-800',
};

export default function RequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const request = mockRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="space-y-6">
        <Link href="/requests" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Request not found</p>
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
          <Link href="/requests" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#070B47]">{request.requestNumber}</h1>
            <p className="text-gray-500">{typeLabels[request.type] || request.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[request.status]}>
            {request.status.replace('_', ' ')}
          </Badge>
          <Link href={`/requests/${id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Request Number</p>
                  <p className="font-medium font-mono">{request.requestNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Type</p>
                  <Badge variant="outline">{typeLabels[request.type] || request.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Item Type</p>
                  <p className="font-medium">{request.itemType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{request.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Urgency</p>
                  <Badge className={urgencyColors[request.urgency]}>{request.urgency}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={statusColors[request.status]}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Item Description</p>
                <p className="font-medium">{request.itemDescription}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason / Justification</p>
                <p className="text-gray-600">{request.reason}</p>
              </div>
            </CardContent>
          </Card>

          {request.status === 'APPROVED' && request.approvedBy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Approval Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p className="font-medium">{request.approvedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved Date</p>
                  <p className="font-medium">{request.approvedDate ? formatDate(request.approvedDate) : '-'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {request.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{request.notes}</p>
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
                Requester
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Requested By</p>
                <p className="font-medium">{request.requestedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{request.department}</p>
              </div>
            </CardContent>
          </Card>

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
                <p className="font-medium">{request.company}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Request Date</p>
                <p className="font-medium">{formatDate(request.requestDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Date</p>
                <p className="font-medium">{formatDate(request.expectedDate)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
