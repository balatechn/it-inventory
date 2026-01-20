import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const oldDepartment = await prisma.department.findUnique({ where: { id } });
    if (!oldDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code || null,
        companyId: body.companyId,
      },
    });

    const { oldValues, newValues } = getChangedFields(
      oldDepartment as unknown as Record<string, unknown>,
      department as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Department',
      entityId: id,
      oldValues,
      newValues,
      performedBy: 'Admin',
    });

    return NextResponse.json(department);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Department code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    await prisma.department.delete({ where: { id } });

    await createAuditLog({
      action: 'DELETE',
      entityType: 'Department',
      entityId: id,
      oldValues: department as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete department with associated records' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
