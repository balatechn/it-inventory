'use server';

import { prisma } from '@/lib/prisma';
import { softwareSchema, type SoftwareInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getSoftware(params: {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  category?: string;
  licenseType?: string;
}) {
  const { page = 1, limit = 10, search, companyId, category, licenseType } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { publisher: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (companyId) where.companyId = companyId;
  if (category) where.category = category;
  if (licenseType) where.licenseType = licenseType;

  const [software, total] = await Promise.all([
    prisma.software.findMany({
      where,
      include: {
        company: true,
        location: true,
        vendor: true,
        _count: { select: { licenses: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.software.count({ where }),
  ]);

  return {
    data: software,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSoftwareById(id: string) {
  return prisma.software.findUnique({
    where: { id },
    include: {
      company: true,
      location: true,
      vendor: true,
      licenses: {
        include: { employee: true },
      },
      systemSoftware: {
        include: { system: true },
      },
      attachments: true,
    },
  });
}

export async function createSoftware(data: SoftwareInput) {
  const validated = softwareSchema.parse(data);

  const software = await prisma.software.create({
    data: validated as any,
  });

  revalidatePath('/software');
  return software;
}

export async function updateSoftware(id: string, data: Partial<SoftwareInput>) {
  const software = await prisma.software.update({
    where: { id },
    data: data as any,
  });

  revalidatePath('/software');
  revalidatePath(`/software/${id}`);
  return software;
}

export async function deleteSoftware(id: string) {
  await prisma.software.delete({
    where: { id },
  });

  revalidatePath('/software');
}

export async function getSoftwareStats() {
  const [total, byCategory, byLicenseType, licenseStats] = await Promise.all([
    prisma.software.count(),
    prisma.software.groupBy({
      by: ['category'],
      _count: { category: true },
    }),
    prisma.software.groupBy({
      by: ['licenseType'],
      _count: { licenseType: true },
    }),
    prisma.software.aggregate({
      _sum: {
        totalLicenses: true,
        usedLicenses: true,
      },
    }),
  ]);

  return {
    total,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count.category })),
    byLicenseType: byLicenseType.map((l) => ({ type: l.licenseType, count: l._count.licenseType })),
    totalLicenses: licenseStats._sum.totalLicenses || 0,
    usedLicenses: licenseStats._sum.usedLicenses || 0,
  };
}

export async function getExpiringLicenses(daysAhead: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return prisma.software.findMany({
    where: {
      expiryDate: {
        lte: futureDate,
        gte: new Date(),
      },
      isActive: true,
    },
    include: {
      company: true,
    },
    orderBy: { expiryDate: 'asc' },
  });
}

export async function allocateLicense(softwareId: string, employeeId: string, licenseKey?: string) {
  // Create a license allocation
  const license = await prisma.softwareLicense.create({
    data: {
      softwareId,
      employeeId,
      licenseKey,
      activationDate: new Date(),
      isActive: true,
    },
  });

  // Update used count
  await prisma.software.update({
    where: { id: softwareId },
    data: { usedLicenses: { increment: 1 } },
  });

  revalidatePath('/software');
  revalidatePath(`/software/${softwareId}`);

  return license;
}

export async function revokeLicense(licenseId: string) {
  const license = await prisma.softwareLicense.update({
    where: { id: licenseId },
    data: { isActive: false },
  });

  // Update used count
  await prisma.software.update({
    where: { id: license.softwareId },
    data: { usedLicenses: { decrement: 1 } },
  });

  revalidatePath('/software');

  return license;
}
