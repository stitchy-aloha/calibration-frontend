import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type CalibrationResult = 'pass' | 'fail';
export type CertType = 'all' | 'external' | 'calibration';
export type ExportFormat = 'csv' | 'pdf';

export interface HistoryRecord {
  id: string;
  date: string; // YYYY-MM-DD
  deviceName: string;
  deviceCode: string;
  inspector: string;
  result: CalibrationResult;
}

const mockHistory: HistoryRecord[] = [
  {
    id: 'H-001',
    date: '2025-07-26',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-004',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-002',
    date: '2025-07-20',
    deviceName: 'Pulse Oximeter',
    deviceCode: 'BME-003',
    inspector: 'สมหญิง มีใจ',
    result: 'fail',
  },
  {
    id: 'H-003',
    date: '2025-06-15',
    deviceName: 'BP Monitor',
    deviceCode: 'BME-002',
    inspector: 'สมหญิง มีใจ',
    result: 'fail',
  },
  {
    id: 'H-004',
    date: '2025-06-01',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-005',
    date: '2025-06-01',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-006',
    date: '2025-06-01',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-007',
    date: '2025-06-01',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-008',
    date: '2025-06-01',
    deviceName: 'Patient Monitor',
    deviceCode: 'BME-002',
    inspector: 'นันท์นภัส รุจิพูนพงศ์',
    result: 'pass',
  },
  {
    id: 'H-009',
    date: '2025-05-30',
    deviceName: 'Ventilator',
    deviceCode: 'BME-003',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-010',
    date: '2025-05-28',
    deviceName: 'ECG Machine',
    deviceCode: 'BME-004',
    inspector: 'นันท์นภัส รุจิพูนพงศ์',
    result: 'fail',
  },
  {
    id: 'H-011',
    date: '2025-05-20',
    deviceName: 'Infusion Pump',
    deviceCode: 'BME-001',
    inspector: 'สมชาย ใจดี',
    result: 'pass',
  },
  {
    id: 'H-012',
    date: '2025-05-15',
    deviceName: 'Pulse Oximeter',
    deviceCode: 'BME-003',
    inspector: 'สมหญิง มีใจ',
    result: 'pass',
  },
];

export const useHistoryStore = defineStore('history', () => {
  const records = ref<HistoryRecord[]>(mockHistory);
  const searchQuery = ref('');
  const selectedDevice = ref('');
  const selectedResult = ref('');

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
  ];

  const filteredRecords = computed(() =>
    records.value.filter((r) => {
      const q = searchQuery.value.toLowerCase();
      const matchSearch =
        !q ||
        r.deviceName.toLowerCase().includes(q) ||
        r.deviceCode.toLowerCase().includes(q) ||
        r.inspector.toLowerCase().includes(q);
      const matchDevice = !selectedDevice.value || r.deviceName === selectedDevice.value;
      const matchResult = !selectedResult.value || r.result === selectedResult.value;
      return matchSearch && matchDevice && matchResult;
    }),
  );

  return {
    records,
    searchQuery,
    selectedDevice,
    selectedResult,
    deviceOptions,
    resultOptions,
    filteredRecords,
  };
});
