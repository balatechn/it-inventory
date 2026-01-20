import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const department = await prisma.department.create({
      data: {
        name: body.name,
        code: body.code || null,
        companyId: body.companyId,
      },
    });

    await createAuditLog({
      action: 'CREATE',
      entityType: 'Department',
      entityId: department.id,
      newValues: department as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Department code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
