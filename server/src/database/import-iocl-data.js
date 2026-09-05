import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const source = JSON.parse(await readFile(new URL('./iocl-data.json', import.meta.url), 'utf8'));

const dateTime = (value) => value ? new Date(String(value).replace(' ', 'T') + (String(value).includes('Z') ? '' : 'Z')) : null;

async function main() {
  await prisma.assetAssignment.deleteMany();
  await prisma.hardwareAsset.deleteMany();
  await prisma.locationAssetCount.deleteMany();

  await prisma.hardwareAsset.createMany({ data: source.hardware_assets.map((row) => ({
    id: row.id,
    assetId: row.asset_id,
    assetModel: row.asset_model,
    datePurchased: row.date_purchased,
    serialNumber: row.serial_number,
    area: row.area,
    hardwareType: row.hardware_type,
    isSold: Boolean(row.is_sold),
    isWorking: Boolean(row.is_working),
    createdAt: dateTime(row.created_at)
  })) });

  await prisma.assetAssignment.createMany({ data: source.asset_assignment.map((row) => ({
    id: row.id,
    assetId: row.asset_id,
    department: row.department,
    employeeName: row.employee_name,
    assetModel: row.asset_model,
    employeeCode: row.employee_code,
    assignedDate: row.assigned_date,
    isActive: Boolean(row.is_active),
    deactivatedAt: dateTime(row.deactivated_at),
    createdAt: dateTime(row.created_at),
    qrVerified: row.qr_verified === null ? null : Boolean(row.qr_verified),
    qrVerifiedImage: row.qr_verified_image,
    serialVerifiedImage: row.serial_verified_image
  })) });

  await prisma.locationAssetCount.createMany({ data: source.location_asset_counts.map((row) => ({
    id: row.id,
    locationName: row.location_name,
    totalCount: row.total_count
  })) });

  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('hardware_assets', 'id'), (SELECT MAX(id) FROM hardware_assets), true)`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('asset_assignment', 'id'), (SELECT MAX(id) FROM asset_assignment), true)`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('location_asset_counts', 'id'), (SELECT MAX(id) FROM location_asset_counts), true)`);
  console.log('Imported Flask data:', source.hardware_assets.length, 'assets,', source.asset_assignment.length, 'assignments,', source.location_asset_counts.length, 'locations');
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
