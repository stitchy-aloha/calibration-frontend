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

const RESPONSIBLE_A = 'นายนันท์นภัส รุจิพูนพงศ์';
const RESPONSIBLE_B = 'นายสมโชค ขัยเกษม';

const mockCalibrations: CalibrationRecord[] = [
  {
    id: 'CAL-01',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-02',
    deviceName: 'MC-Digital',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Dimension',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_B,
  },
  {
    id: 'CAL-03',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-04',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-05',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_B,
  },
  {
    id: 'CAL-06',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_B,
  },
  {
    id: 'CAL-07',
    deviceName: 'Patient Monitor',
    deviceCode: 'BME-002',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-08',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-09',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-10',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-11',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-12',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-13',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-14',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-15',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-16',
    deviceName: 'Ventilator',
    deviceCode: 'BME-003',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_B,
  },
  {
    id: 'CAL-17',
    deviceName: 'ECG Machine',
    deviceCode: 'BME-004',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-18',
    deviceName: 'Patient Monitor',
    deviceCode: 'BME-002',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_B,
  },
  {
    id: 'CAL-19',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
  {
    id: 'CAL-20',
    deviceName: 'ECG Machine',
    deviceCode: 'BME-004',
    location: 'ICU-01',
    type: 'Medical',
    dueDate: '2025-12-28',
    responsible: RESPONSIBLE_A,
  },
];

export const useCalibrationStore = defineStore('calibration', () => {
  const records = ref<CalibrationRecord[]>(mockCalibrations);
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
      if (res.data.length > 0) {
        records.value = res.data.map((task) => ({
          id: task.pm_no || `TASK-${task.id}`,
          taskId: task.id,
          deviceName: `Equipment #${task.equipment_id}`,
          deviceCode: String(task.equipment_id),
          location: '-',
          type: '-',
          dueDate: '-',
          responsible: task.technician?.name ?? '-',
        }));
      }
    } catch {
      // keep mock data on error
    }
  }

  return { records, searchQuery, selectedType, typeOptions, filteredRecords, fetchFromApi };
});
