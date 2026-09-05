export const AREA_MAP = {
  'Delhi State Office': 'DSO', 'Panipat Terminal': 'PT',
  'Panipat Divisional Office': 'PDO', 'Tikri Terminal': 'TT',
  'Tikri BP': 'TBP', 'Rewari': 'RWL', 'Bijwasan Terminal': 'BT',
  'Gurgaon BP': 'GBP', 'Ambala Divisional Office': 'ALBP',
  'Ambala AFS': 'AAFS', 'Manesar': 'MS', 'Palwal': 'PWL',
  'Delhi Divisional Office': 'DDO', 'Hisar Divisional Office': 'HDO',
  'Delhi Indane Divisional Office': 'DIDO', 'Ambala Terminal': 'AT',
  'Karnal Indane Divisional Office': 'KIDO', 'Karnal BP': 'KBP',
  'Palam AFS': 'PAFS', 'MadanpurKhadar': 'MKH',
  'Gurgaon Divisional Office': 'GDO', 'Asaoti': 'ASA'
};

export const HARDWARE_TYPE_MAP = {
  Router: 'RTR', Switch: 'SWT', Server: 'SVR', 'Mono - Printer': 'PRT',
  UPS: 'UPS', Firewall: 'FWL', Scanner: 'SCN', 'Desktop PC': 'DTPC',
  'All In One PC': 'AIOPC', 'Multifunction Printer': 'MFPRT',
  Camera: 'CM', Monitor: 'MON', 'Media Converter': 'MC'
};

export function assetQrText(asset, assignment) {
  const lines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '  IOCL HARDWARE ASSET DETAILS',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', `  Asset ID       : ${asset.assetId}`,
    `  Model Name     : ${asset.assetModel}`, `  Date Purchased : ${asset.datePurchased}`,
    `  Serial Number  : ${asset.serialNumber}`, `  Area           : ${asset.area}`,
    `  Hardware Type  : ${asset.hardwareType}`, `  Hardware No.   : ${asset.id}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  ];
  if (assignment) lines.push(
    '  ASSIGNMENT DETAILS', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `  Department     : ${assignment.department}`, `  Employee Name  : ${assignment.employeeName}`,
    `  Employee Code  : ${assignment.employeeCode}`, `  Assigned Date  : ${assignment.assignedDate}`,
    '  Status         : Active', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );
  return lines.join('\n');
}

export function qrFilename(assetId, assignmentId) {
  return assignmentId ? `${assetId}_assign_${assignmentId}.png` : `${assetId}.png`;
}
