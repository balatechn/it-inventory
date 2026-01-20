import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requestSchema } from '@/lib/validations';
import { createAuditLog, getChangedFields } from '@/lib/audit';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const requestData = await prisma.request.findUnique({
      where: { id },
      include: {
        company: true,
        location: true,
        requester: true,
        approver: true,
        department: true,
      },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(requestData);
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
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
    console.log('Update request body:', JSON.stringify(body, null, 2));
    
    const validated = requestSchema.partial().parse(body);

    // Clean up empty strings to null for optional fields
    const cleanedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value === '' || value === undefined) {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = value;
      }
    }

    console.log('Cleaned request data:', JSON.stringify(cleanedData, null, 2));

    // Get old values for audit log
    const oldRequest = await prisma.request.findUnique({ where: { id } });

    if (!oldRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: cleanedData as any,
    });

    // Create audit log
    const { oldValues, newValues } = getChangedFields(
      oldRequest as Record<string, unknown>,
      updatedRequest as unknown as Record<string, unknown>
    );
    await createAuditLog({
      action: 'UPDATE',
      entityType: 'Request',
      entityId: id,
      oldValues,
      newValues,
      companyId: updatedRequest.companyId,
      performedBy: 'Admin',
    });

    // TODO: Send status update notification
    // if (body.status) {
    //   await sendStatusUpdateNotification(updatedRequest);
    // }

    return NextResponse.json(updatedRequest);
  } catch (error: any) {
    console.error('Error updating request:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Request not found' },
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
        { error: 'A request with this number already exists' },
        { status: 400 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference: company, location, requester, approver, or department not found' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update request', details: error.message },
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
    
    // Get request data for audit log before deleting
    const requestData = await prisma.request.findUnique({ where: { id } });
    
    await prisma.request.delete({
      where: { id },
    });

    // Create audit log
    if (requestData) {
      await createAuditLog({
        action: 'DELETE',
        entityType: 'Request',
        entityId: id,
        oldValues: requestData as unknown as Record<string, unknown>,
        companyId: requestData.companyId,
        performedBy: 'Admin',
      });
    }

    return NextResponse.json({ message: 'Request deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting request:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}
