// ─────────────────────────────────────────────────────────────────────────────
// Calibration types (used by calibration.ts, calibrationRecord.ts stores)
// ─────────────────────────────────────────────────────────────────────────────

/** A row in the calibration list (queue waiting to be processed) */
export interface CalibrationRecord {
  id: string; // รหัสสอบเทียบ  e.g. CAL-01
  deviceName: string;
  deviceCode: string;
  location: string;
  type: string;
  dueDate: string;
  responsible: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Calibration Record Page types
// ─────────────────────────────────────────────────────────────────────────────

export interface EquipmentDetails {
  name: string;
  company: string;
  model: string;
  serialNumber: string;
  code: string;
  riskLevel: string;
  type: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
}

export interface LocationDetails {
  department: string;
  hospital: string;
  district: string;
  province: string;
}

export interface EnvironmentData {
  temperature: number | null;
  humidity: number | null;
}

export interface StandardEquipment {
  id: string;
  name: string;
  type: string;
  company: string;
  serialNumber: string;
  unit: string;
  lastCalibrationDate: string;
  certificateNumber: string;
}

/** A single test measurement row in the parameter tables */
export interface TestRow {
  range: string;
  standard: number | null;
  val1: number | null;
  val2: number | null;
  val3: number | null;
  average: number | null;
  error: number | null;
  status: 'pass' | 'fail' | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Approval types
// ─────────────────────────────────────────────────────────────────────────────

export interface ApprovalEvent {
  id: string;
  toolCode: string;
  toolName: string;
  location: string;
  calDate: string;
  result: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ─────────────────────────────────────────────────────────────────────────────
// Schedule / Calendar types
// ─────────────────────────────────────────────────────────────────────────────

export interface CalibrationEvent {
  id: string;
  toolCode: string;
  toolName: string;
  location: string;
  frequency: string;
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
}
