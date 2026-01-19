import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requestSchema } from '@/lib/validations';

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
    const validated = requestSchema.partial().parse(body);

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: validated as any,
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

    return NextResponse.json(
      { error: 'Failed to update request' },
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
    await prisma.request.delete({
      where: { id },
    });

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
