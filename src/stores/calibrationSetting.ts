import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CalibrationSettingService, type CalibrationSetting } from '../services/calibration-setting.service';

export const useCalibrationSettingStore = defineStore('calibrationSetting', () => {
  const loading = ref(false);
  const settings = ref<CalibrationSetting[]>([]);

  async function fetchSettings(equipmentName: string) {
    loading.value = true;
    try {
      const res = await CalibrationSettingService.findByEquipment(equipmentName);
      settings.value = res.data;
      return res.data;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      settings.value = [];
      return [];
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
    fetchSettings,
    saveSettings,
  };
});
