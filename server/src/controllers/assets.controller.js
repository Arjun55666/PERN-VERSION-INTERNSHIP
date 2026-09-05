import { z } from 'zod';
import { createAssetWithQr } from '../services/asset.service.js';

const generateInput = z.object({
  assetModel: z.string().trim().min(1).max(50),
  datePurchased: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker'),
  serialNumber: z.string().trim().min(1).max(100),
  area: z.string().trim().min(1).max(50),
  hardwareType: z.string().trim().min(1).max(50)
});

function displayDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
}

export async function generateAsset(req, res) {
  const input = generateInput.parse(req.body);
  const asset = await createAssetWithQr({ ...input, datePurchased: displayDate(input.datePurchased) });
  res.status(201).json({ success: true, message: 'Hardware Asset created successfully', asset });
}
