import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total counts
    const [
      totalSystems,
      totalSoftware,
      totalMobiles,
      pendingRequests,
      systemsByStatus,
      systemsByCompany,
      systemsByProductType,
      mobilesByOperator,
      softwareByCategory,
      upcomingExpiries,
      recentRequests,
    ] = await Promise.all([
      // Total systems count
      prisma.system.count(),
      
      // Total software count
      prisma.software.count(),
      
      // Total mobiles count
      prisma.mobile.count(),
      
      // Pending requests count
      prisma.request.count({
        where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
      }),
      
      // Systems by status
      prisma.system.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      
      // Systems by company
      prisma.system.groupBy({
        by: ['companyId'],
        _count: { id: true },
      }),
      
      // Systems by product type
      prisma.system.groupBy({
        by: ['productType'],
        _count: { productType: true },
      }),
      
      // Mobiles by operator
      prisma.mobile.groupBy({
        by: ['operator'],
        _count: { operator: true },
        where: { operator: { not: null } },
      }),
      
      // Software by category
      prisma.software.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      
      // Upcoming warranty/license expiries (next 30 days)
      Promise.all([
        prisma.system.findMany({
          where: {
            warrantyEndDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: { id: true, assetTag: true, model: true, warrantyEndDate: true },
          take: 5,
        }),
        prisma.software.findMany({
          where: {
            expiryDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: { id: true, name: true, expiryDate: true },
          take: 5,
        }),
      ]),
      
      // Recent requests
      prisma.request.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { firstName: true, lastName: true } },
          company: { select: { name: true } },
        },
      }),
    ]);

    // Get company names for systems by company
    const companyIds = systemsByCompany.map((s) => s.companyId);
    const companies = await prisma.company.findMany({
      where: { id: { in: companyIds } },
      select: { id: true, name: true },
    });

    const systemsByCompanyWithNames = systemsByCompany.map((item) => ({
      company: companies.find((c) => c.id === item.companyId)?.name || 'Unknown',
      count: item._count.id,
    }));

    // Calculate total asset value
    const [systemsValue, softwareValue, mobilesValue] = await Promise.all([
      prisma.system.aggregate({ _sum: { purchasePrice: true } }),
      prisma.software.aggregate({ _sum: { totalCost: true } }),
      prisma.mobile.aggregate({ _sum: { purchasePrice: true } }),
    ]);

    const totalAssetValue =
      Number(systemsValue._sum.purchasePrice || 0) +
      Number(softwareValue._sum.totalCost || 0) +
      Number(mobilesValue._sum.purchasePrice || 0);

    // Monthly mobile rental
    const monthlyRental = await prisma.mobile.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { monthlyRental: true },
    });

    return NextResponse.json({
      kpis: {
        totalSystems,
        totalSoftware,
        totalMobiles,
        pendingRequests,
        totalAssetValue,
        monthlyMobileRental: monthlyRental._sum.monthlyRental || 0,
      },
      charts: {
        systemsByStatus: systemsByStatus.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
        systemsByCompany: systemsByCompanyWithNames,
        systemsByProductType: systemsByProductType.map((p) => ({
          type: p.productType,
          count: p._count.productType,
        })),
        mobilesByOperator: mobilesByOperator.map((m) => ({
          operator: m.operator,
          count: m._count.operator,
        })),
        softwareByCategory: softwareByCategory.map((s) => ({
          category: s.category,
          count: s._count.category,
        })),
      },
      alerts: {
        warrantyExpiries: upcomingExpiries[0],
        licenseExpiries: upcomingExpiries[1],
      },
      recentRequests: recentRequests.map((r) => ({
        id: r.id,
        requestNumber: r.requestNumber,
        subject: r.subject,
        status: r.status,
        priority: r.priority,
        requester: r.requester ? `${r.requester.firstName} ${r.requester.lastName}` : 'Unknown',
        company: r.company?.name || 'Unknown',
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
