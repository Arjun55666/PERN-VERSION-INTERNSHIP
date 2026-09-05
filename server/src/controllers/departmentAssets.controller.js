import { asyncHandler } from '../middleware/errors.js';
import { findDepartmentAssets } from '../services/departmentAssets.service.js';

export const getDepartmentAssets = asyncHandler(async (req, res) => {
  const assignments = await findDepartmentAssets(req.query);
  res.json(assignments);
});
