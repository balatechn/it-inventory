import { z } from 'zod';

// ============================================
// COMMON SCHEMAS
// ============================================

// Helper for ID validation - allows any string (for mock data compatibility)
// In production with real database, you can change this to z.string().cuid()
const idString = () => z.string().min(1);
const optionalIdString = () => z.string().min(1).optional();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  companyId: z.string().optional(),
  locationId: z.string().optional(),
  status: z.string().optional(),
});

// ============================================
// COMPANY SCHEMAS
// ============================================

export const companySchema = z.object({
  code: z.string().max(20).toUpperCase().optional(),
  name: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const companyUpdateSchema = companySchema.partial();

// ============================================
// LOCATION SCHEMAS
// ============================================

export const locationSchema = z.object({
  code: z.string().max(20).toUpperCase().optional(),
  name: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  state: z.string().default('Karnataka').optional(),
  companyId: optionalIdString(),
  isActive: z.boolean().default(true).optional(),
});

export const locationUpdateSchema = locationSchema.partial();

// ============================================
// DEPARTMENT SCHEMAS
// ============================================

export const departmentSchema = z.object({
  name: z.string().max(100).optional(),
  code: z.string().max(20).optional(),
  companyId: optionalIdString(),
  isActive: z.boolean().default(true).optional(),
});

export const departmentUpdateSchema = departmentSchema.partial();

// ============================================
// EMPLOYEE SCHEMAS
// ============================================

export const employeeSchema = z.object({
  employeeCode: z.string().max(20).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(15).optional(),
  designation: z.string().max(100).optional(),
  joiningDate: z.coerce.date().optional(),
  companyId: optionalIdString(),
  locationId: optionalIdString(),
  departmentId: optionalIdString(),
  isActive: z.boolean().default(true).optional(),
});

export const employeeUpdateSchema = employeeSchema.partial();

// ============================================
// SYSTEM (Hardware) SCHEMAS
// ============================================

export const productTypeEnum = z.enum([
  'DESKTOP',
  'LAPTOP',
  'SERVER',
  'PRINTER',
  'SCANNER',
  'MONITOR',
  'PROJECTOR',
  'NETWORKING',
  'UPS',
  'OTHER',
]);

export const systemStatusEnum = z.enum([
  'ACTIVE',
  'INACTIVE',
  'MAINTENANCE',
  'RETIRED',
  'DISPOSED',
  'IN_STOCK',
]);

export const systemSchema = z.object({
  assetTag: z.string().max(50).optional(),
  serialNumber: z.string().max(100).optional(),
  productType: productTypeEnum.optional(),
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),

  // Configuration
  processor: z.string().max(100).optional(),
  ram: z.string().max(50).optional(),
  storage: z.string().max(100).optional(),
  operatingSystem: z.string().max(100).optional(),
  osVersion: z.string().max(50).optional(),
  macAddress: z.string().max(50).optional(),
  ipAddress: z.string().max(50).optional(),

  // Purchase & Warranty
  purchaseDate: z.coerce.date().optional(),
  warrantyStartDate: z.coerce.date().optional(),
  warrantyEndDate: z.coerce.date().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  invoiceNumber: z.string().max(50).optional(),
  invoiceDate: z.coerce.date().optional(),
  poNumber: z.string().max(50).optional(),
  vendorId: optionalIdString(),

  // Maintenance
  lastMaintenanceDate: z.coerce.date().optional(),
  nextMaintenanceDate: z.coerce.date().optional(),
  maintenanceFrequency: z.coerce.number().int().min(0).optional(),
  amcStartDate: z.coerce.date().optional(),
  amcEndDate: z.coerce.date().optional(),

  // Status & Assignment
  status: systemStatusEnum.default('IN_STOCK').optional(),
  condition: z.string().max(100).optional(),
  remarks: z.string().max(1000).optional(),

  // Relations
  companyId: optionalIdString(),
  locationId: optionalIdString(),
  departmentId: optionalIdString(),
  currentUserId: optionalIdString(),
  previousUserId: optionalIdString(),
});

export const systemUpdateSchema = systemSchema.partial();

export const systemFilterSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  productType: productTypeEnum.optional(),
  status: systemStatusEnum.optional(),
  vendorId: z.string().optional(),
  warrantyExpiring: z.coerce.boolean().optional(),
  maintenanceDue: z.coerce.boolean().optional(),
});

// ============================================
// MOBILE SCHEMAS
// ============================================

export const mobileStatusEnum = z.enum([
  'ACTIVE',
  'INACTIVE',
  'LOST',
  'DAMAGED',
  'RETURNED',
]);

export const mobileSchema = z.object({
  deviceType: z.string().max(50).optional(),
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  imei1: z.string().max(20).optional(),
  imei2: z.string().max(20).optional(),

  // SIM Details
  simNumber: z.string().max(30).optional(),
  mobileNumber: z.string().max(15).optional(),
  operator: z.string().max(50).optional(),
  planType: z.string().max(50).optional(),
  planDetails: z.string().max(500).optional(),
  monthlyRental: z.coerce.number().min(0).optional(),
  dataLimit: z.string().max(50).optional(),

  // Purchase
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  invoiceNumber: z.string().max(50).optional(),

  // Status
  status: mobileStatusEnum.optional(),
  allocationDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  remarks: z.string().max(1000).optional(),

  // Relations
  companyId: optionalIdString(),
  locationId: optionalIdString(),
  employeeId: optionalIdString(),
});

