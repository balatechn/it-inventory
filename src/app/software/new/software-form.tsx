'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { softwareSchema, type SoftwareInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Company {
  id: string;
  name: string;
  code?: string;
}

interface Location {
  id: string;
  name: string;
  code?: string;
}

interface Vendor {
  id: string;
  name: string;
  code?: string;
}

const softwareCategories = [
  { value: 'OPERATING_SYSTEM', label: 'Operating System' },
  { value: 'OFFICE_SUITE', label: 'Office Suite' },
  { value: 'ANTIVIRUS', label: 'Antivirus' },
  { value: 'DATABASE', label: 'Database' },
  { value: 'DEVELOPMENT', label: 'Development' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'ACCOUNTING', label: 'Accounting' },
  { value: 'ERP', label: 'ERP' },
  { value: 'CRM', label: 'CRM' },
  { value: 'COMMUNICATION', label: 'Communication' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'OTHER', label: 'Other' },
];

const licenseTypes = [
  { value: 'PERPETUAL', label: 'Perpetual' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'OEM', label: 'OEM' },
  { value: 'VOLUME', label: 'Volume' },
  { value: 'FREEWARE', label: 'Freeware' },
  { value: 'OPEN_SOURCE', label: 'Open Source' },
];

interface SoftwareFormProps {
  initialData?: SoftwareInput & { id: string };
}

export function SoftwareForm({ initialData }: SoftwareFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Fetch lookup data on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [companiesRes, locationsRes, vendorsRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/locations'),
          fetch('/api/vendors'),
        ]);

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(data);
        }
        if (locationsRes.ok) {
          const data = await locationsRes.json();
          setLocations(data);
        }
        if (vendorsRes.ok) {
          const data = await vendorsRes.json();
          setVendors(data);
        }
      } catch (error) {
        console.error('Error fetching lookup data:', error);
      }
    };

    fetchLookupData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SoftwareInput>({
    resolver: zodResolver(softwareSchema) as any,
    defaultValues: initialData || {
      isActive: true,
      licenseType: 'SUBSCRIPTION',
      totalLicenses: 1,
      usedLicenses: 0,
      currency: 'INR',
    },
  });

  const licenseType = watch('licenseType');

  const onSubmit = async (data: SoftwareInput) => {
    setIsSubmitting(true);
    try {
      const endpoint = initialData
        ? `/api/software/${initialData.id}`
        : '/api/software';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/software');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Failed to save software:', error);
        alert('Failed to save software. Please try again.');
      }
    } catch (error) {
      console.error('Error saving software:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Software Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Microsoft Office 365"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              {...register('publisher')}
              placeholder="e.g., Microsoft"
            />
            {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              {...register('version')}
              placeholder="e.g., 2023"
            />
            {errors.version && <p className="text-sm text-red-500">{errors.version.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select id="category" {...register('category')}>
              <option value="">Select category</option>
              {softwareCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Company *</Label>
            <Select id="companyId" {...register('companyId')}>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            {errors.companyId && <p className="text-sm text-red-500">{errors.companyId.message}</p>}
          </div>

          <div className="space-y-2 flex items-center pt-8">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isActive" className="ml-2">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle>License Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="licenseType">License Type *</Label>
            <Select id="licenseType" {...register('licenseType')}>
              {licenseTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.licenseType && <p className="text-sm text-red-500">{errors.licenseType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseKey">License Key</Label>
            <Input
              id="licenseKey"
              {...register('licenseKey')}
              placeholder="Enter license key"
            />
            {errors.licenseKey && <p className="text-sm text-red-500">{errors.licenseKey.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalLicenses">Total Licenses *</Label>
            <Input
              id="totalLicenses"
              type="number"
              {...register('totalLicenses', { valueAsNumber: true })}
              min={1}
            />
            {errors.totalLicenses && <p className="text-sm text-red-500">{errors.totalLicenses.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usedLicenses">Used Licenses</Label>
            <Input
              id="usedLicenses"
              type="number"
              {...register('usedLicenses', { valueAsNumber: true })}
              min={0}
            />
            {errors.usedLicenses && <p className="text-sm text-red-500">{errors.usedLicenses.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register('purchaseDate')}
            />
            {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              {...register('expiryDate')}
            />
            {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewalDate">Renewal Date</Label>
            <Input
              id="renewalDate"
              type="date"
              {...register('renewalDate')}
            />
            {errors.renewalDate && <p className="text-sm text-red-500">{errors.renewalDate.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPerLicense">Cost Per License (₹)</Label>
            <Input
              id="costPerLicense"
              type="number"
              step="0.01"
              {...register('costPerLicense', { valueAsNumber: true })}
              min={0}
            />
            {errors.costPerLicense && <p className="text-sm text-red-500">{errors.costPerLicense.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost">Total Cost (₹)</Label>
            <Input
              id="totalCost"
              type="number"
              step="0.01"
              {...register('totalCost', { valueAsNumber: true })}
              min={0}
            />
            {errors.totalCost && <p className="text-sm text-red-500">{errors.totalCost.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              {...register('invoiceNumber')}
              placeholder="Enter invoice number"
            />
            {errors.invoiceNumber && <p className="text-sm text-red-500">{errors.invoiceNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="poNumber">PO Number</Label>
            <Input
              id="poNumber"
              {...register('poNumber')}
              placeholder="Enter PO number"
            />
            {errors.poNumber && <p className="text-sm text-red-500">{errors.poNumber.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter software description..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              placeholder="Enter additional remarks..."
              rows={3}
            />
            {errors.remarks && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Software' : 'Add Software'}
        </Button>
      </div>
    </form>
  );
}
