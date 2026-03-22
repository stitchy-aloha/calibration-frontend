// Medical Tool types (used by tools.ts store and ToolsPage)
// ─────────────────────────────────────────────────────────────────────────────

export type ToolStatus =
  | 'พร้อมใช้งาน'
  | 'กำลังสอบเทียบ'
  | 'รอดำเนินการ'
  | 'จำหน่ายแล้ว'
  | 'กำลังใช้งาน'
  | 'ส่งซ่อม'
  | 'ปิดใช้งาน'
  | 'ready'
  | 'calibrating'
  | 'repair'
  | 'disabled';

export interface CalibrationProcess {
  id: number;
  parameter_name: string;
  procedure: string;
  unit: string;
  standard_tool_id?: number | null;
  standardTool?: { name: string; manufacturer?: string; asset_code?: string };
}

export interface CalibrationCost {
  id: number;
  tool_name: string;
  description: string;
  price: number;
}

export interface MedicalTool {
  id: string;
  name: string;
  company: string;
  model: string;
  type: string;
  serialNumber: string;
  calibrationCycle: string;
  dueDate: string;
  lastCalibrationDate: string;
  location: string;
  department: string;
  status: ToolStatus;
  riskLevel?: string;
  equipmentType?: { id: number; name: string };
  equipment_type_id?: number | null;
  sectionId?: number | null;
  hospitalId?: number | null;
  backendId?: number;
}

export interface StandardTool {
  id: number;
  name: string;
  asset_code?: string | null;
  serial_number?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  certificate_number?: string | null;
  calibration_date_last?: string | null;
  unit?: string | null;
}
