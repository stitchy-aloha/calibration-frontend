import { api } from 'src/boot/axios';
import type { CalibrationRecord, EquipmentDetails, LocationDetails } from 'src/types';

export interface CalibrationRecordDetail {
  equipment: EquipmentDetails;
  location: LocationDetails;
}

export const CalibrationService = {
  /** Get all calibration jobs (queue list) */
  getAll: () => api.get<CalibrationRecord[]>('/calibration'),

  /** Get full record details by ID for the record page */
  getRecord: (id: string) => api.get<CalibrationRecordDetail>(`/calibration/record/${id}`),

  /** Save calibration results */
  saveRecord: (id: string, data: unknown) => api.post(`/calibration/record/${id}/save`, data),

  /** Save draft */
  saveDraft: (id: string, data: unknown) => api.post(`/calibration/record/${id}/draft`, data),
};
