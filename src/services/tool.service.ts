import { api } from 'src/boot/axios';

export interface BackendEquipment {
  id: number;
  name: string;
  asset_code: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  status: string;
  risk_level: string | null;
  equipment_type_id: number | null;
  equipmentType: { id: number; name: string } | null;
  path_pdf: string | null;
  interval: number | null;
  calibration_due_date: string | null;
  calibration_date_last: string | null;
}

export const ToolService = {
  getAll: () => api.get<BackendEquipment[]>('/equipment'),

  getEquipmentTypes: () => api.get<{ id: number; name: string }[]>('/equipment-types'),

  getById: (id: number) => api.get<BackendEquipment>(`/equipment/${id}`),

  create: (data: Partial<BackendEquipment>) => api.post<BackendEquipment>('/equipment', data),

  update: (id: number, data: Partial<BackendEquipment>) =>
    api.patch<BackendEquipment>(`/equipment/${id}`, data),

  remove: (id: number) => api.delete(`/equipment/${id}`),
};
