// ─────────────────────────────────────────────────────────────────────────────
// Barrel export — import from 'src/types' instead of individual files
// ─────────────────────────────────────────────────────────────────────────────

export * from './auth.types';
export * from './calibration.types';
export * from './inspection.types';
export * from './tool.types';

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

export type TaskStatus =
  | 'Pending'
  | 'InProgress'
  | 'PendingApproval'
  | 'Approved'
  | 'Rejected'
  | 'ReCalibrate'
  | 'Done';