export const mobileUpdateSchema = mobileSchema.partial();

export const mobileFilterSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  status: mobileStatusEnum.optional(),
  operator: z.string().optional(),
});

// ============================================
// SOFTWARE SCHEMAS
// ============================================

export const licenseTypeEnum = z.enum([
  'PERPETUAL',
  'SUBSCRIPTION',
  'OEM',
  'VOLUME',
  'FREEWARE',
  'OPEN_SOURCE',
]);

export const softwareCategoryEnum = z.enum([
  'OPERATING_SYSTEM',
  'OFFICE_SUITE',
  'ANTIVIRUS',
  'DATABASE',
  'DEVELOPMENT',
  'DESIGN',
  'ACCOUNTING',
  'ERP',
  'CRM',
  'COMMUNICATION',
  'UTILITY',
  'OTHER',
]);

export const softwareSchema = z.object({
  name: z.string().max(100).optional(),
  version: z.string().max(50).optional(),
  publisher: z.string().max(100).optional(),
  category: softwareCategoryEnum.optional(),
  description: z.string().max(1000).optional(),

  // License Details
  licenseType: licenseTypeEnum.optional(),
  licenseKey: z.string().max(500).optional(),
  totalLicenses: z.coerce.number().int().min(0).default(1).optional(),
  usedLicenses: z.coerce.number().int().min(0).default(0).optional(),

  // Cost
  costPerLicense: z.coerce.number().min(0).optional(),
  totalCost: z.coerce.number().min(0).optional(),
  currency: z.string().default('INR').optional(),

  // Purchase & Renewal
  purchaseDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  renewalDate: z.coerce.date().optional(),
  invoiceNumber: z.string().max(50).optional(),
  poNumber: z.string().max(50).optional(),
  vendorId: optionalIdString(),

  // Status
  isActive: z.boolean().default(true).optional(),
  remarks: z.string().max(1000).optional(),

  // Relations
  companyId: optionalIdString(),
  locationId: optionalIdString(),
});

export const softwareUpdateSchema = softwareSchema.partial();

export const softwareFilterSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  category: softwareCategoryEnum.optional(),
  licenseType: licenseTypeEnum.optional(),
  expiringDays: z.coerce.number().int().optional(),
});

// ============================================
// SOFTWARE LICENSE SCHEMAS
// ============================================

export const softwareLicenseSchema = z.object({
  licenseKey: z.string().max(500).optional(),
  activationDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
  remarks: z.string().max(1000).optional(),
  softwareId: idString(),
  employeeId: optionalIdString(),
});

export const softwareLicenseUpdateSchema = softwareLicenseSchema.partial();

// ============================================
// REQUEST SCHEMAS
// ============================================

export const requestStatusEnum = z.enum([
  'DRAFT',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const requestTypeEnum = z.enum([
  'NEW_EMPLOYEE',
  'HARDWARE',
  'SOFTWARE',
  'ACCESS',
  'MOBILE',
  'EMAIL_ACCOUNT',
  'MAINTENANCE',
  'OTHER',
]);

export const employeeTypeEnum = z.enum(['NEW', 'EXISTING']);

export const priorityEnum = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']);

export const requestSchema = z.object({
  requestType: requestTypeEnum.optional(),
  priority: priorityEnum.optional(),

  // Requester Details
  employeeType: employeeTypeEnum.optional(),
  requesterName: z.string().max(100).optional(),
  requesterEmail: z.string().email().optional().or(z.literal('')),
  requesterPhone: z.string().max(15).optional(),
  joiningDate: z.coerce.date().optional(),

  // Request Details
  subject: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  justification: z.string().max(1000).optional(),

  // Asset Requirements
  assetType: z.string().max(100).optional(),
  specifications: z.string().max(1000).optional(),
  quantity: z.coerce.number().int().min(1).optional(),

  // Access Requirements
  accessRequirements: z.string().max(1000).optional(),
  softwareRequirements: z.string().max(1000).optional(),

  // Relations
  companyId: optionalIdString(),
  locationId: optionalIdString(),
  departmentId: optionalIdString(),
  requesterId: optionalIdString(),
});

export const requestUpdateSchema = z.object({
  ...requestSchema.partial().shape,
  status: requestStatusEnum.optional(),
  approvalRemarks: z.string().max(1000).optional(),
  approverId: optionalIdString(),
});

export const requestFilterSchema = z.object({
  ...paginationSchema.shape,
  ...searchSchema.shape,
  requestType: requestTypeEnum.optional(),
  status: requestStatusEnum.optional(),
  priority: priorityEnum.optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

// ============================================
// VENDOR SCHEMAS
// ============================================

export const vendorSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().max(20).optional(),
  contactPerson: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(15).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  gstin: z.string().max(20).optional(),
  panNumber: z.string().max(20).optional(),
  isActive: z.boolean().default(true),
  remarks: z.string().max(1000).optional(),
});

export const vendorUpdateSchema = vendorSchema.partial();

// ============================================
// TYPE EXPORTS
// ============================================

export type CompanyInput = z.infer<typeof companySchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type SystemInput = z.infer<typeof systemSchema>;
export type MobileInput = z.infer<typeof mobileSchema>;
export type SoftwareInput = z.infer<typeof softwareSchema>;
export type SoftwareLicenseInput = z.infer<typeof softwareLicenseSchema>;
export type RequestInput = z.infer<typeof requestSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
