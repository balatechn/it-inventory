'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mobileSchema, type MobileInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for dropdowns - replace with actual data from API
const companies = [
  { id: '1', name: 'ISKY' },
  { id: '2', name: 'NCPL' },
  { id: '3', name: 'NIPL' },
  { id: '4', name: 'NRPL' },
  { id: '5', name: 'Rainland Auto Corp' },
];

const locations = [
  { id: '1', name: 'Ludhiana HQ', companyId: '1' },
  { id: '2', name: 'Delhi Office', companyId: '1' },
  { id: '3', name: 'Mumbai Office', companyId: '2' },
  { id: '4', name: 'Bangalore Office', companyId: '3' },
];

const employees = [
  { id: '1', name: 'John Doe', email: 'john@isky.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@ncpl.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@nipl.com' },
];

const operators = ['Airtel', 'Jio', 'Vodafone Idea', 'BSNL', 'MTNL'];
const planTypes = ['PREPAID', 'POSTPAID', 'DATA_ONLY', 'VOICE_ONLY'];
const deviceTypes = ['SMARTPHONE', 'FEATURE_PHONE', 'DATA_CARD', 'SIM_ONLY'];
const statuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'RETURNED', 'LOST'];

interface MobileFormProps {
  initialData?: MobileInput & { id: string };
}

export function MobileForm({ initialData }: MobileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(initialData?.companyId || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<MobileInput>({
    resolver: zodResolver(mobileSchema) as any,
    defaultValues: initialData || {
      status: 'ACTIVE',
      planType: 'POSTPAID',
      deviceType: 'SMARTPHONE',
      dataLimit: '',
      monthlyRental: 0,
    },
  });

  const deviceType = watch('deviceType');

  const filteredLocations = locations.filter(
    (loc) => !selectedCompany || loc.companyId === selectedCompany
  );

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
    setValue('locationId', '');
  };

  const onSubmit = async (data: MobileInput) => {
    setIsSubmitting(true);
    try {
      const endpoint = initialData
        ? `/api/mobile/${initialData.id}`
        : '/api/mobile';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/mobile');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Failed to save mobile:', error);
        alert('Failed to save mobile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving mobile:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Mobile Number & SIM Information */}
      <Card>
        <CardHeader>
          <CardTitle>SIM Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              {...register('mobileNumber')}
              error={errors.mobileNumber?.message}
              placeholder="e.g., 9876543210"
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operator">Operator *</Label>
            <Select id="operator" {...register('operator')} error={errors.operator?.message}>
              <option value="">Select operator</option>
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planType">Plan Type *</Label>
            <Select id="planType" {...register('planType')} error={errors.planType?.message}>
              {planTypes.map((plan) => (
                <option key={plan} value={plan}>
                  {plan.replace('_', ' ').charAt(0) + plan.replace('_', ' ').slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="simNumber">SIM Number</Label>
            <Input
              id="simNumber"
              {...register('simNumber')}
              error={errors.simNumber?.message}
              placeholder="Enter SIM card number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataLimit">Data Limit (GB)</Label>
            <Input
              id="dataLimit"
              type="number"
              step="0.1"
              {...register('dataLimit', { valueAsNumber: true })}
              error={errors.dataLimit?.message}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyRental">Monthly Rental (₹) *</Label>
            <Input
              id="monthlyRental"
              type="number"
              step="0.01"
              {...register('monthlyRental', { valueAsNumber: true })}
              error={errors.monthlyRental?.message}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select id="status" {...register('status')} error={errors.status?.message}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationDate">Allocation Date</Label>
            <Input
              id="allocationDate"
              type="date"
              {...register('allocationDate')}
              error={errors.allocationDate?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deviceType">Device Type *</Label>
            <Select id="deviceType" {...register('deviceType')} error={errors.deviceType?.message}>
              {deviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                </option>
              ))}
            </Select>
          </div>

          {(deviceType === 'SMARTPHONE' || deviceType === 'FEATURE_PHONE' || deviceType === 'DATA_CARD') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="model">Device Model</Label>
                <Input
                  id="model"
                  {...register('model')}
                  error={errors.model?.message}
                  placeholder="e.g., iPhone 14 Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imei1">IMEI 1</Label>
                <Input
                  id="imei1"
                  {...register('imei1')}
                  error={errors.imei1?.message}
                  placeholder="15-digit IMEI number"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imei2">IMEI 2</Label>
                <Input
                  id="imei2"
                  {...register('imei2')}
                  error={errors.imei2?.message}
                  placeholder="15-digit IMEI number (if dual SIM)"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  {...register('manufacturer')}
                  error={errors.manufacturer?.message}
                  placeholder="Device manufacturer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  {...register('purchaseDate')}
                  error={errors.purchaseDate?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  {...register('purchasePrice', { valueAsNumber: true })}
                  error={errors.purchasePrice?.message}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  {...register('invoiceNumber')}
                  error={errors.invoiceNumber?.message}
                  placeholder="Invoice number"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Organization & Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Organization & Assignment</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyId">Company *</Label>
            <Select
              id="companyId"
              {...register('companyId', {
                onChange: handleCompanyChange,
              })}
              error={errors.companyId?.message}
            >
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Location</Label>
            <Select id="locationId" {...register('locationId')} error={errors.locationId?.message}>
              <option value="">Select location</option>
              {filteredLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Assigned Employee</Label>
            <Select id="employeeId" {...register('employeeId')} error={errors.employeeId?.message}>
              <option value="">Select employee (optional)</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationDate">Allocation Date</Label>
            <Input
              id="allocationDate"
              type="date"
              {...register('allocationDate')}
              error={errors.allocationDate?.message}
            />
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
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              error={errors.remarks?.message}
              placeholder="Enter additional notes..."
              rows={3}
            />
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update Mobile' : 'Add Mobile'}
        </Button>
      </div>
    </form>
  );
}
