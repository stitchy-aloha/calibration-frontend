import { api } from '../boot/axios';
import type { StandardToolCategory } from '../stores/standardToolCategory';

export interface CalibrationTestValue {
  label: string;
  value: number;
}

export interface CalibrationSetting {
  id?: number;
  equipment_name: string;
  type: 'quantitative' | 'qualitative';
  parameter_name: string;
  unit?: string;
  tolerance?: string;
  std_type?: string;
  display_type?: string;
  resolution?: string;
  uncertainty?: string;
  ucb1?: string;
  ucb2?: string;
  ucb3?: string;
  test_values?: CalibrationTestValue[];
  category_ids?: number[];
  categories?: StandardToolCategory[];
}

export const CalibrationSettingService = {
  /** Get all settings */
  getAll: () => api.get<CalibrationSetting[]>('/calibration-setting'),

  /** Get settings for a specific equipment */
  findByEquipment: (name: string) => 
    api.get<CalibrationSetting[]>(`/calibration-setting/${encodeURIComponent(name)}`),

  /** Save batch of settings for an equipment */
  batchSave: (name: string, settings: CalibrationSetting[]) =>
    api.post<CalibrationSetting[]>(`/calibration-setting/batch/${encodeURIComponent(name)}`, settings),

  /** Delete all settings for an equipment */
  deleteByEquipment: (name: string) =>
    api.delete(`/calibration-setting/${encodeURIComponent(name)}`),
};
