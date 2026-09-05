import { Router } from 'express';
import { stringify } from 'csv-stringify/sync';
import PDFDocument from 'pdfkit';
import { prisma } from '../database/prisma.js';
import { asyncHandler } from '../middleware/errors.js';
import { assetWhere, assignmentWhere } from '../utils/filters.js';

export const reportsRouter = Router();

const assignmentRows = (items) => items.map((item) => ({
  Department: item.department,
  'Employee Code': item.employeeCode,
  'Employee Name': item.employeeName,
  'Assigned Date': item.assignedDate,
  'Asset ID': item.asset.assetId,
  Model: item.asset.assetModel,
  'Serial Number': item.asset.serialNumber,
  Location: item.asset.area,
  Type: item.asset.hardwareType,
  Status: item.isActive ? 'Active' : 'Inactive'
}));

const downloadAssignmentsCsv = asyncHandler(async (req, res) => {
  const items = await prisma.assetAssignment.findMany({
    where: assignmentWhere(req.query), include: { asset: true }, orderBy: { id: 'desc' }
  });
  const csv = stringify(assignmentRows(items), { header: true });
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="assignment-history.csv"' });
  res.send(csv);
});

reportsRouter.get('/assignments.csv', downloadAssignmentsCsv);
reportsRouter.get('/download-history', downloadAssignmentsCsv);

const downloadAssignmentsPdf = asyncHandler(async (req, res) => {
  const items = await prisma.assetAssignment.findMany({
    where: assignmentWhere(req.query), include: { asset: true }, orderBy: { id: 'desc' }
  });
  res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="assignment-history.pdf"' });
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 32 });
  doc.pipe(res);
  doc.fontSize(18).text('Assignment History', { align: 'center' }).moveDown();
  doc.fontSize(9).text(`Filters: location=${req.query.area || 'All'}, department=${req.query.department || 'All'}, status=${req.query.status || 'All'}`).moveDown();
  for (const row of assignmentRows(items)) {
    doc.text(`${row['Asset ID']} | ${row.Location} | ${row.Department} | ${row['Employee Code']} | ${row.Status}`);
  }
  if (!items.length) doc.text('No assignments matched the selected filters.');
  doc.end();
});

reportsRouter.get('/assignments.pdf', downloadAssignmentsPdf);
reportsRouter.get('/download-history-pdf', downloadAssignmentsPdf);

reportsRouter.get('/assets.csv', asyncHandler(async (req, res) => {
  const items = await prisma.hardwareAsset.findMany({ where: assetWhere(req.query), orderBy: { assetId: 'asc' } });
  const csv = stringify(items.map((a) => ({
    'Asset ID': a.assetId, Model: a.assetModel, 'Serial Number': a.serialNumber,
    Location: a.area, Type: a.hardwareType, Working: a.isWorking, Sold: a.isSold
  })), { header: true });
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="assets.csv"' });
  res.send(csv);
}));
