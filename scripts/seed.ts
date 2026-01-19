import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create Companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { code: 'ISKY' },
      update: {},
      create: {
        name: 'ISKY',
        code: 'ISKY',
        address: 'Industrial Area, Ludhiana, Punjab',
        status: 'ACTIVE',
      },
    }),
    prisma.company.upsert({
      where: { code: 'NCPL' },
      update: {},
      create: {
        name: 'National Commodities Pvt Ltd',
        code: 'NCPL',
        address: 'Commercial Complex, Delhi',
        status: 'ACTIVE',
      },
    }),
    prisma.company.upsert({
      where: { code: 'NIPL' },
      update: {},
      create: {
        name: 'National Industries Pvt Ltd',
        code: 'NIPL',
        address: 'Industrial Hub, Mumbai',
        status: 'ACTIVE',
      },
    }),
    prisma.company.upsert({
      where: { code: 'NRPL' },
      update: {},
      create: {
        name: 'National Resources Pvt Ltd',
        code: 'NRPL',
        address: 'Tech Park, Bangalore',
        status: 'ACTIVE',
      },
    }),
    prisma.company.upsert({
      where: { code: 'RAC' },
      update: {},
      create: {
        name: 'Rainland Auto Corp',
        code: 'RAC',
        address: 'Auto Zone, Chennai',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`Created ${companies.length} companies`);

  // Create Locations
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: 'loc-ludhiana-hq' },
      update: {},
      create: {
        id: 'loc-ludhiana-hq',
        name: 'Ludhiana HQ',
        address: 'Industrial Area, Phase 1, Ludhiana',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141001',
        companyId: companies[0].id,
        status: 'ACTIVE',
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-delhi-office' },
      update: {},
      create: {
        id: 'loc-delhi-office',
        name: 'Delhi Office',
        address: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        companyId: companies[1].id,
        status: 'ACTIVE',
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-mumbai-office' },
      update: {},
      create: {
        id: 'loc-mumbai-office',
        name: 'Mumbai Office',
        address: 'Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400069',
        companyId: companies[2].id,
        status: 'ACTIVE',
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-bangalore-office' },
      update: {},
      create: {
        id: 'loc-bangalore-office',
        name: 'Bangalore Office',
        address: 'Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        companyId: companies[3].id,
        status: 'ACTIVE',
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-chennai-office' },
      update: {},
      create: {
        id: 'loc-chennai-office',
        name: 'Chennai Office',
        address: 'OMR Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600096',
        companyId: companies[4].id,
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`Created ${locations.length} locations`);

  // Create Users (Employees)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@isky.com' },
      update: {},
      create: {
        email: 'admin@isky.com',
        name: 'Admin User',
        role: 'ADMIN',
        department: 'IT',
        companyId: companies[0].id,
        locationId: locations[0].id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@isky.com' },
      update: {},
      create: {
        email: 'john.doe@isky.com',
        name: 'John Doe',
        role: 'EMPLOYEE',
        department: 'Engineering',
        designation: 'Software Engineer',
        employeeCode: 'ISKY-001',
        companyId: companies[0].id,
        locationId: locations[0].id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@ncpl.com' },
      update: {},
      create: {
        email: 'jane.smith@ncpl.com',
        name: 'Jane Smith',
        role: 'EMPLOYEE',
        department: 'Sales',
        designation: 'Sales Manager',
        employeeCode: 'NCPL-001',
        companyId: companies[1].id,
        locationId: locations[1].id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob.johnson@nipl.com' },
      update: {},
      create: {
        email: 'bob.johnson@nipl.com',
        name: 'Bob Johnson',
        role: 'EMPLOYEE',
        department: 'Finance',
        designation: 'Finance Analyst',
        employeeCode: 'NIPL-001',
        companyId: companies[2].id,
        locationId: locations[2].id,
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'alice.wilson@nrpl.com' },
      update: {},
      create: {
        email: 'alice.wilson@nrpl.com',
        name: 'Alice Wilson',
        role: 'MANAGER',
        department: 'Operations',
        designation: 'Operations Manager',
        employeeCode: 'NRPL-001',
        companyId: companies[3].id,
        locationId: locations[3].id,
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Systems (IT Assets)
  const systems = await Promise.all([
    prisma.system.create({
      data: {
        assetTag: 'ISKY-LP-001',
        serialNumber: 'SN-DELL-001',
        productType: 'Laptop',
        brand: 'Dell',
        model: 'Latitude 5520',
        processor: 'Intel Core i7-1185G7',
        ramGB: 16,
        storageType: 'SSD',
        storageGB: 512,
        operatingSystem: 'Windows 11 Pro',
        purchaseDate: new Date('2023-01-15'),
        purchaseCost: 75000,
        warrantyExpiry: new Date('2026-01-15'),
        status: 'ACTIVE',
        companyId: companies[0].id,
        locationId: locations[0].id,
        employeeId: users[1].id,
      },
    }),
    prisma.system.create({
      data: {
        assetTag: 'NCPL-DT-001',
        serialNumber: 'SN-HP-001',
        productType: 'Desktop',
        brand: 'HP',
        model: 'ProDesk 400 G7',
        processor: 'Intel Core i5-10500',
        ramGB: 8,
        storageType: 'SSD',
        storageGB: 256,
        operatingSystem: 'Windows 10 Pro',
        purchaseDate: new Date('2022-08-20'),
        purchaseCost: 55000,
        warrantyExpiry: new Date('2025-08-20'),
        status: 'ACTIVE',
        companyId: companies[1].id,
        locationId: locations[1].id,
        employeeId: users[2].id,
      },
    }),
    prisma.system.create({
      data: {
        assetTag: 'NIPL-LP-001',
        serialNumber: 'SN-LENOVO-001',
        productType: 'Laptop',
        brand: 'Lenovo',
        model: 'ThinkPad T14',
        processor: 'AMD Ryzen 5 PRO 4650U',
        ramGB: 16,
        storageType: 'SSD',
        storageGB: 512,
        operatingSystem: 'Windows 11 Pro',
        purchaseDate: new Date('2023-03-10'),
        purchaseCost: 82000,
        warrantyExpiry: new Date('2026-03-10'),
        status: 'IN_REPAIR',
        companyId: companies[2].id,
        locationId: locations[2].id,
        employeeId: users[3].id,
      },
    }),
    prisma.system.create({
      data: {
        assetTag: 'NRPL-PR-001',
        serialNumber: 'SN-HP-PR-001',
        productType: 'Printer',
        brand: 'HP',
        model: 'LaserJet Pro M404dn',
        purchaseDate: new Date('2022-12-01'),
        purchaseCost: 35000,
        warrantyExpiry: new Date('2024-12-01'),
        status: 'ACTIVE',
        companyId: companies[3].id,
        locationId: locations[3].id,
      },
    }),
    prisma.system.create({
      data: {
        assetTag: 'RAC-LP-001',
        serialNumber: 'SN-APPLE-001',
        productType: 'Laptop',
        brand: 'Apple',
        model: 'MacBook Pro 14"',
        processor: 'Apple M2 Pro',
        ramGB: 16,
        storageType: 'SSD',
        storageGB: 512,
        operatingSystem: 'macOS Ventura',
        purchaseDate: new Date('2023-06-15'),
        purchaseCost: 195000,
        warrantyExpiry: new Date('2024-06-15'),
        status: 'ACTIVE',
        companyId: companies[4].id,
        locationId: locations[4].id,
      },
    }),
  ]);

  console.log(`Created ${systems.length} systems`);

  // Create Software
  const software = await Promise.all([
    prisma.software.create({
      data: {
        name: 'Microsoft Office 365 Business',
        vendor: 'Microsoft',
        version: '2023',
        category: 'Office Suite',
        licenseType: 'SUBSCRIPTION',
        softwareType: 'CLOUD',
        totalLicenses: 50,
        usedLicenses: 35,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
        purchaseDate: new Date('2023-01-01'),
        expiryDate: new Date('2024-01-01'),
        purchaseCost: 250000,
        renewalCost: 250000,
        billingCycle: 'YEARLY',
        status: 'ACTIVE',
        companyId: companies[0].id,
      },
    }),
    prisma.software.create({
      data: {
        name: 'Adobe Creative Cloud',
        vendor: 'Adobe',
        version: '2023',
        category: 'Design Software',
        licenseType: 'SUBSCRIPTION',
        softwareType: 'DESKTOP',
        totalLicenses: 10,
        usedLicenses: 8,
        purchaseDate: new Date('2023-02-15'),
        expiryDate: new Date('2024-02-15'),
        purchaseCost: 180000,
        renewalCost: 180000,
        billingCycle: 'YEARLY',
        status: 'ACTIVE',
        companyId: companies[0].id,
      },
    }),
    prisma.software.create({
      data: {
        name: 'Tally Prime',
        vendor: 'Tally Solutions',
        version: '3.0',
        category: 'ERP/CRM',
        licenseType: 'PERPETUAL',
        softwareType: 'DESKTOP',
        totalLicenses: 20,
        usedLicenses: 15,
        purchaseDate: new Date('2022-06-01'),
        purchaseCost: 150000,
        status: 'ACTIVE',
        companyId: companies[1].id,
      },
    }),
    prisma.software.create({
      data: {
        name: 'AutoCAD',
        vendor: 'Autodesk',
        version: '2023',
        category: 'Design Software',
        licenseType: 'SUBSCRIPTION',
        softwareType: 'DESKTOP',
        totalLicenses: 5,
        usedLicenses: 5,
        purchaseDate: new Date('2023-04-01'),
        expiryDate: new Date('2024-04-01'),
        purchaseCost: 100000,
        renewalCost: 100000,
        billingCycle: 'YEARLY',
        status: 'ACTIVE',
        companyId: companies[2].id,
      },
    }),
  ]);

  console.log(`Created ${software.length} software entries`);

  // Create Mobiles
  const mobiles = await Promise.all([
    prisma.mobile.create({
      data: {
        mobileNumber: '9876543210',
        operator: 'Airtel',
        planType: 'POSTPAID',
        deviceType: 'SMARTPHONE',
        model: 'iPhone 14',
        imei1: '123456789012345',
        serialNumber: 'APPLE-SN-001',
        simNumber: 'SIM-AIR-001',
        dataLimit: 50,
        monthlyRental: 999,
        purchaseDate: new Date('2023-01-20'),
        purchaseCost: 79900,
        activationDate: new Date('2023-01-25'),
        status: 'ACTIVE',
        companyId: companies[0].id,
        locationId: locations[0].id,
        employeeId: users[1].id,
      },
    }),
    prisma.mobile.create({
      data: {
        mobileNumber: '9876543211',
        operator: 'Jio',
        planType: 'POSTPAID',
        deviceType: 'SMARTPHONE',
        model: 'Samsung Galaxy S23',
        imei1: '123456789012346',
        serialNumber: 'SAMSUNG-SN-001',
        simNumber: 'SIM-JIO-001',
        dataLimit: 100,
        monthlyRental: 799,
        purchaseDate: new Date('2023-03-15'),
        purchaseCost: 74999,
        activationDate: new Date('2023-03-18'),
        status: 'ACTIVE',
        companyId: companies[1].id,
        locationId: locations[1].id,
        employeeId: users[2].id,
      },
    }),
    prisma.mobile.create({
      data: {
        mobileNumber: '9876543212',
        operator: 'Vodafone Idea',
        planType: 'POSTPAID',
        deviceType: 'DATA_CARD',
        model: 'JioFi M2S',
        imei1: '123456789012347',
        dataLimit: 150,
        monthlyRental: 499,
        activationDate: new Date('2022-11-10'),
        status: 'ACTIVE',
        companyId: companies[2].id,
        locationId: locations[2].id,
      },
    }),
  ]);

  console.log(`Created ${mobiles.length} mobile entries`);

  // Create Sample Requests
  const requests = await Promise.all([
    prisma.request.create({
      data: {
        requestNumber: 'REQ-2024-00001',
        title: 'New Laptop for Developer',
        description: 'Requesting a new laptop with minimum 16GB RAM and SSD for development work',
        requestType: 'NEW_ASSET',
        priority: 'HIGH',
        status: 'PENDING',
        companyId: companies[0].id,
        locationId: locations[0].id,
        requesterId: users[1].id,
      },
    }),
    prisma.request.create({
      data: {
        requestNumber: 'REQ-2024-00002',
        title: 'Software Installation - Adobe Acrobat',
        description: 'Need Adobe Acrobat Pro for PDF editing and signing documents',
        requestType: 'SOFTWARE',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        companyId: companies[1].id,
        locationId: locations[1].id,
        requesterId: users[2].id,
      },
    }),
    prisma.request.create({
      data: {
        requestNumber: 'REQ-2024-00003',
        title: 'Laptop Repair - Screen Issue',
        description: 'Laptop screen flickering, needs repair or replacement',
        requestType: 'REPAIR',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        companyId: companies[2].id,
        locationId: locations[2].id,
        requesterId: users[3].id,
      },
    }),
  ]);

  console.log(`Created ${requests.length} requests`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
