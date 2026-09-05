import { Router } from 'express';
import { prisma } from '../database/prisma.js';
import { asyncHandler } from '../middleware/errors.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', asyncHandler(async (req, res) => {
  const [assets, activeAssignments, sold, notWorking, byArea, byType] = await prisma.$transaction([
    prisma.hardwareAsset.count(),
    prisma.assetAssignment.count({ where: { isActive: true } }),
    prisma.hardwareAsset.count({ where: { isSold: true } }),
    prisma.hardwareAsset.count({ where: { isWorking: false } }),
    prisma.hardwareAsset.groupBy({ by: ['area'], _count: { _all: true }, orderBy: { area: 'asc' } }),
    prisma.hardwareAsset.groupBy({ by: ['hardwareType'], _count: { _all: true }, orderBy: { hardwareType: 'asc' } })
  ]);
  res.json({ assets, activeAssignments, unassigned: assets - activeAssignments - sold, sold, notWorking, byArea, byType });
}));
