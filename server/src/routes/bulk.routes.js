import { Router } from 'express';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { prisma } from '../database/prisma.js';
import { AppError, asyncHandler } from '../middleware/errors.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
export const bulkRouter = Router();

bulkRouter.post('/assets', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'Spreadsheet is required');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new AppError(400, 'Spreadsheet has no worksheet');
  const headers = worksheet.getRow(1).values.slice(1).map((value) => String(value).trim());
  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values = row.values.slice(1);
    rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
  });
  if (!rows.length) throw new AppError(400, 'Spreadsheet has no data rows');
  const data = rows.map((row, index) => ({
    assetId: String(row.assetId || '').trim(), assetModel: String(row.assetModel || '').trim(),
    datePurchased: String(row.datePurchased || '').trim(), serialNumber: String(row.serialNumber || '').trim(),
    area: String(row.area || '').trim(), hardwareType: String(row.hardwareType || '').trim(), row: index + 2
  }));
  const invalid = data.filter((r) => !r.assetId || !r.assetModel || !r.serialNumber || !r.area || !r.hardwareType || !/^\d{2}-\d{2}-\d{4}$/.test(r.datePurchased));
  if (invalid.length) throw new AppError(400, 'Spreadsheet validation failed', invalid.map((r) => ({ row: r.row })));
  const created = await prisma.$transaction(data.map(({ row, ...item }) => prisma.hardwareAsset.create({ data: item })));
  res.status(201).json({ created: created.length });
}));
