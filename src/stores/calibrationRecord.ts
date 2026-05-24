import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CalibrationService } from 'src/services/calibration.service';
import { useCalibrationSettingStore } from './calibrationSetting';
import { useStandardToolStore } from './standardTools';
import type { SubmitTaskPayload } from 'src/services/calibration.service';
import type { SpecificParameterApi } from 'src/services/pm.service';

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
  parameter_name?: string | null | undefined;
  range?: number | null | undefined;
  standard_value?: number | null | undefined;
  reading_1?: number | null | undefined;
  reading_2?: number | null | undefined;
  reading_3?: number | null | undefined;
  std_reading_1?: number | null | undefined;
  std_reading_2?: number | null | undefined;
  std_reading_3?: number | null | undefined;
  average_value?: number | null | undefined;
  average_standard?: number | null | undefined;
  error_value?: number | null | undefined;
  result: 'PASS' | 'FAIL';
  display_type?: string | null | undefined;
  resolution?: string | null | undefined;
  std_type?: string | null | undefined;
}

export interface QualitativeRecord {
  parameter_name?: string | null | undefined;
  item_name: string;
  result: 'PASS' | 'FAIL' | 'NA';
}

export interface SpecificParameter {
  name: string;
  value?: string | null | undefined;
  unit?: string | null | undefined;
}

