import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import type { TaskApi } from 'src/services/pm.service';

export interface CalibrationRecord {
  id: string; // รหัสสอบเทียบ  e.g. CAL-01
  taskId?: number; // backend task id — used for navigation
  deviceName: string; // ชื่อเครื่องมือ
  deviceCode: string; // รหัสเครื่อง  e.g. BME-001
  location: string; // ที่ตั้ง      e.g. ICU-01
  type: string; // ประเภท       e.g. Medical
  dueDate: string; // ครบกำหนด    YYYY-MM-DD
  responsible: string; // ผู้รับผิดชอบ
}

export const useCalibrationStore = defineStore('calibration', () => {
  const records = ref<CalibrationRecord[]>([]);
  const searchQuery = ref('');
  const selectedType = ref('');

  const typeOptions = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Dimension', value: 'Dimension' },
  ];

  const filteredRecords = computed(() =>
    records.value.filter((r) => {
      const q = searchQuery.value.toLowerCase();
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.deviceName.toLowerCase().includes(q) ||
        r.deviceCode.toLowerCase().includes(q) ||
        r.responsible.toLowerCase().includes(q);

      const matchType = !selectedType.value || r.type === selectedType.value;

      return matchSearch && matchType;
    }),
  );

  async function fetchFromApi() {
    try {
      const res = await api.get<TaskApi[]>('/pm-task');
      // Only show tasks that are yet to be calibrated (status = 'Pending')
      const pendingTasks = res.data.filter((task) => task.status === 'Pending');
      
      records.value = pendingTasks.map((task) => ({
        id: task.pm_no || `TASK-${task.id}`,
        taskId: task.id,
        deviceName: task.equipment?.name ?? `Equipment #${task.equipment_id}`,
        deviceCode: task.equipment?.asset_code ?? String(task.equipment_id),
        location: task.equipment?.section?.name || task.equipment?.location || '-',
        type: 'Medical',
        dueDate: task.equipment?.calibration_due_date ?? '-',
        responsible: task.technician?.name ?? '-',
      }));
    } catch {
      // keep mock data on error
    }
  }

  return { records, searchQuery, selectedType, typeOptions, filteredRecords, fetchFromApi };
});
