'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { requestSchema, type RequestInput } from '@/lib/validations';
import { COMPANIES, LOCATIONS, REQUEST_TYPES } from '@/lib/utils';

interface RequestFormProps {
  initialData?: Partial<RequestInput> & { id?: string };
  isEditing?: boolean;
}

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const employeeTypeOptions = [
  { value: 'NEW', label: 'New Employee' },
  { value: 'EXISTING', label: 'Existing Employee' },
];

// Mock data for dropdowns
const mockDepartments = [
  { value: 'd1', label: 'IT Department' },
  { value: 'd2', label: 'Finance' },
  { value: 'd3', label: 'HR' },
  { value: 'd4', label: 'Sales' },
  { value: 'd5', label: 'Operations' },
  { value: 'd6', label: 'Design' },
  { value: 'd7', label: 'Marketing' },
];

export function RequestForm({ initialData, isEditing = false }: RequestFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema) as any,
    defaultValues: {
      priority: 'NORMAL',
      employeeType: 'EXISTING',
      quantity: 1,
      ...initialData,
    },
  });

  const watchRequestType = watch('requestType');
  const watchEmployeeType = watch('employeeType');

  const onSubmit = async (data: RequestInput) => {
    setIsSubmitting(true);
    try {
      const endpoint = isEditing && initialData?.id
        ? `/api/requests/${initialData.id}`
        : '/api/requests';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/requests');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Failed to save request:', error);
        alert('Failed to save request. Please try again.');
      }
    } catch (error) {
      console.error('Error saving request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/requests">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">
            {isEditing ? 'Edit Request' : 'Create New Request'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? 'Update IT request details' : 'Submit a new IT asset or access request'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Request Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request Type</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requestType" required>Request Type</Label>
              <Select
                id="requestType"
                {...register('requestType')}
                options={REQUEST_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                placeholder="Select request type"
              />
              {errors.requestType && (
                <p className="text-red-500 text-xs">{errors.requestType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" required>Priority</Label>
              <Select
                id="priority"
                {...register('priority')}
                options={priorityOptions}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeType" required>Employee Type</Label>
              <Select
                id="employeeType"
                {...register('employeeType')}
                options={employeeTypeOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requester Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requester Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="requesterName">Requester Name</Label>
              <Input
                id="requesterName"
                {...register('requesterName')}
                placeholder="Enter requester name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterEmail">Email</Label>
              <Input
                id="requesterEmail"
                type="email"
                {...register('requesterEmail')}
                placeholder="requester@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterPhone">Phone</Label>
              <Input
                id="requesterPhone"
                {...register('requesterPhone')}
                placeholder="Enter phone number"
              />
            </div>

            {watchEmployeeType === 'NEW' && (
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  {...register('joiningDate')}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyId" required>Company</Label>
              <Select
                id="companyId"
                {...register('companyId')}
                options={COMPANIES.map((c) => ({ value: c.code, label: c.name }))}
                placeholder="Select company"
              />
              {errors.companyId && (
                <p className="text-red-500 text-xs">{errors.companyId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationId" required>Location</Label>
              <Select
                id="locationId"
                {...register('locationId')}
                options={LOCATIONS.map((l) => ({ value: l.code, label: l.name }))}
                placeholder="Select location"
              />
              {errors.locationId && (
                <p className="text-red-500 text-xs">{errors.locationId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              <Select
                id="departmentId"
                {...register('departmentId')}
                options={mockDepartments}
                placeholder="Select department"
              />
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" required>Subject</Label>
              <Input
                id="subject"
                {...register('subject')}
                placeholder="Brief description of the request"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Provide detailed information about your request..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Business Justification</Label>
              <Textarea
                id="justification"
                {...register('justification')}
                placeholder="Explain why this request is needed..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Asset Requirements (for Hardware/Software requests) */}
        {(watchRequestType === 'HARDWARE' || watchRequestType === 'SOFTWARE' || watchRequestType === 'NEW_EMPLOYEE') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Asset Requirements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Input
                  id="assetType"
                  {...register('assetType')}
                  placeholder="e.g., Laptop, Desktop, Printer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...register('quantity')}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  {...register('specifications')}
                  placeholder="Specify required configuration, software, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Access Requirements (for Access/Email requests) */}
        {(watchRequestType === 'ACCESS' || watchRequestType === 'EMAIL_ACCOUNT' || watchRequestType === 'NEW_EMPLOYEE') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Access Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accessRequirements">Access Requirements</Label>
                <Textarea
                  id="accessRequirements"
                  {...register('accessRequirements')}
                  placeholder="List required system access, VPN, network shares, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="softwareRequirements">Software Requirements</Label>
                <Textarea
                  id="softwareRequirements"
                  {...register('softwareRequirements')}
                  placeholder="List required software applications"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#070B47] transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/requests">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Request' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
