import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { systemSchema } from '@/lib/validations';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const system = await prisma.system.findUnique({
      where: { id },
      include: {
        company: true,
        location: true,
        department: true,
        currentUser: true,
        previousUser: true,
        vendor: true,
        installedSoftware: {
          include: { software: true },
        },
      },
    });

    if (!system) {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system' },
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
    const validated = systemSchema.partial().parse(body);

    // Get old values for audit log
    const oldSystem = await prisma.system.findUnique({ where: { id } });

    const system = await prisma.system.update({
      where: { id },
      data: validated as any,
    });

    // Create audit log
    const { oldValues, newValues } = getChangedFields(
      oldSystem as Record<string, unknown>,
      system as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'System',
      entityId: id,
      oldValues,
      newValues,
      companyId: system.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(system);
  } catch (error: any) {
    console.error('Error updating system:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'System not found' },
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
      { error: 'Failed to update system' },
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
    
    // Get system data for audit log before deleting
    const system = await prisma.system.findUnique({ where: { id } });
    
    await prisma.system.delete({
      where: { id },
    });

    // Create audit log
    if (system) {
      await createAuditLog({
        action: 'DELETE',
        entityType: 'System',
        entityId: id,
        oldValues: system as unknown as Record<string, unknown>,
        companyId: system.companyId,
        performedBy: 'Admin',
      });
    }

    return NextResponse.json({ message: 'System deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting system:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete system' },
      { status: 500 }
    );
  }
}
