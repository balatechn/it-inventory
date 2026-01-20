import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        email: true,
        company: {
          select: {
            code: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    // Format for select dropdown
    const formatted = employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}${emp.company?.code ? ` - ${emp.company.code}` : ''}`,
      employeeCode: emp.employeeCode,
      email: emp.email,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
