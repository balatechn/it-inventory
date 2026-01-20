import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const vendor = await prisma.vendor.create({
      data: {
        name: body.name,
        contactPerson: body.contactPerson || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        gstin: body.gstNumber || null,
        panNumber: body.panNumber || null,
      },
    });

    await createAuditLog({
      action: 'CREATE',
      entityType: 'Vendor',
      entityId: vendor.id,
      newValues: vendor as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vendor:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Vendor already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}
