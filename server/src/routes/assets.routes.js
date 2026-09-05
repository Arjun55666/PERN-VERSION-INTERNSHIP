import { Router } from 'express';
import { z } from 'zod';
import QRCode from 'qrcode';
import { prisma } from '../database/prisma.js';
import { AppError, asyncHandler } from '../middleware/errors.js';
import { assetWhere } from '../utils/filters.js';
import { generateAsset } from '../controllers/assets.controller.js';
import { qrPath, saveQr } from '../services/asset.service.js';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';

export const assetsRouter = Router();

assetsRouter.post('/generate', asyncHandler(generateAsset));

const assetInput = z.object({
  assetId: z.string().trim().min(1).max(50),
  assetModel: z.string().trim().min(1).max(100),
  datePurchased: z.string().trim().regex(/^\d{2}-\d{2}-\d{4}$/, 'Use DD-MM-YYYY'),
  serialNumber: z.string().trim().min(1).max(100),
  area: z.string().trim().min(1).max(100),
  hardwareType: z.string().trim().min(1).max(100)
});

const pageInfo = (query) => ({
  page: Math.max(Number(query.page) || 1, 1),
  pageSize: Math.min(Math.max(Number(query.pageSize) || 25, 1), 100)
});

assetsRouter.get('/', asyncHandler(async (req, res) => {
  const where = assetWhere(req.query);
  const { page, pageSize } = pageInfo(req.query);
  const [items, total] = await prisma.$transaction([
    prisma.hardwareAsset.findMany({
      where,
      include: { assignments: { where: { isActive: true }, take: 1 } },
      orderBy: { assetId: 'asc' }, skip: (page - 1) * pageSize, take: pageSize
    }),
    prisma.hardwareAsset.count({ where })
  ]);
  res.json({ items, page, pageSize, total });
}));

assetsRouter.get('/:assetId', asyncHandler(async (req, res) => {
  const asset = await prisma.hardwareAsset.findUnique({
    where: { assetId: req.params.assetId },
    include: { assignments: { orderBy: { id: 'desc' } } }
  });
  if (!asset) throw new AppError(404, 'Asset not found');
  res.json(asset);
}));

assetsRouter.post('/', asyncHandler(async (req, res) => {
  const data = assetInput.parse(req.body);
  const asset = await prisma.hardwareAsset.create({ data });
  res.status(201).json(asset);
}));

assetsRouter.patch('/:assetId/status', asyncHandler(async (req, res) => {
  const data = z.object({ isWorking: z.boolean().optional(), isSold: z.boolean().optional() })
    .refine((v) => Object.keys(v).length > 0, 'At least one status is required')
    .parse(req.body);
  const asset = await prisma.hardwareAsset.update({ where: { assetId: req.params.assetId }, data });
  res.json(asset);
}));

assetsRouter.get('/:assetId/qr', asyncHandler(async (req, res) => {
  const asset = await prisma.hardwareAsset.findUnique({ where: { assetId: req.params.assetId } });
  if (!asset) throw new AppError(404, 'Asset not found');
  const assignmentId = req.query.assignment_id ? Number(req.query.assignment_id) : undefined;
  const filename = qrPath(asset.assetId, assignmentId);
  try { await access(filename); } catch {
    const active = await prisma.assetAssignment.findFirst({ where: { assetId: asset.id, isActive: true }, orderBy: { id: 'desc' } });
    await saveQr(asset, assignmentId ? active?.id === assignmentId ? active : undefined : active);
  }
  res.set({ 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="${asset.assetId}.png"` });
  createReadStream(filename).pipe(res);
}));
