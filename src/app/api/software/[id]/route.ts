import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { softwareSchema } from '@/lib/validations';

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

    const software = await prisma.software.update({
      where: { id },
      data: validated as any,
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
    await prisma.software.delete({
      where: { id },
    });

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
