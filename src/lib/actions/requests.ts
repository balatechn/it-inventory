'use server';

import { prisma } from '@/lib/prisma';
import { requestSchema, type RequestInput } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { generateRequestNumber } from '@/lib/utils';

export async function getRequests(params: {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  locationId?: string;
  status?: string;
  requestType?: string;
  priority?: string;
}) {
  const { page = 1, limit = 10, search, companyId, locationId, status, requestType, priority } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { requestNumber: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { requesterName: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (companyId) where.companyId = companyId;
  if (locationId) where.locationId = locationId;
  if (status) where.status = status;
  if (requestType) where.requestType = requestType;
  if (priority) where.priority = priority;

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where,
      include: {
        company: true,
        location: true,
        department: true,
        requester: true,
        approver: true,
        _count: { select: { comments: true, attachments: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.request.count({ where }),
  ]);

  return {
    data: requests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getRequestById(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: {
      company: true,
      location: true,
      department: true,
      requester: true,
      approver: true,
      comments: {
        orderBy: { createdAt: 'desc' },
      },
      attachments: true,
    },
  });
}

export async function createRequest(data: RequestInput) {
  const validated = requestSchema.parse(data);

  const request = await prisma.request.create({
    data: {
      ...validated,
      requestNumber: generateRequestNumber(),
      status: 'PENDING',
    } as any,
  });

  revalidatePath('/requests');
  return request;
}

export async function updateRequest(id: string, data: Partial<RequestInput & { status?: string; approvalRemarks?: string; approverId?: string }>) {
  const request = await prisma.request.update({
    where: { id },
    data: data as any,
  });

  revalidatePath('/requests');
  revalidatePath(`/requests/${id}`);
  return request;
}

export async function approveRequest(id: string, approverId: string, remarks?: string) {
  const request = await prisma.request.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approverId,
      approvalRemarks: remarks,
      approvedAt: new Date(),
    },
  });

  // TODO: Send approval notification email

  revalidatePath('/requests');
  revalidatePath(`/requests/${id}`);
  return request;
}

export async function rejectRequest(id: string, approverId: string, remarks: string) {
  const request = await prisma.request.update({
    where: { id },
    data: {
      status: 'REJECTED',
      approverId,
      approvalRemarks: remarks,
    },
  });

  // TODO: Send rejection notification email

  revalidatePath('/requests');
  revalidatePath(`/requests/${id}`);
  return request;
}

export async function completeRequest(id: string) {
  const request = await prisma.request.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  // TODO: Send completion notification email

  revalidatePath('/requests');
  revalidatePath(`/requests/${id}`);
  return request;
}

export async function addRequestComment(requestId: string, comment: string, commentBy: string) {
  const requestComment = await prisma.requestComment.create({
    data: {
      requestId,
      comment,
      commentBy,
    },
  });

  revalidatePath(`/requests/${requestId}`);
  return requestComment;
}

export async function getRequestStats() {
  const [total, byStatus, byType, byPriority] = await Promise.all([
    prisma.request.count(),
    prisma.request.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.request.groupBy({
      by: ['requestType'],
      _count: { requestType: true },
    }),
    prisma.request.groupBy({
      by: ['priority'],
      _count: { priority: true },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.status })),
    byType: byType.map((t) => ({ type: t.requestType, count: t._count.requestType })),
    byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count.priority })),
  };
}

export async function getPendingRequests() {
  return prisma.request.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      company: true,
      location: true,
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' },
    ],
  });
}
