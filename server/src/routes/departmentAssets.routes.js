import { Router } from 'express';
import { getDepartmentAssets } from '../controllers/departmentAssets.controller.js';

export const departmentAssetsRouter = Router();

departmentAssetsRouter.get('/', getDepartmentAssets);
