import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma.js';
import { AppError, asyncHandler } from '../middleware/errors.js';
import { assignmentWhere } from '../utils/filters.js';
import { saveQr } from '../services/asset.service.js';

export const assignmentsRouter = Router();

const assignmentInput = z.object({
  assetId: z.string().trim().min(1),
  department: z.string().trim().min(1).max(100),
  employeeName: z.string().trim().min(1).max(100),
  assetModel: z.string().trim().min(1).max(50),
  employeeCode: z.string().trim().min(1).max(50),
  assignedDate: z.string().trim().regex(/^\d{2}-\d{2}-\d{4}$/, 'Use DD-MM-YYYY')
});

assignmentsRouter.get('/', asyncHandler(async (req, res) => {
  const items = await prisma.assetAssignment.findMany({
    where: assignmentWhere(req.query),
    include: { asset: true },
    orderBy: [{ asset: { assetId: 'asc' } }, { id: 'desc' }]
  });
  res.json(items);
}));

assignmentsRouter.post('/', asyncHandler(async (req, res) => {
  const input = assignmentInput.parse(req.body);
  const result = await prisma.$transaction(async (tx) => {
    const asset = await tx.hardwareAsset.findUnique({ where: { assetId: input.assetId } });
    if (!asset) throw new AppError(404, 'Asset not found');
    if (asset.isSold) throw new AppError(409, 'Sold assets cannot be assigned');
    const active = await tx.assetAssignment.findFirst({ where: { assetId: asset.id, isActive: true } });
    if (active) await tx.assetAssignment.update({ where: { id: active.id }, data: { isActive: false, deactivatedAt: new Date() } });
    const assignment = await tx.assetAssignment.create({
      data: { ...input, assetId: asset.id }, include: { asset: true }
    });
    await saveQr(asset, assignment);
    return assignment;
  });
  res.status(201).json(result);
}));

assignmentsRouter.post('/:id/unassign', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.assetAssignment.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, 'Assignment not found');
  if (!existing.isActive) throw new AppError(409, 'Assignment is already inactive');
  const updated = await prisma.assetAssignment.update({
    where: { id }, data: { isActive: false, deactivatedAt: new Date() }
  });
  res.json(updated);
}));

assignmentsRouter.post('/:id/shift', asyncHandler(async (req, res) => {
  const currentId = Number(req.params.id);
  const next = assignmentInput.omit({ assetId: true }).parse(req.body);
  const created = await prisma.$transaction(async (tx) => {
    const current = await tx.assetAssignment.findUnique({ where: { id: currentId } });
    if (!current) throw new AppError(404, 'Assignment not found');
    if (!current.isActive) throw new AppError(409, 'Only active assignments can be shifted');
    await tx.assetAssignment.update({
      where: { id: currentId }, data: { isActive: false, deactivatedAt: new Date() }
    });
    return tx.assetAssignment.create({ data: { ...next, assetId: current.assetId }, include: { asset: true } });
  });
  res.status(201).json(created);
}));