export const useCalibrationRecordStore = defineStore('calibrationRecord', () => {
  const loading = ref(false);
  const isDirty = ref(false);
  const activeTab = ref('general');
  const taskId = ref<number | null>(null);
  const mockTrigger = ref(0);

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
  const specificParameters = ref<SpecificParameter[]>([]);
  const overallResult = ref<'Pass' | 'Fail' | 'NA'>('Pass');

  async function fetchCalibrationRecord(id: string | number) {
    resetStore();
    loading.value = true;
    const settingStore = useCalibrationSettingStore();
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
      environment.value = { temperature: null, humidity: null };
      measurements.value = [];
      qualitatives.value = [];
      specificParameters.value =
        task.specificParameters?.map((p: SpecificParameterApi) => ({
          name: p.name,
          value: p.value ?? undefined,
          unit: p.unit ?? undefined,
        })) || [];
      // Populate standard tools from the task record if they exist
      standardToolIds.value = task.standardTools?.map((t: { id: number }) => t.id) || [];

      // Fetch settings for this equipment (trim name to avoid mismatch)
      if (task.equipment?.name) {
        await settingStore.fetchSettings(task.equipment.name.trim());
      }
    } catch (error) {
      console.error('Failed to fetch calibration record', error);
    } finally {
      loading.value = false;
      isDirty.value = false;
    }
  }

  async function submitCalibration(status: 'InProgress' | 'PendingApproval' = 'PendingApproval') {
    if (!taskId.value) return;

    loading.value = true;
    try {
      const payload: SubmitTaskPayload = {
        ambient_temp: environment.value.temperature ?? undefined,
        ambient_humidity: environment.value.humidity ?? undefined,
        standard_tool_ids: standardToolIds.value,
        measurements: measurements.value,
        qualitatives: qualitatives.value,
        specific_parameters: specificParameters.value,
        overall_result: overallResult.value,
        status,
      };

      await CalibrationService.submitTask(taskId.value, payload);
      isDirty.value = false;
      return true;
    } catch (error) {
      console.error('Submit Failed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function saveDraft() {
    return await submitCalibration('InProgress');
  }

  function fillMockData() {
    isDirty.value = true;
    mockTrigger.value++;
    const settingStore = useCalibrationSettingStore();

    // 1. Environment
    environment.value = {
      temperature: Math.round((24.5 + Math.random()) * 10) / 10,
      humidity: Math.round((45 + Math.random() * 10) * 10) / 10,
    };

    // 2. Standard Tools (Use categories from configuration to pick physical tools)
    const allowedCategoryIds = settingStore.settings
      .flatMap(s => s.category_ids || [])
      .filter(id => !!id)
      .map(id => Number(id));
    
    if (allowedCategoryIds.length > 0) {
      const toolStore = useStandardToolStore();
      const matchingTools = toolStore.tools.filter(t => 
        t.category_id && allowedCategoryIds.includes(Number(t.category_id))
      );
      standardToolIds.value = matchingTools.map(t => t.id).slice(0, 2);
    } else {
      standardToolIds.value = [1];
    }

    // 3. Measurements (Quantitative)
    measurements.value = settingStore.settings
      .filter((s) => s.type === 'quantitative')
      .map((s) => {
        const stdVal = s.test_values?.[0]?.value ?? 100;
        const isMode4 = s.std_type?.includes('4') || s.std_type?.includes('3 UUC') || s.std_type?.includes('3 UUC : 3 STD');
        if (isMode4) {
          const std1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const std2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const std3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const avgStd = (std1 + std2 + std3) / 3;

          const r1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const r2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const r3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const avg = (r1 + r2 + r3) / 3;
          const err = avg - avgStd;

          return {
            parameter_name: s.parameter_name,
            standard_value: stdVal,
            reading_1: Number(r1.toFixed(2)),
            reading_2: Number(r2.toFixed(2)),
            reading_3: Number(r3.toFixed(2)),
            std_reading_1: Number(std1.toFixed(2)),
            std_reading_2: Number(std2.toFixed(2)),
            std_reading_3: Number(std3.toFixed(2)),
            average_value: Number(avg.toFixed(2)),
            average_standard: Number(avgStd.toFixed(2)),
            error_value: Number(err.toFixed(2)),
            result: 'PASS' as const,
            display_type: s.display_type,
            resolution: s.resolution,
            std_type: s.std_type,
          };
        } else {
          const r1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const r2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const r3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
          const avg = (r1 + r2 + r3) / 3;
          const err = avg - stdVal;

          return {
            parameter_name: s.parameter_name,
            standard_value: stdVal,
            reading_1: Number(r1.toFixed(2)),
            reading_2: Number(r2.toFixed(2)),
            reading_3: Number(r3.toFixed(2)),
            average_value: Number(avg.toFixed(2)),
            error_value: Number(err.toFixed(2)),
            result: 'PASS' as const,
            display_type: s.display_type,
            resolution: s.resolution,
            std_type: s.std_type,
          };
        }
      });

    // 4. Qualitatives
    qualitatives.value = settingStore.settings
      .filter((s) => s.type === 'qualitative')
      .map((s) => ({
        item_name: s.parameter_name,
        result: 'PASS',
      }));

    overallResult.value = 'Pass';
  }

  const isEnvironmentValid = computed(() => {
    return environment.value.temperature !== null && 
           environment.value.temperature !== undefined &&
           environment.value.humidity !== null &&
           environment.value.humidity !== undefined;
  });

  const isStandardToolsValid = computed(() => standardToolIds.value.length > 0);

  const isTestsValid = computed(() => {
    const settingStore = useCalibrationSettingStore();
    const hasQuantSettings = settingStore.settings.some(s => s.type === 'quantitative');
    const hasQualSettings = settingStore.settings.some(s => s.type === 'qualitative');

    // 1. Check Quantitative (must have all 3 readings for each record)
    if (hasQuantSettings) {
      if (measurements.value.length === 0) return false;
      for (const m of measurements.value) {
        if (m.reading_1 === null || m.reading_1 === undefined ||
            m.reading_2 === null || m.reading_2 === undefined ||
            m.reading_3 === null || m.reading_3 === undefined) {
          return false;
        }
      }
    }

    // 2. Check Qualitative (must have Pass/Fail, not NA/Null)
    if (hasQualSettings) {
      if (qualitatives.value.length === 0) return false;
      for (const q of qualitatives.value) {
        if (!q.result || q.result === 'NA') return false;
      }
    }

    return true;
  });

  const canSubmit = computed(() => {
    return isEnvironmentValid.value && 
           isStandardToolsValid.value && 
           isTestsValid.value;
  });

  function resetStore() {
    taskId.value = null;
    activeTab.value = 'general';
    equipmentDetails.value = {
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
    };
    locationDetails.value = {
      department: '',
      hospital: '',
      district: '',
      province: '',
    };
    environment.value = {
      temperature: null,
      humidity: null,
    };
    standardToolIds.value = [];
    measurements.value = [];
    qualitatives.value = [];
    specificParameters.value = [];
    overallResult.value = 'Pass';
  }

  return {
    loading,
    isDirty,
    activeTab,
    taskId,
    equipmentDetails,
    locationDetails,
    environment,
    standardToolIds,
    measurements,
    qualitatives,
    specificParameters,
    overallResult,
    isEnvironmentValid,
    isStandardToolsValid,
    isTestsValid,
    canSubmit,
    fetchCalibrationRecord,
    submitCalibration,
    saveDraft,
    fillMockData,
    resetStore,
    mockTrigger,
  };
});
