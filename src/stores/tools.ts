import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ToolStatus = 'พร้อมใช้งาน' | 'รอดำเนินการ' | 'ใกล้ครบกำหนด' | 'จำหน่ายแล้ว' | 'ซ่อมรุด';
export type ToolType = 'Medical' | 'Dimension';

export interface MedicalTool {
  id: string;
  name: string;
  company: string;
  model: string;
  type: ToolType;
  serialNumber: string;
  calibrationCycle: string;
  dueDate: string;
  lastCalibrationDate: string;
  location: string;
  department: string;
  status: ToolStatus;
}

const mockTools: MedicalTool[] = [
  {
    id: 'BME-001',
    name: 'Infusion Pump',
    company: 'Terumo',
    model: 'TE-171',
    type: 'Medical',
    serialNumber: '4820135',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Ward-1A',
    department: 'Internal Medicine',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-002',
    name: 'Patient Monitor',
    company: 'FLUKE',
    model: 'ProSim4',
    type: 'Medical',
    serialNumber: '5481017',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-28',
    lastCalibrationDate: '2025-06-26',
    location: 'ICU-03',
    department: 'Pulmonary',
    status: 'ซ่อมรุด',
  },
  {
    id: 'BME-003',
    name: 'Infant Incubator',
    company: 'Dräger',
    model: 'Incub-Neo',
    type: 'Medical',
    serialNumber: '3910256',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Ward-1A',
    department: 'Pediatrics',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-004',
    name: 'Infant Warmers',
    company: 'GE Healthcare',
    model: 'Warm-X10',
    type: 'Medical',
    serialNumber: '6720488',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Ward-1A',
    department: 'Pediatrics',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-005',
    name: 'Oxygen Flow Meter',
    company: 'Precision Medical',
    model: 'Oxy-Flo 200',
    type: 'Medical',
    serialNumber: '1150339',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-10-15',
    lastCalibrationDate: '2025-04-15',
    location: 'Ward-2B',
    department: 'Respiratory',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-006',
    name: 'Ventilator',
    company: 'Philips',
    model: 'Vent-Adv 9',
    type: 'Medical',
    serialNumber: '7830122',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'ICU',
    department: 'Respiratory',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-007',
    name: 'Plug Gauge',
    company: 'Mitutoyo',
    model: 'PG-Stan 50',
    type: 'Dimension',
    serialNumber: '2340567',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Lab-3',
    department: 'Engineering',
    status: 'จำหน่ายแล้ว',
  },
  {
    id: 'BME-008',
    name: 'Snap Gauge',
    company: 'Mitutoyo',
    model: 'SG-Micro 1',
    type: 'Dimension',
    serialNumber: '8910745',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Lab-3',
    department: 'Engineering',
    status: 'ใกล้ครบกำหนด',
  },
  {
    id: 'BME-009',
    name: 'Reference Disk',
    company: 'Heidenhain',
    model: 'RD-Precision',
    type: 'Dimension',
    serialNumber: '4560123',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Lab-3',
    department: 'Engineering',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-010',
    name: 'Mu Checker',
    company: 'Mitutoyo',
    model: 'MC-Digital',
    type: 'Dimension',
    serialNumber: '3570891',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Lab-3',
    department: 'Engineering',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-011',
    name: 'Mu Checker',
    company: 'Mitutoyo',
    model: 'MC-Digital',
    type: 'Dimension',
    serialNumber: '3570892',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-12-26',
    lastCalibrationDate: '2025-06-26',
    location: 'Lab-3',
    department: 'Engineering',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-012',
    name: 'ECG Machine',
    company: 'Nihon Kohden',
    model: 'ECG-12L',
    type: 'Medical',
    serialNumber: '6180234',
    calibrationCycle: '6 เดือน',
    dueDate: '2026-03-10',
    lastCalibrationDate: '2025-09-10',
    location: 'CCU',
    department: 'Cardiology',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-013',
    name: 'Syringe Pump',
    company: 'B. Braun',
    model: 'SP-Elite',
    type: 'Medical',
    serialNumber: '9250678',
    calibrationCycle: '6 เดือน',
    dueDate: '2026-01-15',
    lastCalibrationDate: '2025-07-15',
    location: 'ICU',
    department: 'Anesthesia',
    status: 'รอดำเนินการ',
  },
  {
    id: 'BME-014',
    name: 'Autoclave',
    company: 'Tuttnauer',
    model: 'AC-350Pro',
    type: 'Dimension',
    serialNumber: '7840356',
    calibrationCycle: '12 เดือน',
    dueDate: '2026-06-01',
    lastCalibrationDate: '2025-06-01',
    location: 'CSR',
    department: 'CSSD',
    status: 'พร้อมใช้งาน',
  },
  {
    id: 'BME-015',
    name: 'Blood Pressure Monitor',
    company: 'Omron',
    model: 'BP-Auto3',
    type: 'Medical',
    serialNumber: '5430912',
    calibrationCycle: '6 เดือน',
    dueDate: '2025-11-30',
    lastCalibrationDate: '2025-05-30',
    location: 'OPD',
    department: 'General',
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
