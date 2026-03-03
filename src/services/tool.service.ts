import { api } from 'src/boot/axios';
import type { MedicalTool } from 'src/types';

export const ToolService = {
  getAll: () => api.get<MedicalTool[]>('/tools'),

  getById: (id: string) => api.get<MedicalTool>(`/tools/${id}`),

  create: (data: Omit<MedicalTool, 'id'>) => api.post<MedicalTool>('/tools', data),

  update: (id: string, data: Partial<MedicalTool>) => api.patch<MedicalTool>(`/tools/${id}`, data),

  remove: (id: string) => api.delete(`/tools/${id}`),
};
