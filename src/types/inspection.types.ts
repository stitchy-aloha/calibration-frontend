// ─────────────────────────────────────────────────────────────────────────────
// Inspection types (used by inspection.ts store and ExternalInspectionPage)
// ─────────────────────────────────────────────────────────────────────────────

export type InspectionValue = 'ผ่าน' | 'ไม่ผ่าน' | 'N/A';

export interface InspectionItem {
  label: string;
  value: InspectionValue;
}

export interface DeviceInfo {
  deviceName: string;
  company: string;
  model: string;
  serialNumber: string;
  assetCode: string;
  category: string;
  department: string;
  location: string;
  calibrationInterval: string;
  lastCalibrationDate: string;
  dueDate: string;
}
