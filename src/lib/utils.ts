import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined, currency = 'INR'): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateRequestNumber(): string {
  const prefix = 'REQ';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateAssetTag(prefix: string, sequenceNumber: number): string {
  return `${prefix}-${String(sequenceNumber).padStart(5, '0')}`;
}

export function getDaysUntilExpiry(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const expiryDate = new Date(date);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(date: Date | string | null | undefined): 'expired' | 'warning' | 'active' | null {
  const daysUntil = getDaysUntilExpiry(date);
  if (daysUntil === null) return null;
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 30) return 'warning';
  return 'active';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Status color mapping
export const statusColors: Record<string, string> = {
  // System statuses
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  MAINTENANCE: 'bg-amber-100 text-amber-800',
  RETIRED: 'bg-red-100 text-red-800',
  DISPOSED: 'bg-red-100 text-red-800',
  IN_STOCK: 'bg-blue-100 text-blue-800',

  // Mobile statuses
  LOST: 'bg-red-100 text-red-800',
  DAMAGED: 'bg-orange-100 text-orange-800',
  RETURNED: 'bg-gray-100 text-gray-800',

  // Request statuses
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  NORMAL: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-amber-100 text-amber-800',
  URGENT: 'bg-red-100 text-red-800',
};

// Constants
export const COMPANIES = [
  { code: 'ISKY', name: 'ISKY' },
  { code: 'NCPL', name: 'National Consulting Private Limited' },
  { code: 'NIPL', name: 'NIPL' },
  { code: 'NRPL', name: 'NRPL' },
  { code: 'RAINLAND', name: 'Rainland Auto Corp' },
] as const;

export const LOCATIONS = [
  { code: 'HO-BLR', name: 'HO – Bangalore', city: 'Bangalore' },
  { code: 'RL-BLR', name: 'Rainland – Bangalore', city: 'Bangalore' },
  { code: 'RL-MLR', name: 'Rainland – Mangaluru', city: 'Mangaluru' },
  { code: 'RL-SMG', name: 'Rainland – Shivamogga', city: 'Shivamogga' },
  { code: 'HASSAN', name: 'Hassan', city: 'Hassan' },
  { code: 'CHICKM', name: 'Chickmagalur', city: 'Chickmagalur' },
  { code: 'ANKOLA', name: 'Ankola', city: 'Ankola' },
] as const;

export const PRODUCT_TYPES = [
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'SERVER', label: 'Server' },
  { value: 'PRINTER', label: 'Printer' },
  { value: 'SCANNER', label: 'Scanner' },
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'PROJECTOR', label: 'Projector' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'UPS', label: 'UPS' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const SOFTWARE_CATEGORIES = [
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
] as const;

export const LICENSE_TYPES = [
  { value: 'PERPETUAL', label: 'Perpetual' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'OEM', label: 'OEM' },
  { value: 'VOLUME', label: 'Volume' },
  { value: 'FREEWARE', label: 'Freeware' },
  { value: 'OPEN_SOURCE', label: 'Open Source' },
] as const;

export const MOBILE_OPERATORS = [
  { value: 'AIRTEL', label: 'Airtel' },
  { value: 'JIO', label: 'Jio' },
  { value: 'VI', label: 'Vi (Vodafone Idea)' },
  { value: 'BSNL', label: 'BSNL' },
] as const;

export const REQUEST_TYPES = [
  { value: 'NEW_EMPLOYEE', label: 'New Employee Onboarding' },
  { value: 'HARDWARE', label: 'Hardware Request' },
  { value: 'SOFTWARE', label: 'Software Request' },
  { value: 'ACCESS', label: 'Access Request' },
  { value: 'MOBILE', label: 'Mobile/SIM Request' },
  { value: 'EMAIL_ACCOUNT', label: 'Email Account' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
] as const;
