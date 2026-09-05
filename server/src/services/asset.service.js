import QRCode from 'qrcode';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { prisma } from '../database/prisma.js';
import { AppError } from '../middleware/errors.js';
import { AREA_MAP, HARDWARE_TYPE_MAP, assetQrText, qrFilename } from '../utils/iocl-catalog.js';

const qrDir = path.resolve('uploads', 'qrcodes');

export async function nextAssetId(area, hardwareType) {
  const areaCode = AREA_MAP[area];
  const typeCode = HARDWARE_TYPE_MAP[hardwareType];
  if (!areaCode || !typeCode) throw new AppError(400, 'Invalid Area or Hardware Type selected');
  const prefix = `IOCL-${areaCode}-${typeCode}-`;
  const assets = await prisma.hardwareAsset.findMany({
    where: { assetId: { startsWith: prefix } }, select: { assetId: true }
  });
  const used = new Set(assets.map(({ assetId }) => Number(assetId.slice(prefix.length))).filter(Number.isInteger));
  let number = 1;
  while (used.has(number)) number += 1;
  return `${prefix}${String(number).padStart(4, '0')}`;
}

export async function createAssetWithQr(input) {
  const existing = await prisma.hardwareAsset.findUnique({ where: { serialNumber: input.serialNumber } });
  if (existing) throw new AppError(409, `Serial Number '${input.serialNumber}' already exists`);
  const assetId = await nextAssetId(input.area, input.hardwareType);
  const asset = await prisma.hardwareAsset.create({ data: { ...input, assetId } });
  await saveQr(asset);
  return asset;
}

export async function saveQr(asset, assignment) {
  await mkdir(qrDir, { recursive: true });
  const png = await QRCode.toBuffer(assetQrText(asset, assignment), {
    errorCorrectionLevel: 'H', margin: 4, width: 400, color: { dark: '#0a1628' }
  });
  await writeFile(path.join(qrDir, qrFilename(asset.assetId, assignment?.id)), png);
}

export function qrPath(assetId, assignmentId) {
  return path.join(qrDir, qrFilename(assetId, assignmentId));
}
