import { api } from 'src/boot/axios';
import type { CalibrationProcess, CalibrationCost } from 'src/types/tool.types';

export const CalibrationProcessService = {
  getAll: () => api.get<CalibrationProcess[]>('/calibration-processes'),
  getById: (id: number) => api.get<CalibrationProcess>(`/calibration-processes/${id}`),
  create: (data: Partial<CalibrationProcess>) =>
    api.post<CalibrationProcess>('/calibration-processes', data),
  update: (id: number, data: Partial<CalibrationProcess>) =>
    api.patch<CalibrationProcess>(`/calibration-processes/${id}`, data),
  remove: (id: number) => api.delete(`/calibration-processes/${id}`),
};

export const CalibrationCostService = {
  getAll: () => api.get<CalibrationCost[]>('/calibration-costs'),
  getById: (id: number) => api.get<CalibrationCost>(`/calibration-costs/${id}`),
  create: (data: Partial<CalibrationCost>) =>
    api.post<CalibrationCost>('/calibration-costs', data),
  update: (id: number, data: Partial<CalibrationCost>) =>
    api.patch<CalibrationCost>(`/calibration-costs/${id}`, data),
  remove: (id: number) => api.delete(`/calibration-costs/${id}`),
};
