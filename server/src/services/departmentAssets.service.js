import { prisma } from '../database/prisma.js';
import { assignmentWhere } from '../utils/filters.js';

export function findDepartmentAssets(query) {
  return prisma.assetAssignment.findMany({
    where: assignmentWhere(query),
    include: { asset: true },
    orderBy: [{ asset: { assetId: 'asc' } }, { id: 'desc' }]
  });
}
