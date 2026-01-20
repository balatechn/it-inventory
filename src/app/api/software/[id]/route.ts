import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { softwareSchema } from '@/lib/validations';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const software = await prisma.software.findUnique({
      where: { id },
      include: {
        company: true,
        location: true,
        vendor: true,
        licenses: {
          include: {
            employee: true,
          },
        },
        systemSoftware: {
          include: {
            system: true,
          },
        },
      },
    });

    if (!software) {
      return NextResponse.json(
        { error: 'Software not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(software);
  } catch (error) {
    console.error('Error fetching software:', error);
    return NextResponse.json(
      { error: 'Failed to fetch software' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = softwareSchema.partial().parse(body);

    // Get old values for audit log
    const oldSoftware = await prisma.software.findUnique({ where: { id } });

    const software = await prisma.software.update({
      where: { id },
      data: validated as any,
    });

    // Create audit log
    const { oldValues, newValues } = getChangedFields(
      oldSoftware as Record<string, unknown>,
      software as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Software',
      entityId: id,
      oldValues,
      newValues,
      companyId: software.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(software);
  } catch (error: any) {
    console.error('Error updating software:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Software not found' },
        { status: 404 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update software' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Get software data for audit log before deleting
    const software = await prisma.software.findUnique({ where: { id } });
    
    await prisma.software.delete({
      where: { id },
    });

    // Create audit log
    if (software) {
      await createAuditLog({
        action: 'DELETE',
        entityType: 'Software',
        entityId: id,
        oldValues: software as unknown as Record<string, unknown>,
        companyId: software.companyId,
        performedBy: 'Admin',
      });
    }

    return NextResponse.json({ message: 'Software deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting software:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Software not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete software' },
      { status: 500 }
    );
  }
}
