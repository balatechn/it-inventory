import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const location = await prisma.location.create({
      data: {
        name: body.name,
        code: body.code,
        address: body.address || null,
        city: body.city || 'Unknown',
        state: body.state || 'Karnataka',
        companyId: body.companyId,
      },
    });

    await createAuditLog({
      action: 'CREATE',
      entityType: 'Location',
      entityId: location.id,
      newValues: location as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json(location, { status: 201 });
  } catch (error: any) {
    console.error('Error creating location:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Location code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}
