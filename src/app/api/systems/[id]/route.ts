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
    console.log('Update body:', JSON.stringify(body, null, 2));
    
    const validated = systemSchema.partial().parse(body);

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    console.log('Cleaned data:', JSON.stringify(cleanedData, null, 2));

    // Get old values for audit log
    const oldSystem = await prisma.system.findUnique({ where: { id } });

    if (!oldSystem) {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    const system = await prisma.system.update({
      where: { id },
      data: cleanedData as any,
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

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A system with this asset tag already exists' },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference: company, location, or employee not found' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update system', details: error.message },
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
