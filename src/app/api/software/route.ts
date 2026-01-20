import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { softwareSchema } from '@/lib/validations';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId');
    const isActive = searchParams.get('isActive');
    const licenseType = searchParams.get('licenseType');
    const category = searchParams.get('category');

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { publisher: { contains: search, mode: 'insensitive' } },
        { licenseKey: { contains: search } },
      ];
    }

    if (companyId) where.companyId = companyId;
    if (isActive !== null && isActive !== undefined) where.isActive = isActive === 'true';
    if (licenseType) where.licenseType = licenseType;
    if (category) where.category = category;

    const [software, total] = await Promise.all([
      prisma.software.findMany({
        where,
        include: {
          company: true,
          vendor: true,
          _count: {
            select: { licenses: true, systemSoftware: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.software.count({ where }),
    ]);

    return NextResponse.json({
      data: software,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching software:', error);
    return NextResponse.json(
      { error: 'Failed to fetch software' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = softwareSchema.parse(body);

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    // Set defaults if not provided
    if (!cleanedData.licenseType) {
      cleanedData.licenseType = 'PERPETUAL';
    }
    if (!cleanedData.category) {
      cleanedData.category = 'OTHER';
    }
    if (cleanedData.totalLicenses === null || cleanedData.totalLicenses === undefined) {
      cleanedData.totalLicenses = 1;
    }
    if (cleanedData.usedLicenses === null || cleanedData.usedLicenses === undefined) {
      cleanedData.usedLicenses = 0;
    }

    const software = await prisma.software.create({
      data: cleanedData as any,
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entityType: 'Software',
      entityId: software.id,
      newValues: software as unknown as Record<string, unknown>,
      companyId: software.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(software, { status: 201 });
  } catch (error: any) {
    console.error('Error creating software:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference: company, location, or vendor not found' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create software', details: error.message },
      { status: 500 }
    );
  }
}
