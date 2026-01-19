'use server';

import { prisma } from '@/lib/prisma';
import { systemSchema, type SystemInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getSystems(params: {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  locationId?: string;
  status?: string;
  productType?: string;
}) {
  const { page = 1, limit = 10, search, companyId, locationId, status, productType } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { assetTag: { contains: search, mode: 'insensitive' } },
      { serialNumber: { contains: search, mode: 'insensitive' } },
      { manufacturer: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (companyId) where.companyId = companyId;
  if (locationId) where.locationId = locationId;
  if (status) where.status = status;
  if (productType) where.productType = productType;

  const [systems, total] = await Promise.all([
    prisma.system.findMany({
      where,
      include: {
        company: true,
        location: true,
        department: true,
        currentUser: true,
        vendor: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.system.count({ where }),
  ]);

  return {
    data: systems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSystemById(id: string) {
  return prisma.system.findUnique({
    where: { id },
    include: {
      company: true,
      location: true,
      department: true,
      currentUser: true,
      previousUser: true,
      vendor: true,
      attachments: true,
      installedSoftware: {
        include: { software: true },
      },
      maintenanceRecords: {
        orderBy: { maintenanceDate: 'desc' },
      },
    },
  });
}

export async function createSystem(data: SystemInput) {
  const validated = systemSchema.parse(data);

  const system = await prisma.system.create({
    data: validated as any,
  });

  revalidatePath('/systems');
  return system;
}

export async function updateSystem(id: string, data: Partial<SystemInput>) {
  const system = await prisma.system.update({
    where: { id },
    data: data as any,
  });

  revalidatePath('/systems');
  revalidatePath(`/systems/${id}`);
  return system;
}

export async function deleteSystem(id: string) {
  await prisma.system.delete({
    where: { id },
  });

  revalidatePath('/systems');
}

export async function getSystemStats() {
  const [total, byStatus, byProductType, byCompany] = await Promise.all([
    prisma.system.count(),
    prisma.system.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.system.groupBy({
      by: ['productType'],
      _count: { productType: true },
    }),
    prisma.system.groupBy({
      by: ['companyId'],
      _count: { companyId: true },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.status })),
    byProductType: byProductType.map((p) => ({ type: p.productType, count: p._count.productType })),
    byCompany,
  };
}

export async function getWarrantyExpiringAssets(daysAhead: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return prisma.system.findMany({
    where: {
      warrantyEndDate: {
        lte: futureDate,
        gte: new Date(),
      },
      status: 'ACTIVE',
    },
    include: {
      company: true,
      location: true,
      currentUser: true,
    },
    orderBy: { warrantyEndDate: 'asc' },
  });
}

export async function getMaintenanceDueAssets() {
  const today = new Date();

  return prisma.system.findMany({
    where: {
      nextMaintenanceDate: {
        lte: today,
      },
      status: 'ACTIVE',
    },
    include: {
      company: true,
      location: true,
      currentUser: true,
    },
    orderBy: { nextMaintenanceDate: 'asc' },
  });
}
