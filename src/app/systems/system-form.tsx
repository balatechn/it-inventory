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
import { systemSchema, type SystemInput } from '@/lib/validations';
import { PRODUCT_TYPES, COMPANIES, LOCATIONS } from '@/lib/utils';

interface SystemFormProps {
  initialData?: Partial<SystemInput> & { id?: string };
  isEditing?: boolean;
}

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'RETIRED', label: 'Retired' },
  { value: 'DISPOSED', label: 'Disposed' },
];

const osOptions = [
  { value: 'Windows 11 Pro', label: 'Windows 11 Pro' },
  { value: 'Windows 11 Home', label: 'Windows 11 Home' },
  { value: 'Windows 10 Pro', label: 'Windows 10 Pro' },
  { value: 'Windows 10 Home', label: 'Windows 10 Home' },
  { value: 'Windows Server 2022', label: 'Windows Server 2022' },
  { value: 'Windows Server 2019', label: 'Windows Server 2019' },
  { value: 'Ubuntu 22.04', label: 'Ubuntu 22.04' },
  { value: 'macOS Sonoma', label: 'macOS Sonoma' },
  { value: 'Other', label: 'Other' },
];

// Mock data for dropdowns
const mockEmployees = [
  { value: 'emp1', label: 'John Smith - NCPL' },
  { value: 'emp2', label: 'Jane Doe - RAINLAND' },
  { value: 'emp3', label: 'Alice Johnson - ISKY' },
];

const mockVendors = [
  { value: 'v1', label: 'Dell India Pvt Ltd' },
  { value: 'v2', label: 'HP India Sales Pvt Ltd' },
  { value: 'v3', label: 'Lenovo India Pvt Ltd' },
  { value: 'v4', label: 'Canon India Pvt Ltd' },
];

const mockDepartments = [
  { value: 'd1', label: 'IT Department' },
  { value: 'd2', label: 'Finance' },
  { value: 'd3', label: 'HR' },
  { value: 'd4', label: 'Sales' },
  { value: 'd5', label: 'Operations' },
];

export function SystemForm({ initialData, isEditing = false }: SystemFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SystemInput>({
    resolver: zodResolver(systemSchema) as any,
    defaultValues: {
      status: 'IN_STOCK',
      ...initialData,
    },
  });

  const onSubmit = async (data: SystemInput) => {
    setIsSubmitting(true);
    try {
      const endpoint = isEditing && initialData?.id
        ? `/api/systems/${initialData.id}`
        : '/api/systems';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/systems');
        router.refresh();
      } else {
        console.error('Failed to save system:', result);
        alert(result.error || 'Failed to save system. Please try again.');
      }
    } catch (error) {
      console.error('Error saving system:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">
            {isEditing ? 'Edit System' : 'Add New System'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? 'Update hardware asset information' : 'Register a new hardware asset'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assetTag">Asset Tag</Label>
              <Input
                id="assetTag"
                {...register('assetTag')}
                placeholder="e.g., AST-00001"
              />
              {errors.assetTag && (
                <p className="text-red-500 text-xs">{errors.assetTag.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                {...register('serialNumber')}
                placeholder="Enter serial number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select
                id="productType"
                {...register('productType')}
                options={PRODUCT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                placeholder="Select type"
              />
              {errors.productType && (
                <p className="text-red-500 text-xs">{errors.productType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                {...register('manufacturer')}
                placeholder="e.g., Dell, HP, Lenovo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                {...register('model')}
                placeholder="e.g., Latitude 5520"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                {...register('status')}
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
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
              <Label htmlFor="locationId">Location</Label>
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

            <div className="space-y-2">
              <Label htmlFor="currentUserId">Current User</Label>
              <Select
                id="currentUserId"
                {...register('currentUserId')}
                options={[{ value: '', label: 'Unassigned' }, ...mockEmployees]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousUserId">Previous User</Label>
              <Select
                id="previousUserId"
                {...register('previousUserId')}
                options={[{ value: '', label: 'None' }, ...mockEmployees]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Technical Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Technical Configuration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="processor">Processor</Label>
              <Input
                id="processor"
                {...register('processor')}
                placeholder="e.g., Intel Core i5-1135G7"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Input
                id="ram"
                {...register('ram')}
                placeholder="e.g., 16 GB DDR4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Input
                id="storage"
                {...register('storage')}
                placeholder="e.g., 512 GB SSD"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingSystem">Operating System</Label>
              <Select
                id="operatingSystem"
                {...register('operatingSystem')}
                options={osOptions}
                placeholder="Select OS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="osVersion">OS Version</Label>
              <Input
                id="osVersion"
                {...register('osVersion')}
                placeholder="e.g., 22H2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                {...register('macAddress')}
                placeholder="e.g., 00:1A:2B:3C:4D:5E"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                {...register('ipAddress')}
                placeholder="e.g., 192.168.1.100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase & Warranty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchase & Warranty Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor</Label>
              <Select
                id="vendorId"
                {...register('vendorId')}
                options={[{ value: '', label: 'Select vendor' }, ...mockVendors]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                {...register('purchasePrice')}
                placeholder="e.g., 85000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                {...register('invoiceNumber')}
                placeholder="Enter invoice number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                {...register('invoiceDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number</Label>
              <Input
                id="poNumber"
                {...register('poNumber')}
                placeholder="Enter PO number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyStartDate">Warranty Start Date</Label>
              <Input
                id="warrantyStartDate"
                type="date"
                {...register('warrantyStartDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyEndDate">Warranty End Date</Label>
              <Input
                id="warrantyEndDate"
                type="date"
                {...register('warrantyEndDate')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
              <Input
                id="lastMaintenanceDate"
                type="date"
                {...register('lastMaintenanceDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
              <Input
                id="nextMaintenanceDate"
                type="date"
                {...register('nextMaintenanceDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenanceFrequency">Maintenance Frequency (Days)</Label>
              <Input
                id="maintenanceFrequency"
                type="number"
                {...register('maintenanceFrequency')}
                placeholder="e.g., 90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amcStartDate">AMC Start Date</Label>
              <Input
                id="amcStartDate"
                type="date"
                {...register('amcStartDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amcEndDate">AMC End Date</Label>
              <Input
                id="amcEndDate"
                type="date"
                {...register('amcEndDate')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  {...register('condition')}
                  placeholder="e.g., Good, Fair, Needs Repair"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                {...register('remarks')}
                placeholder="Enter any additional notes or remarks..."
                rows={4}
              />
            </div>

            {/* File Upload Placeholder */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#070B47] transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: PDF, JPG, PNG (Max 10MB each)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/systems">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update System' : 'Save System'}
          </Button>
        </div>
      </form>
    </div>
  );
}
