import { prisma } from '../database/prisma.js';
import { AppError } from '../middleware/errors.js';

const clean = (value = '') => String(value).toUpperCase().replace(/[^A-Z0-9]/g, '');

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] !== b[j - 1]));
      diagonal = above;
    }
  }
  return row[b.length];
}

export function serialMatches(expected, observed) {
  const a = clean(expected); const b = clean(observed);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  if (a.length >= 8 && b.length >= 8 && a.slice(-8) === b.slice(-8)) return true;
  return Math.max(a.length, b.length) > 10 && distance(a, b) <= 2;
}

export async function verifyAssignment(assignmentId, observedAssetId, observedSerial) {
  const assignment = await prisma.assetAssignment.findUnique({ where: { id: assignmentId }, include: { asset: true } });
  if (!assignment) throw new AppError(404, 'Assignment not found');
  const assetMatch = clean(assignment.asset.assetId) === clean(observedAssetId);
  const serialMatch = serialMatches(assignment.asset.serialNumber, observedSerial);
  const verified = assetMatch && serialMatch;
  const updated = await prisma.assetAssignment.update({ where: { id: assignmentId }, data: { qrVerified: verified } });
  return { verified, assetMatch, serialMatch, assignment: updated };
}
