import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ToolStatus = 'พร้อมใช้งาน' | 'รอดำเนินการ' | 'ใกล้ครบกำหนด' | 'จำหน่ายแล้ว' | 'ซ่อมรุด';
export type ToolType = 'Medical' | 'Dimension';

export interface MedicalTool {
  id: string;
  name: string;
  model: string;
  type: ToolType;
  serialNumber: string;
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
    serialNumber: 'SN-001',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Ward-1A',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-002',
    name: 'Defibrillator',
    model: 'DF-Pro 5',
    type: 'Medical',
    serialNumber: 'SN-002',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Ward-1A',
    status: 'ซ่อมรุด',
  },
  {
    id: 'BME-003',
    name: 'Infant Incubator',
    model: 'Incub-Neo',
    type: 'Medical',
    serialNumber: 'SN-003',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Ward-1A',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-004',
    name: 'Infant Warmers',
    model: 'Warm-X10',
    type: 'Medical',
    serialNumber: 'SN-004',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Ward-1A',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-005',
    name: 'Oxygen Flow Meter',
    model: 'Oxy-Flo 200',
    type: 'Medical',
    serialNumber: 'SN-005',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-10-15',
    location: 'Ward-2B',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-006',
    name: 'Ventilator',
    model: 'Vent-Adv 9',
    type: 'Medical',
    serialNumber: 'SN-006',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'ICU',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-007',
    name: 'Plug Gauge',
    model: 'PG-Stan 50',
    type: 'Dimension',
    serialNumber: 'SN-007',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Lab-3',
    status: 'จำหน่ายแล้ว',
  },
  {
    id: 'BME-008',
    name: 'Snap Gauge',
    model: 'SG-Micro 1',
    type: 'Dimension',
    serialNumber: 'SN-008',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Lab-3',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-009',
    name: 'Reference Disk',
    model: 'RD-Precision',
    type: 'Dimension',
    serialNumber: 'SN-009',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Lab-3',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-010',
    name: 'Mu Checker',
    model: 'MC-Digital',
    type: 'Dimension',
    serialNumber: 'SN-010',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Lab-3',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-011',
    name: 'Mu Checker',
    model: 'MC-Digital',
    type: 'Dimension',
    serialNumber: 'SN-011',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    location: 'Lab-3',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-012',
    name: 'ECG Machine',
    model: 'ECG-12L',
    type: 'Medical',
    serialNumber: 'SN-012',
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
    serialNumber: 'SN-013',
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
    serialNumber: 'SN-014',
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
    serialNumber: 'SN-015',
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

  const statusOptions = [
    { label: 'พร้อมใช้งาน (Available)', value: 'พร้อมใช้งาน' },
    { label: 'รอดำเนินการ (Pending)', value: 'รอดำเนินการ' },
    { label: 'ใกล้ครบกำหนด (Due Soon)', value: 'ใกล้ครบกำหนด' },
    { label: 'จำหน่ายแล้ว (Disposed)', value: 'จำหน่ายแล้ว' },
    { label: 'ซ่อมรุด (Under Repair)', value: 'ซ่อมรุด' },
  ];

  const locationOptions = [
    { label: 'Ward-1A (แผนกผู้ป่วยใน 1A)', value: 'Ward-1A' },
    { label: 'Ward-2B (แผนกผู้ป่วยใน 2B)', value: 'Ward-2B' },
    { label: 'ICU (ห้องผู้ป่วยวิกฤต)', value: 'ICU' },
    { label: 'Lab-3 (ห้องปฏิบัติการ 3)', value: 'Lab-3' },
    { label: 'CCU (หอผู้ป่วยโรคหัวใจ)', value: 'CCU' },
    { label: 'CSR (ศูนย์จ่ายกลาง)', value: 'CSR' },
    { label: 'OPD (ผู้ป่วยนอก)', value: 'OPD' },
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

  const nextId = computed(() => {
    const maxNum = tools.value.reduce((max, t) => {
      const num = parseInt(t.id.replace('BME-', ''), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `BME-${String(maxNum + 1).padStart(3, '0')}`;
  });

  function addTool(tool: Omit<MedicalTool, 'id'>) {
    tools.value.push({ ...tool, id: nextId.value });
  }

  function updateTool(id: string, data: Partial<MedicalTool>) {
    const idx = tools.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tools.value[idx] = { ...tools.value[idx]!, ...data, id };
    }
  }

  function deleteTool(id: string) {
    tools.value = tools.value.filter((t) => t.id !== id);
  }

  return {
    tools,
    searchQuery,
    selectedType,
    typeOptions,
    statusOptions,
    locationOptions,
    filteredTools,
    nextId,
    addTool,
    updateTool,
    deleteTool,
  };
});
