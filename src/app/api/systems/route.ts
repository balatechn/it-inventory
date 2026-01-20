import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { systemSchema } from '@/lib/validations';
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
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    const validated = systemSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validated, null, 2));

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    // Generate asset tag if not provided
    if (!cleanedData.assetTag) {
      const count = await prisma.system.count();
      cleanedData.assetTag = `AST-${String(count + 1).padStart(5, '0')}`;
    }

    // Set default status if not provided
    if (!cleanedData.status) {
      cleanedData.status = 'IN_STOCK';
    }

    // Set default product type if not provided
    if (!cleanedData.productType) {
      cleanedData.productType = 'OTHER';
    }

    console.log('Cleaned data:', JSON.stringify(cleanedData, null, 2));

    const system = await prisma.system.create({
      data: cleanedData as any,
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entityType: 'System',
      entityId: system.id,
      newValues: system as unknown as Record<string, unknown>,
      companyId: system.companyId,
      performedBy: 'Admin',
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

    // Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A system with this asset tag already exists' },
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
      { error: 'Failed to create system', details: error.message },
      { status: 500 }
    );
  }
}
