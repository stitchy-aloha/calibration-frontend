import { api } from 'src/boot/axios';
import type { Hospital } from './tool.service';

export const HospitalService = {
  getAll: () => api.get<Hospital[]>('/hospital'),
  getById: (id: number) => api.get<Hospital>(`/hospital/${id}`),
  create: (data: FormData) =>
    api.post<Hospital>('/hospital', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: number, data: FormData) =>
    api.patch<Hospital>(`/hospital/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id: number) => api.delete(`/hospital/${id}`),
};
