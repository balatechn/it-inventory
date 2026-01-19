import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mobileSchema } from '@/lib/validations';

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
    const validated = mobileSchema.partial().parse(body);

    const mobile = await prisma.mobile.update({
      where: { id },
      data: validated as any,
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

    return NextResponse.json(
      { error: 'Failed to update mobile' },
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
    await prisma.mobile.delete({
      where: { id },
    });

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
