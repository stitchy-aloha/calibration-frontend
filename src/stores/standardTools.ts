import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { StandardTool } from '../types/tool.types';
export type { StandardTool };

import { StandardToolService } from '../services/standard-tool.service';

export const useStandardToolStore = defineStore('standardTools', () => {
  const tools = ref<StandardTool[]>([]);
  const loading = ref(false);

  async function fetchTools() {
    loading.value = true;
    try {
      const res = await StandardToolService.getAll();
      tools.value = res.data.map((item) => ({
        id: item.id,
        name: item.name,
        assetCode: item.asset_code ?? '-',
        serialNumber: item.serial_number ?? '-',
        manufacturer: item.manufacturer ?? '-',
        model: item.model ?? '-',
        certificateNumber: item.certificate_number ?? '-',
        lastCalibrationDate: item.calibration_date_last ?? '-',
        unit: item.unit ?? '-',
      }));
    } catch (error) {
      console.error('fetchTools error:', error);
    } finally {
      loading.value = false;
    }
  }

  function getToolByName(name: string) {
    return tools.value.find((t) => t.name === name);
  }

  return {
    tools,
    loading,
    fetchTools,
    getToolByName,
  };
});
