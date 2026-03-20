import { api } from 'src/boot/axios';
import type { TaskApi } from './pm.service';

export interface SubmitTaskPayload {
  ambient_temp?: number | undefined;
  ambient_humidity?: number | undefined;
  standard_tool_ids?: number[] | undefined;
  measurements?:
    | {
        parameter_name: string;
        range?: number | undefined;
        standard_value?: number | undefined;
        reading_1?: number | undefined;
        reading_2?: number | undefined;
        reading_3?: number | undefined;
        average_value?: number | undefined;
        error_value?: number | undefined;
        result: 'PASS' | 'FAIL';
      }[]
    | undefined;
  qualitatives?:
    | {
        item_name: string;
        result: 'PASS' | 'FAIL' | 'NA';
      }[]
    | undefined;
  overall_result: 'Pass' | 'Fail' | 'NA';
}

export const CalibrationService = {
  /** Get all calibration jobs (queue list) */
  getAll: () => api.get<TaskApi[]>('/pm-task'),

  /** Get full record details by ID for the record page */
  getRecord: (id: number | string) => api.get<TaskApi>(`/pm-task/${id}`),

  /** Save calibration results (Submit) */
  submitTask: (id: number | string, data: SubmitTaskPayload) =>
    api.patch<TaskApi>(`/pm-task/${id}/submit`, data),
};
