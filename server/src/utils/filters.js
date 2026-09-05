export function assetWhere(query = {}) {
  const { q, area, type, status } = query;
  const where = {};
  if (area) where.area = area.trim();
  if (type) where.hardwareType = type.trim();
  if (q?.trim()) {
    const search = q.trim();
    where.OR = [
      { assetId: { contains: search, mode: 'insensitive' } },
      { serialNumber: { contains: search, mode: 'insensitive' } },
      { assetModel: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (status === 'sold') where.isSold = true;
  if (status === 'working') where.isWorking = true;
  if (status === 'not-working') where.isWorking = false;
  return where;
}

export function assignmentWhere(query = {}) {
  const { q, area, type, department, status } = query;
  const where = {};
  if (department) where.department = department.trim();
  if (status === 'active') where.isActive = true;
  if (status === 'inactive') where.isActive = false;
  const asset = {};
  if (area) asset.area = area.trim();
  if (type) asset.hardwareType = type.trim();
  if (Object.keys(asset).length) where.asset = asset;
  if (q?.trim()) {
    const search = q.trim();
    where.OR = [
      { employeeName: { contains: search, mode: 'insensitive' } },
      { employeeCode: { contains: search, mode: 'insensitive' } },
      { asset: { assetId: { contains: search, mode: 'insensitive' } } },
      { asset: { serialNumber: { contains: search, mode: 'insensitive' } } }
    ];
  }
  return where;
}
