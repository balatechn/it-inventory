import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requestSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const requestType = searchParams.get('requestType');
    const priority = searchParams.get('priority');

    const where: any = {};

    if (search) {
      where.OR = [
        { requestNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (requestType) where.requestType = requestType;
    if (priority) where.priority = priority;

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          company: true,
          location: true,
          requester: true,
          approver: true,
          department: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json({
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = requestSchema.parse(body);

    // Generate request number
    const count = await prisma.request.count();
    const requestNumber = `REQ-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const newRequest = await prisma.request.create({
      data: {
        ...validated,
        requestNumber,
      } as any,
    });

    // TODO: Send email notification using Mailgun
    // await sendRequestNotification(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error('Error creating request:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
