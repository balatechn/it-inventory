import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const oldLocation = await prisma.location.findUnique({ where: { id } });
    if (!oldLocation) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code,
        address: body.address || null,
        city: body.city || 'Unknown',
        state: body.state || 'Karnataka',
        companyId: body.companyId,
      },
    });

    const { oldValues, newValues } = getChangedFields(
      oldLocation as unknown as Record<string, unknown>,
      location as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Location',
      entityId: id,
      oldValues,
      newValues,
      performedBy: 'Admin',
    });

    return NextResponse.json(location);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Location code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    await prisma.location.delete({ where: { id } });

    await createAuditLog({
      action: 'DELETE',
      entityType: 'Location',
      entityId: id,
      oldValues: location as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete location with associated records' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}
