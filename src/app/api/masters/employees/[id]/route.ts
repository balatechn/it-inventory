import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const oldEmployee = await prisma.employee.findUnique({ where: { id } });
    if (!oldEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        employeeCode: body.employeeCode,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        designation: body.designation || null,
        companyId: body.companyId,
        locationId: body.locationId,
        departmentId: body.departmentId || null,
        isActive: body.isActive ?? true,
      },
    });

    const { oldValues, newValues } = getChangedFields(
      oldEmployee as unknown as Record<string, unknown>,
      employee as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Employee',
      entityId: id,
      oldValues,
      newValues,
      companyId: employee.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json({ error: `Employee ${field} already exists` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    await prisma.employee.delete({ where: { id } });

    await createAuditLog({
      action: 'DELETE',
      entityType: 'Employee',
      entityId: id,
      oldValues: employee as unknown as Record<string, unknown>,
      companyId: employee.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete employee with associated records' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
