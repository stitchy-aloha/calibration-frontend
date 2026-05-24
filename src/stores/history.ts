import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { api } from 'src/boot/axios';
import type { TaskApi } from 'src/services/pm.service';

export type CalibrationResult = 'pass' | 'fail' | 'na';
export type CertType = 'all' | 'external' | 'calibration';
export type ExportFormat = 'csv' | 'pdf';

export interface HistoryRecord {
  id: string;
  taskId: number;
  date: string; // YYYY-MM-DD
  deviceName: string;
  deviceCode: string;
  inspector: string;
  result: CalibrationResult;
  pathPdfCer: string | null;
}

export const useHistoryStore = defineStore('history', () => {
  const records = ref<HistoryRecord[]>([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const selectedDevice = ref('');
  const selectedResult = ref('');

  async function fetchRecords() {
    loading.value = true;
    try {
      const res = await api.get<TaskApi[]>('/pm-task');
      // Show only Approved and Rejected tasks
      const approvedOrRejected = res.data.filter((task) =>
        ['Approved', 'Rejected'].includes(task.status),
      );

      const mappedRecords: HistoryRecord[] = approvedOrRejected.map((task) => {
        const resVal = task.overall_result?.toLowerCase();
        return {
          id: String(task.pm_no || `CAL-${task.id}`),
          taskId: Number(task.id),
          date: String((task.createdAt || '').split('T')[0]),
          deviceName: String(task.equipment?.name || 'Unknown'),
          deviceCode: String(task.equipment?.asset_code || '-'),
          inspector: String(
            task.certificate_data?.technician?.name || task.technician?.name || '-',
          ),
          result: (resVal === 'pass'
            ? 'pass'
            : resVal === 'fail'
              ? 'fail'
              : resVal === 'na'
                ? 'na'
                : 'fail') as CalibrationResult,
          pathPdfCer: task.path_pdf_cer || null,
        };
      });

      records.value = mappedRecords;
    } catch (error) {
      console.error('fetchRecords error:', error);
    } finally {
      loading.value = false;
    }
  }

  const deviceOptions = computed(() => {
    const names = [...new Set(records.value.map((r) => r.deviceName))];
    return [
      { label: 'เครื่องมือทั้งหมด', value: '' },
      ...names.map((n) => ({ label: n, value: n })),
    ];
  });

  const resultOptions = [
    { label: 'ทุกผลลัพธ์', value: '' },
    { label: 'ผ่าน', value: 'pass' },
    { label: 'ไม่ผ่าน', value: 'fail' },
    { label: 'N/A', value: 'na' },
  ];

  const filteredRecords = computed(() => {
    const filtered = records.value.filter((r) => {
      const q = searchQuery.value.toLowerCase();
      const matchSearch =
        !q ||
        r.deviceName.toLowerCase().includes(q) ||
        r.deviceCode.toLowerCase().includes(q) ||
        r.inspector.toLowerCase().includes(q);
      const matchDevice = !selectedDevice.value || r.deviceName === selectedDevice.value;
      const matchResult = !selectedResult.value || r.result === selectedResult.value;
      return matchSearch && matchDevice && matchResult;
    });

    // Always sort by taskId descending (Newest at top)
    return [...filtered].sort((a, b) => b.taskId - a.taskId);
  });

  return {
    records,
    loading,
    searchQuery,
    selectedDevice,
    selectedResult,
    deviceOptions,
    resultOptions,
    filteredRecords,
    fetchRecords,
  };
});
