import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { code: 'ISKY' },
      update: {},
      create: {
        code: 'ISKY',
        name: 'ISKY Technologies',
        description: 'IT Solutions Provider',
        isActive: true,
      },
    }),
    prisma.company.upsert({
      where: { code: 'NCPL' },
      update: {},
      create: {
        code: 'NCPL',
        name: 'National Computers Pvt Ltd',
        description: 'Computer Hardware & Services',
        isActive: true,
      },
    }),
    prisma.company.upsert({
      where: { code: 'NIPL' },
      update: {},
      create: {
        code: 'NIPL',
        name: 'National Industries Pvt Ltd',
        description: 'Manufacturing',
        isActive: true,
      },
    }),
    prisma.company.upsert({
      where: { code: 'NRPL' },
      update: {},
      create: {
        code: 'NRPL',
        name: 'National Resources Pvt Ltd',
        description: 'Resource Management',
        isActive: true,
      },
    }),
    prisma.company.upsert({
      where: { code: 'RAINLAND' },
      update: {},
      create: {
        code: 'RAINLAND',
        name: 'Rainland Auto Corp',
        description: 'Automotive Solutions',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${companies.length} companies`);

  // Create Locations for each company
  const locationData = [
    { code: 'HO-BLR', name: 'Head Office - Bangalore', city: 'Bangalore', state: 'Karnataka', company: companies[0] },
    { code: 'BR-CHN', name: 'Branch Office - Chennai', city: 'Chennai', state: 'Tamil Nadu', company: companies[0] },
    { code: 'HO-LDH', name: 'Head Office - Ludhiana', city: 'Ludhiana', state: 'Punjab', company: companies[1] },
    { code: 'BR-DEL', name: 'Branch Office - Delhi', city: 'Delhi', state: 'Delhi', company: companies[1] },
    { code: 'HO-MUM', name: 'Head Office - Mumbai', city: 'Mumbai', state: 'Maharashtra', company: companies[2] },
    { code: 'WH-PUN', name: 'Warehouse - Pune', city: 'Pune', state: 'Maharashtra', company: companies[2] },
    { code: 'HO-HYD', name: 'Head Office - Hyderabad', city: 'Hyderabad', state: 'Telangana', company: companies[3] },
    { code: 'RL-BLR', name: 'Rainland - Bangalore', city: 'Bangalore', state: 'Karnataka', company: companies[4] },
    { code: 'RL-MNG', name: 'Rainland - Mangaluru', city: 'Mangaluru', state: 'Karnataka', company: companies[4] },
  ];

  const locations = await Promise.all(
    locationData.map((loc) =>
      prisma.location.upsert({
        where: { code: loc.code },
        update: {},
        create: {
          code: loc.code,
          name: loc.name,
          city: loc.city,
          state: loc.state,
          companyId: loc.company.id,
          isActive: true,
        },
      })
    )
  );

  console.log(`✅ Created ${locations.length} locations`);

  // Create Departments
  const deptNames = ['IT', 'HR', 'Finance', 'Sales', 'Operations', 'Admin', 'Management'];
  const departments: any[] = [];
  
  for (const company of companies) {
    for (const deptName of deptNames) {
      const dept = await prisma.department.upsert({
        where: {
          companyId_name: {
            companyId: company.id,
            name: deptName,
          },
        },
        update: {},
        create: {
          name: deptName,
          code: `${company.code}-${deptName.toUpperCase().slice(0, 3)}`,
          companyId: company.id,
          isActive: true,
        },
      });
      departments.push(dept);
    }
  }

  console.log(`✅ Created ${departments.length} departments`);

  // Create Vendors
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { name: 'Dell Technologies' },
      update: {},
      create: {
        name: 'Dell Technologies',
        contactPerson: 'Rahul Sharma',
        email: 'sales@dell.com',
        phone: '+91 9876543210',
        city: 'Bangalore',
        state: 'Karnataka',
        isActive: true,
      },
    }),
    prisma.vendor.upsert({
      where: { name: 'HP India' },
      update: {},
      create: {
        name: 'HP India',
        contactPerson: 'Priya Patel',
        email: 'sales@hp.com',
        phone: '+91 9876543211',
        city: 'Mumbai',
        state: 'Maharashtra',
        isActive: true,
      },
    }),
    prisma.vendor.upsert({
      where: { name: 'Lenovo India' },
      update: {},
      create: {
        name: 'Lenovo India',
        contactPerson: 'Amit Kumar',
        email: 'sales@lenovo.com',
        phone: '+91 9876543212',
        city: 'Delhi',
        state: 'Delhi',
        isActive: true,
      },
    }),
    prisma.vendor.upsert({
      where: { name: 'Microsoft India' },
      update: {},
      create: {
        name: 'Microsoft India',
        contactPerson: 'Neha Singh',
        email: 'sales@microsoft.com',
        phone: '+91 9876543213',
        city: 'Hyderabad',
        state: 'Telangana',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${vendors.length} vendors`);

  // Create Employees
  const employeeData = [
    { firstName: 'John', lastName: 'Smith', email: 'john.smith@isky.com', designation: 'IT Manager', companyIdx: 0, locationIdx: 0, deptName: 'IT' },
    { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@ncpl.com', designation: 'HR Manager', companyIdx: 1, locationIdx: 2, deptName: 'HR' },
    { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@nipl.com', designation: 'Finance Head', companyIdx: 2, locationIdx: 4, deptName: 'Finance' },
    { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@nrpl.com', designation: 'Sales Director', companyIdx: 3, locationIdx: 6, deptName: 'Sales' },
    { firstName: 'Tom', lastName: 'Brown', email: 'tom.brown@rainland.com', designation: 'Operations Manager', companyIdx: 4, locationIdx: 7, deptName: 'Operations' },
    { firstName: 'Alice', lastName: 'Davis', email: 'alice.davis@isky.com', designation: 'Software Developer', companyIdx: 0, locationIdx: 0, deptName: 'IT' },
    { firstName: 'Bob', lastName: 'Miller', email: 'bob.miller@ncpl.com', designation: 'System Admin', companyIdx: 1, locationIdx: 2, deptName: 'IT' },
  ];

  const employees = await Promise.all(
    employeeData.map(async (emp, idx) => {
      const dept = departments.find(
        (d) => d.name === emp.deptName && d.companyId === companies[emp.companyIdx].id
      );
      return prisma.employee.upsert({
        where: { email: emp.email },
        update: {},
        create: {
          employeeCode: `EMP${String(idx + 1).padStart(4, '0')}`,
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          designation: emp.designation,
          companyId: companies[emp.companyIdx].id,
          locationId: locations[emp.locationIdx].id,
          departmentId: dept?.id,
          isActive: true,
        },
      });
    })
  );

  console.log(`✅ Created ${employees.length} employees`);

  // Create Systems (Hardware)
  const systemData = [
    { assetTag: 'AST-00001', productType: 'LAPTOP', manufacturer: 'Dell', model: 'Latitude 5520', serialNumber: 'ABC123XYZ', status: 'ACTIVE', companyIdx: 1, locationIdx: 2, empIdx: 1, vendorIdx: 0, price: 85000 },
    { assetTag: 'AST-00002', productType: 'DESKTOP', manufacturer: 'HP', model: 'ProDesk 400 G7', serialNumber: 'DEF456UVW', status: 'ACTIVE', companyIdx: 4, locationIdx: 7, empIdx: 4, vendorIdx: 1, price: 65000 },
    { assetTag: 'AST-00003', productType: 'LAPTOP', manufacturer: 'Lenovo', model: 'ThinkPad T14', serialNumber: 'GHI789RST', status: 'IN_STOCK', companyIdx: 1, locationIdx: 2, empIdx: null, vendorIdx: 2, price: 92000 },
    { assetTag: 'AST-00004', productType: 'PRINTER', manufacturer: 'Canon', model: 'imageRUNNER 2625i', serialNumber: 'JKL012OPQ', status: 'ACTIVE', companyIdx: 0, locationIdx: 0, empIdx: null, vendorIdx: 0, price: 125000 },
    { assetTag: 'AST-00005', productType: 'SERVER', manufacturer: 'Dell', model: 'PowerEdge R740', serialNumber: 'MNO345LMN', status: 'ACTIVE', companyIdx: 1, locationIdx: 2, empIdx: null, vendorIdx: 0, price: 450000 },
    { assetTag: 'AST-00006', productType: 'LAPTOP', manufacturer: 'Dell', model: 'Latitude 3520', serialNumber: 'PQR678IJK', status: 'MAINTENANCE', companyIdx: 4, locationIdx: 8, empIdx: 4, vendorIdx: 0, price: 72000 },
  ];

  const systems = await Promise.all(
    systemData.map((sys) => {
      const dept = departments.find((d) => d.name === 'IT' && d.companyId === companies[sys.companyIdx].id);
      return prisma.system.create({
        data: {
          assetTag: sys.assetTag,
          productType: sys.productType as any,
          manufacturer: sys.manufacturer,
          model: sys.model,
          serialNumber: sys.serialNumber,
          status: sys.status as any,
          companyId: companies[sys.companyIdx].id,
          locationId: locations[sys.locationIdx].id,
          departmentId: dept?.id,
          currentUserId: sys.empIdx !== null ? employees[sys.empIdx].id : null,
          vendorId: vendors[sys.vendorIdx].id,
          purchasePrice: sys.price,
          purchaseDate: new Date('2024-01-15'),
          warrantyEndDate: new Date('2027-01-15'),
          processor: 'Intel Core i7',
          ram: '16 GB',
          storage: '512 GB SSD',
        },
      });
    })
  );

  console.log(`✅ Created ${systems.length} systems`);

  // Create Software
  const softwareData = [
    { name: 'Microsoft 365 Business', publisher: 'Microsoft', category: 'OFFICE_SUITE', licenseType: 'SUBSCRIPTION', totalLicenses: 100, usedLicenses: 75, companyIdx: 1, vendorIdx: 3, cost: 950000 },
    { name: 'Windows 11 Pro', publisher: 'Microsoft', category: 'OPERATING_SYSTEM', licenseType: 'PERPETUAL', totalLicenses: 150, usedLicenses: 120, companyIdx: 1, vendorIdx: 3, cost: 450000 },
    { name: 'Adobe Creative Cloud', publisher: 'Adobe', category: 'DESIGN', licenseType: 'SUBSCRIPTION', totalLicenses: 20, usedLicenses: 18, companyIdx: 0, vendorIdx: 3, cost: 240000 },
    { name: 'Kaspersky Endpoint Security', publisher: 'Kaspersky', category: 'ANTIVIRUS', licenseType: 'SUBSCRIPTION', totalLicenses: 200, usedLicenses: 180, companyIdx: 1, vendorIdx: 3, cost: 120000 },
    { name: 'AutoCAD 2024', publisher: 'Autodesk', category: 'DESIGN', licenseType: 'SUBSCRIPTION', totalLicenses: 10, usedLicenses: 8, companyIdx: 2, vendorIdx: 3, cost: 180000 },
  ];

  const software = await Promise.all(
    softwareData.map((sw) =>
      prisma.software.create({
        data: {
          name: sw.name,
          publisher: sw.publisher,
          category: sw.category as any,
          licenseType: sw.licenseType as any,
          totalLicenses: sw.totalLicenses,
          usedLicenses: sw.usedLicenses,
          companyId: companies[sw.companyIdx].id,
          vendorId: vendors[sw.vendorIdx].id,
          totalCost: sw.cost,
          currency: 'INR',
          purchaseDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-12-31'),
          isActive: true,
        },
      })
    )
  );

  console.log(`✅ Created ${software.length} software licenses`);

  // Create Mobile Devices
  const mobileData = [
    { manufacturer: 'Apple', model: 'iPhone 14 Pro', imei1: '123456789012345', mobileNumber: '+91 98765 43210', operator: 'Airtel', status: 'ACTIVE', companyIdx: 0, locationIdx: 0, empIdx: 0, price: 129900 },
    { manufacturer: 'Samsung', model: 'Galaxy S23 Ultra', imei1: '234567890123456', mobileNumber: '+91 98765 43211', operator: 'Jio', status: 'ACTIVE', companyIdx: 1, locationIdx: 2, empIdx: 1, price: 124999 },
    { manufacturer: 'OnePlus', model: '11 5G', imei1: '345678901234567', mobileNumber: '+91 98765 43212', operator: 'Vodafone', status: 'ACTIVE', companyIdx: 2, locationIdx: 4, empIdx: 2, price: 61999 },
    { manufacturer: 'Apple', model: 'iPhone 13', imei1: '456789012345678', mobileNumber: '+91 98765 43213', operator: 'Airtel', status: 'ACTIVE', companyIdx: 0, locationIdx: 0, empIdx: 5, price: 69900 },
  ];

  const mobiles = await Promise.all(
    mobileData.map((mob) =>
      prisma.mobile.create({
        data: {
          deviceType: 'Smartphone',
          manufacturer: mob.manufacturer,
          model: mob.model,
          imei1: mob.imei1,
          mobileNumber: mob.mobileNumber,
          operator: mob.operator,
          status: mob.status as any,
          companyId: companies[mob.companyIdx].id,
          locationId: locations[mob.locationIdx].id,
          employeeId: employees[mob.empIdx].id,
          purchasePrice: mob.price,
          purchaseDate: new Date('2023-09-15'),
          planType: 'Corporate',
          monthlyRental: 999,
        },
      })
    )
  );

  console.log(`✅ Created ${mobiles.length} mobile devices`);

  // Create Requests
  const requestData = [
    { type: 'HARDWARE', priority: 'HIGH', subject: 'New Laptop for Developer', description: 'Need a new laptop for joining developer', companyIdx: 1, locationIdx: 2 },
    { type: 'SOFTWARE', priority: 'NORMAL', subject: 'Adobe License Request', description: 'Need Adobe Creative Cloud license for design work', companyIdx: 0, locationIdx: 0 },
    { type: 'MOBILE', priority: 'NORMAL', subject: 'Mobile Phone for Sales Rep', description: 'New mobile device required for field sales', companyIdx: 3, locationIdx: 6 },
  ];

  const requests = await Promise.all(
    requestData.map((req, idx) => {
      const dept = departments.find((d) => d.name === 'IT' && d.companyId === companies[req.companyIdx].id);
      return prisma.request.create({
        data: {
          requestNumber: `REQ-2024-${String(idx + 1).padStart(5, '0')}`,
          requestType: req.type as any,
          priority: req.priority as any,
          subject: req.subject,
          description: req.description,
          status: 'PENDING',
          employeeType: 'EXISTING',
          quantity: 1,
          companyId: companies[req.companyIdx].id,
          locationId: locations[req.locationIdx].id,
          departmentId: dept?.id,
        },
      });
    })
  );

  console.log(`✅ Created ${requests.length} requests`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
