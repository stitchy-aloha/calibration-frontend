// ─────────────────────────────────────────────────────────────────────────────
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

export type ToolType = 'Medical' | 'Dimension';

export interface MedicalTool {
  id: string;
  name: string;
  company: string;
  model: string;
  type: ToolType;
  serialNumber: string;
  calibrationCycle: string;
  dueDate: string;
  lastCalibrationDate: string;
  location: string;
  department: string;
  status: ToolStatus;
}
