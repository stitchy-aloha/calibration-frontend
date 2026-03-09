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

export interface TaskApi {
  id: number;
  pm_no: string;
  equipment_id: number;
  status: string;
  overall_result: string;
  task_user: number;
  technician: {
    id: number;
    name: string;
    position: string;
  };
  equipment?: EquipmentApi;
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

  savePmForm: (payload: SavePmPayload) =>
    api.post<{ success: boolean; task_id: number }>('/pm-save', payload),
};
