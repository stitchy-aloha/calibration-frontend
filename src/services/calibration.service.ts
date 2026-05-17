import { api } from 'src/boot/axios';
import type { TaskApi } from './pm.service';
import type { MeasurementRecord, QualitativeRecord, SpecificParameter } from 'src/stores/calibrationRecord';

export interface SubmitTaskPayload {
  ambient_temp?: number | null | undefined;
  ambient_humidity?: number | null | undefined;
  standard_tool_ids?: number[] | undefined;
  measurements?: MeasurementRecord[] | undefined;
  qualitatives?: QualitativeRecord[] | undefined;
  specific_parameters?: SpecificParameter[] | undefined;
  overall_result: 'Pass' | 'Fail' | 'NA';
  status?: 'InProgress' | 'PendingApproval';
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
