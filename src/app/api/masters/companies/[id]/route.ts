import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const oldCompany = await prisma.company.findUnique({ where: { id } });
    if (!oldCompany) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code,
        description: body.description || null,
      },
    });

    const { oldValues, newValues } = getChangedFields(
      oldCompany as unknown as Record<string, unknown>,
      company as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Company',
      entityId: id,
      oldValues,
      newValues,
      performedBy: 'Admin',
    });

    return NextResponse.json(company);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Company code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    await prisma.company.delete({ where: { id } });

    await createAuditLog({
      action: 'DELETE',
      entityType: 'Company',
      entityId: id,
      oldValues: company as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete company with associated records' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
