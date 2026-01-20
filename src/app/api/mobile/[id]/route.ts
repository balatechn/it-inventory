import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mobileSchema } from '@/lib/validations';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const mobile = await prisma.mobile.findUnique({
      where: { id },
      include: {
        company: true,
        location: true,
        employee: true,
      },
    });

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mobile);
  } catch (error) {
    console.error('Error fetching mobile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mobile' },
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
    console.log('Update mobile body:', JSON.stringify(body, null, 2));
    
    const validated = mobileSchema.partial().parse(body);

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    console.log('Cleaned mobile data:', JSON.stringify(cleanedData, null, 2));

    // Get old values for audit log
    const oldMobile = await prisma.mobile.findUnique({ where: { id } });

    if (!oldMobile) {
      return NextResponse.json(
        { error: 'Mobile not found' },
        { status: 404 }
      );
    }

    const mobile = await prisma.mobile.update({
      where: { id },
      data: cleanedData as any,
    });

    // Create audit log
    const { oldValues, newValues } = getChangedFields(
      oldMobile as Record<string, unknown>,
      mobile as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Mobile',
      entityId: id,
      oldValues,
      newValues,
      companyId: mobile.companyId,
      performedBy: 'Admin',
    });

    return NextResponse.json(mobile);
  } catch (error: any) {
    console.error('Error updating mobile:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Mobile not found' },
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
        { error: 'A mobile device with this IMEI already exists' },
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
      { error: 'Failed to update mobile', details: error.message },
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
    
    // Get mobile data for audit log before deleting
    const mobile = await prisma.mobile.findUnique({ where: { id } });
    
    await prisma.mobile.delete({
      where: { id },
    });

    // Create audit log
    if (mobile) {
      await createAuditLog({
        action: 'DELETE',
        entityType: 'Mobile',
        entityId: id,
        oldValues: mobile as unknown as Record<string, unknown>,
        companyId: mobile.companyId,
        performedBy: 'Admin',
      });
    }

    return NextResponse.json({ message: 'Mobile deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting mobile:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Mobile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete mobile' },
      { status: 500 }
    );
  }
}
