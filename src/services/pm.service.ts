import { api } from 'src/boot/axios';

// ── Response types from backend ──────────────────────────────────────────────

export interface ChecklistItemApi {
  id: number;
  category_id: number;
  description: string;
  display_order: number;
}

export interface ChecklistCategoryApi {
  id: number;
  name: string;
  display_order: number;
  items: ChecklistItemApi[];
}

export interface EquipmentApi {
  id: number;
  name: string;
  asset_code: string;
  serial_number: string;
  manufacturer: string;
  model: string;
  status: string;
  interval: number;
  calibration_due_date: string;
  calibration_date_last: string;
}

export interface MeasurementApi {
  id: number;
  parameter_name: string;
  range: number;
  standard_value: number;
  reading_1: number;
  reading_2: number;
  reading_3: number;
  average_value: number;
  error_value: number;
  result: 'PASS' | 'FAIL';
  task_id: number;
}

export interface EnvironmentApi {
  id: number;
  ambient_temp: number;
  ambient_humidity: number;
  task_id: number;
}

export interface QualitativeApi {
  id: number;
  parameter_name?: string;
  item_name: string;
  result: 'PASS' | 'FAIL' | 'NA';
  task_id: number;
}

export interface PmChecklistResultApi {
  id: number;
  task_id: number;
  item_id: number;
  status: 'Pass' | 'Fail' | 'NA';
  item?: {
    id: number;
    description: string;
    category_id: number;
    display_order: number;
  };
}

export interface PmCategoryRemarkApi {
  id: number;
  task_id: number;
  category_id: number;
  text: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface TechnicianApi {
  id: number;
  name: string;
  position: string;
}

export interface TaskApi {
  id: number;
  pm_no: string;
  equipment_id: number;
  status: string;
  overall_result: string;
  task_user: number;
  createdAt: string;
  technician: TechnicianApi;
  approver?: TechnicianApi;
  equipment?: EquipmentApi;
  measurements?: MeasurementApi[];
  environments?: EnvironmentApi[];
  qualitatives?: QualitativeApi[];
  checklistResults?: PmChecklistResultApi[];
  checklistRemarks?: PmCategoryRemarkApi[];
  remarks?: string;
  standardTools?: {
    id: number;
    name: string;
    model: string;
    manufacturer: string;
    serial_number: string;
    unit: string;
    calibration_date_last: string;
    certificate_number: string;
  }[];
}

export interface SavePmPayload {
  task_id: number;
  overall_result: 'Pass' | 'Fail' | 'NA';
  status: 'Pending' | 'InProgress' | 'Done';
  results: { item_id: number; status: 'Pass' | 'Fail' | 'NA' }[];
  remarks: { category_id: number; text?: string }[];
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const pmService = {
  getPmForm: (equipmentId: number) => api.get<ChecklistCategoryApi[]>(`/pm-form/${equipmentId}`),

  getEquipment: (equipmentId: number) => api.get<EquipmentApi>(`/equipment/${equipmentId}`),

  getTask: (taskId: number) =>
    api.get<TaskApi[]>('/pm-task').then((r) => r.data.find((t) => t.id === taskId)),

  getTaskById: (taskId: number) => api.get<TaskApi>(`/pm-task/${taskId}`),

  savePmForm: (payload: SavePmPayload) =>
    api.post<{ success: boolean; task_id: number }>('/pm-save', payload),
};
