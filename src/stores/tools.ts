import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ToolStatus = 'พร้อมใช้งาน' | 'รอดำเนินการ' | 'ใกล้ครบกำหนด' | 'จำหน่ายแล้ว' | 'ซ่อมรุด';
export type ToolType = 'Medical' | 'Dimension';

export interface MedicalTool {
  id: string;
  name: string;
  model: string;
  type: ToolType;
  calibrationCycle: string;
  dueDate: string;
  location: string;
  status: ToolStatus;
}

const mockTools: MedicalTool[] = [
  {
    id: 'BME-001',
    name: 'Infusion Pump',
    model: 'IP-2023X',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'ANC',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-002',
    name: 'Defibrillator',
    model: 'DF-Pro 5',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'ANC',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-003',
    name: 'Infant Incubator',
    model: 'Incub-Neo',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'ANE',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-004',
    name: 'Patient Monitor',
    model: 'Warm-X10',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'NUR',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-005',
    name: 'Oxygen Flow Meter',
    model: 'Oxy-Flo 200',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'NUR',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-006',
    name: 'Ventilator',
    model: 'Vent-Adv 9',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'HED',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-007',
    name: 'Plug Gauge',
    model: 'PG-Stan 50',
    type: 'Dimension',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'LAB',
    status: 'จำหน่ายแล้ว',
  },
  {
    id: 'BME-008',
    name: 'Snap Gauge',
    model: 'SG-Micro 1',
    type: 'Dimension',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'ANE',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-009',
    name: 'Patient Monitor',
    model: 'RD-Precision',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'RAD',
    status: 'ซ่อมรุด',
  },
  {
    id: 'BME-010',
    name: 'Infusion Pump',
    model: 'RD-Precision',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'RAD',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-011',
    name: 'Mu Checker',
    model: 'MC-Digital',
    type: 'Dimension',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'RAD',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-012',
    name: 'ECG Machine',
    model: 'ECG-12L',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2026-03-10',
    location: 'CCU',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-013',
    name: 'Syringe Pump',
    model: 'SP-Elite',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2026-01-15',
    location: 'ICU',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-014',
    name: 'Autoclave',
    model: 'AC-350Pro',
    type: 'Dimension',
    calibrationCycle: '12 เดือน',
    dueDate: '2026-06-01',
    location: 'CSR',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-015',
    name: 'Blood Pressure Monitor',
    model: 'BP-Auto3',
    type: 'Medical',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-11-30',
    location: 'OPD',
    status: 'ใกล้ครบกำหนด',
  },
];

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<MedicalTool[]>(mockTools);
  const searchQuery = ref('');
  const selectedType = ref<ToolType | ''>('');

  const typeOptions: { label: string; value: ToolType | '' }[] = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Dimension', value: 'Dimension' },
  ];

  const filteredTools = computed(() => {
    return tools.value.filter((t) => {
      const matchSearch =
        !searchQuery.value ||
        t.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.value.toLowerCase());

      const matchType = !selectedType.value || t.type === selectedType.value;

      return matchSearch && matchType;
    });
  });

  return { tools, searchQuery, selectedType, typeOptions, filteredTools };
});
