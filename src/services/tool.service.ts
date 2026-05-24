import { api } from 'src/boot/axios';
import type { BackendStandardTool } from 'src/types/tool.types';

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
  department: string | null;
  location: string | null;
  sectionId: number | null;
  section: {
    id: number;
    name: string;
    hospital: {
      id: number;
      name: string;
      address: string;
      district: string;
      province: string;
    };
  } | null;
}

export interface Hospital {
  id: number;
  name: string;
  code?: string;
  logoUrl?: string;
  zipCode?: string;
  address?: string;
  district?: string;
  province?: string;
  description?: string;
}

export interface Section {
  id: number;
  name: string;
  code?: string;
  description?: string;
  hospitalId: number;
  hospital?: Hospital;
}

export const SectionService = {
  getAll: () => api.get<Section[]>('/section'),
  getByHospital: (hospitalId: number) => api.get<Section[]>(`/section?hospitalId=${hospitalId}`),
  create: (data: Partial<Section>) => api.post<Section>('/section', data),
  update: (id: number, data: Partial<Section>) => api.patch<Section>(`/section/${id}`, data),
  remove: (id: number) => api.delete(`/section/${id}`),
};

export const ToolService = {
  getAll: () => api.get<BackendEquipment[]>('/equipment'),
  getEquipmentTypes: () => api.get<{ id: number; name: string }[]>('/equipment-types'),
  getById: (id: number) => api.get<BackendEquipment>(`/equipment/${id}`),
  create: (data: Partial<BackendEquipment>) => api.post<BackendEquipment>('/equipment', data),
  update: (id: number, data: Partial<BackendEquipment>) =>
    api.patch<BackendEquipment>(`/equipment/${id}`, data),
  remove: (id: number) => api.delete(`/equipment/${id}`),
};

export const StandardToolService = {
  getAll: () => api.get<BackendStandardTool[]>('/standard-tool'),
  getCategories: () => api.get<{ id: number; name: string }[]>('/standard-tool/categories'),
  createCategory: (name: string) => api.post('/standard-tool/categories', { name }),
  getById: (id: number) => api.get<BackendStandardTool>(`/standard-tool/${id}`),
  create: (data: Partial<BackendStandardTool>) =>
    api.post<BackendStandardTool>('/standard-tool', data),
  update: (id: number, data: Partial<BackendStandardTool>) =>
    api.patch<BackendStandardTool>(`/standard-tool/${id}`, data),
  remove: (id: number) => api.delete(`/standard-tool/${id}`),
};
