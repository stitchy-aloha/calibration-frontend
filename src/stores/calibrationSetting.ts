import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  CalibrationSettingService,
  type CalibrationSetting,
} from '../services/calibration-setting.service';

function normalizeEquipmentName(name: string | null | undefined) {
  if (!name) return '';
  return name.trim().toLowerCase();
}

export function isInfusionPump(name: string | null | undefined) {
  const normalized = normalizeEquipmentName(name);
  return (
    normalized.includes('infusion') ||
    normalized.includes('syringe') ||
    normalized.includes('pump') ||
    normalized.includes('เครื่องให้สารน้ำ') ||
    normalized.includes('เครื่องควบคุมการให้สาร') ||
    normalized.includes('สารละลาย') ||
    normalized.includes('เครื่องควบคุมการให้ยา') ||
    normalized.includes('เครื่องให้ยา') ||
    normalized.includes('เครื่องฉีดยา') ||
    normalized.includes('เครื่องฉีดให้ยา') ||
    normalized.includes('pca') ||
    normalized.includes('tci')
  );
}

function getDefaultSettings(equipmentName: string): CalibrationSetting[] {
  if (!isInfusionPump(equipmentName)) return [];

  return [
    {
      equipment_name: equipmentName,
      type: 'qualitative',
      parameter_name: 'Occlusion',
      test_values: [{ label: 'Occlusion Alarm', value: 0 }],
    },
    {
      equipment_name: equipmentName,
      type: 'quantitative',
      parameter_name: 'Flow Rate',
      unit: 'mL/hr',
      tolerance: '2.2',
      display_type: 'Digital',
      resolution: '0.1',
      test_values: [
        { label: '10 mL/hr', value: 10 },
        { label: '50 mL/hr', value: 50 },
        { label: '100 mL/hr', value: 100 },
      ],
    },
    {
      equipment_name: equipmentName,
      type: 'quantitative',
      parameter_name: 'Volume',
      unit: 'mL',
      tolerance: '2.2',
      display_type: 'Digital',
      resolution: '0.1',
      test_values: [
        { label: '50 mL', value: 50 },
        { label: '100 mL', value: 100 },
        { label: '200 mL', value: 200 },
      ],
    },
  ];
}

export const useCalibrationSettingStore = defineStore('calibrationSetting', () => {
  const loading = ref(false);
  const settings = ref<CalibrationSetting[]>([]);

  function clearSettings() {
    settings.value = [];
  }

  async function fetchSettings(equipmentName: string) {
    loading.value = true;
    clearSettings();
    try {
      const res = await CalibrationSettingService.findByEquipment(equipmentName);
      const fetchedSettings = res.data.length > 0 ? res.data : getDefaultSettings(equipmentName);
      settings.value = fetchedSettings;
      return fetchedSettings;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      const fallbackSettings = getDefaultSettings(equipmentName);
      settings.value = fallbackSettings;
      return fallbackSettings;
    } finally {
      loading.value = false;
    }
  }

  async function saveSettings(equipmentName: string, payload: CalibrationSetting[]) {
    loading.value = true;
    try {
      const res = await CalibrationSettingService.batchSave(equipmentName, payload);
      settings.value = res.data;
      return res.data;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    settings,
    clearSettings,
    fetchSettings,
    saveSettings,
  };
});
