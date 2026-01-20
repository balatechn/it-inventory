import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mobileSchema } from '@/lib/validations';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId');
    const locationId = searchParams.get('locationId');
    const status = searchParams.get('status');
    const operator = searchParams.get('operator');

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

    return NextResponse.json({
      data: mobiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching mobiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mobiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = mobileSchema.parse(body);

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    // Set default status if not provided
    if (!cleanedData.status) {
      cleanedData.status = 'ACTIVE';
    }

    const mobile = await prisma.mobile.create({
      data: cleanedData as any,
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entityType: 'Mobile',
      entityId: mobile.id,
      newValues: mobile as unknown as Record<string, unknown>,
      companyId: mobile.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(mobile, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mobile:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference: company, location, or employee not found' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create mobile', details: error.message },
      { status: 500 }
    );
  }
}
