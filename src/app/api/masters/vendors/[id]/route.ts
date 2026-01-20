import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const oldVendor = await prisma.vendor.findUnique({ where: { id } });
    if (!oldVendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const vendor = await prisma.vendor.update({
      where: { id },
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

    const { oldValues, newValues } = getChangedFields(
      oldVendor as unknown as Record<string, unknown>,
      vendor as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Vendor',
      entityId: id,
      oldValues,
      newValues,
      performedBy: 'Admin',
    });

    return NextResponse.json(vendor);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Vendor already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const vendor = await prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    await prisma.vendor.delete({ where: { id } });

    await createAuditLog({
      action: 'DELETE',
      entityType: 'Vendor',
      entityId: id,
      oldValues: vendor as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete vendor with associated records' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
