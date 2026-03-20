import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CalibrationService } from 'src/services/calibration.service';
import type { SubmitTaskPayload } from 'src/services/calibration.service';

export interface EquipmentDetails {
  id: string;
  backendId?: number;
  name: string;
  company: string;
  model: string;
  serialNumber: string;
  code: string;
  riskLevel: string;
  type: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
}

export interface LocationDetails {
  department: string;
  hospital: string;
  district: string;
  province: string;
}

export interface EnvironmentDetails {
  temperature: number | null;
  humidity: number | null;
}

export interface StandardEquipment {
  id: number;
  type: string;
  name: string;
  company: string;
  serialNumber: string;
  unit: string;
  lastCalibrationDate: string;
  certificateNumber: string;
}

export interface MeasurementRecord {
  parameter_name: string;
  range?: number;
  standard_value?: number;
  reading_1?: number;
  reading_2?: number;
  reading_3?: number;
  average_value?: number | undefined;
  error_value?: number | undefined;
  result: 'PASS' | 'FAIL';
  display_type?: string | undefined;
  resolution?: string | undefined;
}

export interface QualitativeRecord {
  parameter_name?: string;
  item_name: string;
  result: 'PASS' | 'FAIL' | 'NA';
}

export const useCalibrationRecordStore = defineStore('calibrationRecord', () => {
  const loading = ref(false);
  const activeTab = ref('general');
  const taskId = ref<number | null>(null);

  const equipmentDetails = ref<EquipmentDetails>({
    id: '',
    name: '',
    company: '',
    model: '',
    serialNumber: '',
    code: '',
    riskLevel: '',
    type: '',
    calibrationCycle: '',
    lastCalibrationDate: '',
    nextCalibrationDate: '',
  });

  const locationDetails = ref<LocationDetails>({
    department: '',
    hospital: '',
    district: '',
    province: '',
  });

  const environment = ref<EnvironmentDetails>({
    temperature: null,
    humidity: null,
  });

  const standardToolIds = ref<number[]>([]);
  const measurements = ref<MeasurementRecord[]>([]);
  const qualitatives = ref<QualitativeRecord[]>([]);
  const overallResult = ref<'Pass' | 'Fail' | 'NA'>('Pass');

  async function fetchCalibrationRecord(id: string | number) {
    loading.value = true;
    try {
      const res = await CalibrationService.getRecord(id);
      const task = res.data;
      taskId.value = task.id;

      if (task.equipment) {
        const riskMap: Record<string, string> = {
          high: 'สูง',
          medium: 'กลาง',
          low: 'ต่ำ',
        };
        equipmentDetails.value = {
          id: task.equipment.asset_code || String(task.equipment.id),
          backendId: task.equipment.id,
          name: task.equipment.name.trim(),
          company: task.equipment.manufacturer,
          model: task.equipment.model,
          serialNumber: task.equipment.serial_number,
          code: task.equipment.asset_code,
          riskLevel: riskMap[task.equipment.risk_level || ''] || task.equipment.risk_level || '-',
          type: task.equipment.equipmentType?.name || '-',
          calibrationCycle: `${task.equipment.interval} วัน`,
          lastCalibrationDate: task.equipment.calibration_date_last,
          nextCalibrationDate: task.equipment.calibration_due_date,
        };
      }

      locationDetails.value = {
        department: task.equipment?.section?.name || task.equipment?.department || '-',
        hospital: task.equipment?.section?.hospital?.name || task.equipment?.location || '-',
        district: task.equipment?.section?.hospital?.district || '-',
        province: task.equipment?.section?.hospital?.province || '-',
      };

      // Reset results for new entry
      environment.value = { temperature: 25, humidity: 45 };
      measurements.value = [];
      qualitatives.value = [];
      standardToolIds.value = [];
    } catch (error) {
      console.error('Failed to fetch calibration record', error);
    } finally {
      loading.value = false;
    }
  }

  async function submitCalibration() {
    if (!taskId.value) return;

    loading.value = true;
    try {
      const payload: SubmitTaskPayload = {
        ambient_temp: environment.value.temperature ?? undefined,
        ambient_humidity: environment.value.humidity ?? undefined,
        standard_tool_ids: standardToolIds.value,
        measurements: measurements.value,
        qualitatives: qualitatives.value,
        overall_result: overallResult.value,
      };

      await CalibrationService.submitTask(taskId.value, payload);
      return true;
    } catch (error) {
      console.error('Submit Failed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    activeTab,
    taskId,
    equipmentDetails,
    locationDetails,
    environment,
    standardToolIds,
    measurements,
    qualitatives,
    overallResult,
    fetchCalibrationRecord,
    submitCalibration,
  };
});
