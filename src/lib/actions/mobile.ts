'use server';

import { prisma } from '@/lib/prisma';
import { mobileSchema, type MobileInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getMobiles(params: {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  locationId?: string;
  status?: string;
  operator?: string;
}) {
  const { page = 1, limit = 10, search, companyId, locationId, status, operator } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { mobileNumber: { contains: search } },
      { model: { contains: search, mode: 'insensitive' } },
      { imei1: { contains: search } },
    ];
  }

  if (companyId) where.companyId = companyId;
  if (locationId) where.locationId = locationId;
  if (status) where.status = status;
  if (operator) where.operator = operator;

  const [mobiles, total] = await Promise.all([
    prisma.mobile.findMany({
      where,
      include: {
        company: true,
        location: true,
        employee: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.mobile.count({ where }),
  ]);

  return {
    data: mobiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getMobileById(id: string) {
  return prisma.mobile.findUnique({
    where: { id },
    include: {
      company: true,
      location: true,
      employee: true,
    },
  });
}

export async function createMobile(data: MobileInput) {
  const validated = mobileSchema.parse(data);

  const mobile = await prisma.mobile.create({
    data: validated as any,
  });

  revalidatePath('/mobile');
  return mobile;
}

export async function updateMobile(id: string, data: Partial<MobileInput>) {
  const mobile = await prisma.mobile.update({
    where: { id },
    data: data as any,
  });

  revalidatePath('/mobile');
  revalidatePath(`/mobile/${id}`);
  return mobile;
}

export async function deleteMobile(id: string) {
  await prisma.mobile.delete({
    where: { id },
  });

  revalidatePath('/mobile');
}

export async function getMobileStats() {
  const [total, byStatus, byOperator, totalRental] = await Promise.all([
    prisma.mobile.count(),
    prisma.mobile.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.mobile.groupBy({
      by: ['operator'],
      _count: { operator: true },
    }),
    prisma.mobile.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { monthlyRental: true },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.status })),
    byOperator: byOperator.filter(o => o.operator).map((o) => ({ operator: o.operator, count: o._count.operator })),
    totalMonthlyRental: totalRental._sum.monthlyRental || 0,
  };
}

export async function allocateMobile(mobileId: string, employeeId: string) {
  const mobile = await prisma.mobile.update({
    where: { id: mobileId },
    data: {
      employeeId,
      allocationDate: new Date(),
      status: 'ACTIVE',
    },
  });

  revalidatePath('/mobile');
  revalidatePath(`/mobile/${mobileId}`);

  return mobile;
}

export async function returnMobile(mobileId: string) {
  const mobile = await prisma.mobile.update({
    where: { id: mobileId },
    data: {
      employeeId: null,
      returnDate: new Date(),
      status: 'RETURNED',
    },
  });

  revalidatePath('/mobile');
  revalidatePath(`/mobile/${mobileId}`);

  return mobile;
}
