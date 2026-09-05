import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma.js';
import { asyncHandler } from '../middleware/errors.js';

export const locationsRouter = Router();

locationsRouter.get('/', asyncHandler(async (req, res) => {
  const capacities = await prisma.locationAssetCount.findMany({ orderBy: { locationName: 'asc' } });
  // Use the configured location list as the canonical selector, including
  // locations that currently have no seeded/demo assets.
  res.json({ capacities, areas: capacities.map((item) => item.locationName) });
}));

locationsRouter.put('/:locationName', asyncHandler(async (req, res) => {
  const { totalCount } = z.object({ totalCount: z.number().int().min(0) }).parse(req.body);
  const item = await prisma.locationAssetCount.upsert({
    where: { locationName: req.params.locationName },
    update: { totalCount }, create: { locationName: req.params.locationName, totalCount }
  });
  res.json(item);
}));
