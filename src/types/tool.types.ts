// Medical Tool types (used by tools.ts store and ToolsPage)
// ─────────────────────────────────────────────────────────────────────────────

export type ToolStatus =
  | 'พร้อมใช้งาน'
  | 'กำลังสอบเทียบ'
  | 'รอดำเนินการ'
  | 'จำหน่ายแล้ว'
  | 'กำลังใช้งาน'
  | 'ส่งซ่อม'
  | 'ปิดใช้งาน';

export interface CalibrationProcess {
  id: string;
  parameter: string;
  procedure: string;
  unit: string;
  standardEquipment: string;
}

export interface CalibrationCost {
  id: string;
  toolName: string;
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
  backendId?: number;
}
