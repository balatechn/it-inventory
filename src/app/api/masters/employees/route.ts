import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        company: { select: { name: true } },
        location: { select: { name: true } },
        department: { select: { name: true } },
      },
      orderBy: { firstName: 'asc' },
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const employee = await prisma.employee.create({
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

    await createAuditLog({
      action: 'CREATE',
      entityType: 'Employee',
      entityId: employee.id,
      newValues: employee as unknown as Record<string, unknown>,
      companyId: employee.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return NextResponse.json({ error: `Employee ${field} already exists` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
