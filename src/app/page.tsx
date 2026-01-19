import { MainLayout } from '@/components/layout';
import {
  KPICard,
  AssetDistributionChart,
  ProductTypeChart,
  CompanySummaryCard,
  QuickActionsCard,
  AlertsCard,
} from '@/components/dashboard';
import { FileText, Monitor, Package, Key } from 'lucide-react';

// Mock data - In production, this would come from the database
const mockKPIData = {
  totalRequests: 47,
  totalSystems: 312,
  totalSoftware: 89,
  totalLicenses: 456,
};

const mockLocationData = [
  { name: 'HO – Bangalore', value: 145 },
  { name: 'Rainland – Bangalore', value: 67 },
  { name: 'Rainland – Mangaluru', value: 42 },
  { name: 'Rainland – Shivamogga', value: 28 },
  { name: 'Hassan', value: 15 },
  { name: 'Chickmagalur', value: 10 },
  { name: 'Ankola', value: 5 },
];

const mockProductTypeData = [
  { name: 'Laptop', value: 156 },
  { name: 'Desktop', value: 89 },
  { name: 'Printer', value: 34 },
  { name: 'Monitor', value: 67 },
  { name: 'Server', value: 12 },
  { name: 'UPS', value: 23 },
  { name: 'Networking', value: 18 },
  { name: 'Scanner', value: 8 },
];

const mockCompanySummary = [
  { code: 'RAINLAND', name: 'Rainland Auto Corp', systems: 142, software: 45, mobiles: 67, activeRequests: 12 },
  { code: 'NCPL', name: 'National Consulting Private Limited', systems: 89, software: 28, mobiles: 34, activeRequests: 8 },
  { code: 'ISKY', name: 'ISKY', systems: 45, software: 12, mobiles: 23, activeRequests: 3 },
  { code: 'NIPL', name: 'NIPL', systems: 24, software: 8, mobiles: 12, activeRequests: 0 },
  { code: 'NRPL', name: 'NRPL', systems: 12, software: 6, mobiles: 8, activeRequests: 2 },
];

const mockAlerts = [
  {
    id: '1',
    type: 'warranty' as const,
    title: 'Dell Laptop - AST-00234',
    description: 'Warranty expiring for Finance department',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'license' as const,
    title: 'Microsoft 365 Business',
    description: '15 licenses expiring',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'maintenance' as const,
    title: 'Server Maintenance Due',
    description: 'Server room equipment quarterly maintenance',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    type: 'license' as const,
    title: 'AutoCAD License',
    description: '3 licenses renewal due',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
  },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#070B47]">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            IT Inventory Management System – National Group India
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Requests"
            value={mockKPIData.totalRequests}
            subtitle="12 pending approval"
            icon={FileText}
            color="primary"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Total Systems"
            value={mockKPIData.totalSystems}
            subtitle="289 active, 23 in stock"
            icon={Monitor}
            color="secondary"
            trend={{ value: 3, isPositive: true }}
          />
          <KPICard
            title="Total Software"
            value={mockKPIData.totalSoftware}
            subtitle="5 expiring soon"
            icon={Package}
            color="success"
            trend={{ value: 2, isPositive: false }}
          />
          <KPICard
            title="Total Licenses"
            value={mockKPIData.totalLicenses}
            subtitle="398 allocated"
            icon={Key}
            color="warning"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetDistributionChart
            data={mockLocationData}
            title="Asset Distribution by Location"
          />
          <ProductTypeChart
            data={mockProductTypeData}
            title="Asset Distribution by Product Type"
          />
        </div>

        {/* Company Summary & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CompanySummaryCard companies={mockCompanySummary} />
          </div>
          <div className="space-y-6">
            <QuickActionsCard />
            <AlertsCard alerts={mockAlerts} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

