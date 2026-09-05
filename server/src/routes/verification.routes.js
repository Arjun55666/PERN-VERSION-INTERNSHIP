import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../database/prisma.js';
import { AppError, asyncHandler } from '../middleware/errors.js';
import { verifyAssignment } from '../services/verification.service.js';

const uploadDir = path.resolve('uploads', 'verification');
await mkdir(uploadDir, { recursive: true });
const allowed = new Set(['image/png', 'image/jpeg', 'image/webp']);
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: (Number(process.env.MAX_UPLOAD_MB) || 10) * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => cb(allowed.has(file.mimetype) ? null : new AppError(400, 'Unsupported image type'), allowed.has(file.mimetype))
});

export const verificationRouter = Router();

verificationRouter.post('/:assignmentId/check', asyncHandler(async (req, res) => {
  const input = z.object({ assetId: z.string().trim().min(1), serialNumber: z.string().trim().min(1) }).parse(req.body);
  res.json(await verifyAssignment(Number(req.params.assignmentId), input.assetId, input.serialNumber));
}));

verificationRouter.post('/:assignmentId', upload.fields([{ name: 'qrImage', maxCount: 1 }, { name: 'serialImage', maxCount: 1 }]), asyncHandler(async (req, res) => {
  const assignmentId = z.coerce.number().int().positive().parse(req.params.assignmentId);
  const { verified } = z.object({ verified: z.enum(['true', 'false']).transform((v) => v === 'true') }).parse(req.body);
  const assignment = await prisma.assetAssignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError(404, 'Assignment not found');
  const qr = req.files?.qrImage?.[0];
  const serial = req.files?.serialImage?.[0];
  const updated = await prisma.assetAssignment.update({
    where: { id: assignmentId },
    data: {
      qrVerified: verified,
      ...(qr && { qrVerifiedImage: `/uploads/verification/${qr.filename}` }),
      ...(serial && { serialVerifiedImage: `/uploads/verification/${serial.filename}` })
    }
  });
  res.json(updated);
}));
