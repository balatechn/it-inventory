import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { systemSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId');
    const locationId = searchParams.get('locationId');
    const status = searchParams.get('status');
    const productType = searchParams.get('productType');

    const where: any = {};

    if (search) {
      where.OR = [
        { assetTag: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
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
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.system.count({ where }),
    ]);

    return NextResponse.json({
      data: systems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching systems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch systems' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = systemSchema.parse(body);

    const system = await prisma.system.create({
      data: validated as any,
    });

    return NextResponse.json(system, { status: 201 });
  } catch (error: any) {
    console.error('Error creating system:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create system' },
      { status: 500 }
    );
  }
}
