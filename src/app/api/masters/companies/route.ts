import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const company = await prisma.company.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description || null,
      },
    });

    await createAuditLog({
      action: 'CREATE',
      entityType: 'Company',
      entityId: company.id,
      newValues: company as unknown as Record<string, unknown>,
      performedBy: 'Admin',
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    console.error('Error creating company:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Company code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
