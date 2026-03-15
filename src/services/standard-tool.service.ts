import { api } from 'src/boot/axios';

export interface BackendStandardTool {
  id: number;
  name: string;
  asset_code: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  path_pdf: string | null;
  certificate_number: string | null;
  calibration_date_last: string | null;
  unit: string | null;
  category_id: number | null;
}

export const StandardToolService = {
  getAll: () => api.get<BackendStandardTool[]>('/standard-tool'),

  getById: (id: number) => api.get<BackendStandardTool>(`/standard-tool/${id}`),

  create: (data: Partial<BackendStandardTool>) =>
    api.post<BackendStandardTool>('/standard-tool', data),

  update: (id: number, data: Partial<BackendStandardTool>) =>
    api.patch<BackendStandardTool>(`/standard-tool/${id}`, data),

  remove: (id: number) => api.delete(`/standard-tool/${id}`),
};
