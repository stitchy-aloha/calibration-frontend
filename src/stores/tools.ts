import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MedicalTool, ToolType, CalibrationProcess, CalibrationCost } from 'src/types';

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
    status: 'ส่งซ่อม',
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
    status: 'กำลังใช้งาน',
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
    status: 'กำลังใช้งาน',
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
    status: 'กำลังใช้งาน',
  },
];

const mockCalibrationProcesses: CalibrationProcess[] = [
  {
    id: 'CP-001',
    parameter: 'Temp',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'mmHg',
    standardEquipment: 'Temp - Alpha Technics',
  },
  {
    id: 'CP-002',
    parameter: 'Temp-Bath',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'BPM',
    standardEquipment: 'Temp - Alpha Technics',
  },
  {
    id: 'CP-003',
    parameter: 'BP analog',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: '%',
    standardEquipment: 'Pressure - ADDITEL',
  },
  {
    id: 'CP-004',
    parameter: 'Suc-additel',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'mmHg',
    standardEquipment: 'Pressure - ADDITEL',
  },
  {
    id: 'CP-005',
    parameter: 'Flow',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'LPM',
    standardEquipment: 'Flow - BIOS',
  },
  {
    id: 'CP-006',
    parameter: 'We-PD',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'Kg',
    standardEquipment: 'Weight M1 - LS',
  },
  {
    id: 'CP-007',
    parameter: 'We-NEO',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'gram',
    standardEquipment: 'Weight F1 10kg - LS',
  },
  {
    id: 'CP-008',
    parameter: 'We-BAL',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'gram',
    standardEquipment: 'Weight F1 110g - LS',
  },
  {
    id: 'CP-009',
    parameter: 'Hema',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'mmHg',
    standardEquipment: 'Speed - Tachometer',
  },
  {
    id: 'CP-010',
    parameter: 'EKG',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'mmHg',
    standardEquipment: 'NIBP EKG - FLUKE',
  },
  {
    id: 'CP-011',
    parameter: 'Ala-Casio',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'Sec',
    standardEquipment: 'Time - CASIO',
  },
  {
    id: 'CP-012',
    parameter: 'Patient BP/EKG',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'BPM',
    standardEquipment: 'NIBP EKG - FLUKE',
  },
  {
    id: 'CP-013',
    parameter: 'Nibp',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'BPM',
    standardEquipment: 'NIBP EKG - FLUKE',
  },
  {
    id: 'CP-014',
    parameter: 'SPO2',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: 'BPM',
    standardEquipment: 'SPO2 EKG - FLUKE',
  },
  {
    id: 'CP-015',
    parameter: 'Temp-Incubator',
    procedure: 'โดยการนำเครื่องมือที่ต้องการ...',
    unit: '°C',
    standardEquipment: 'Temp - Alpha Technics',
  },
];

const mockCalibrationCosts: CalibrationCost[] = [
  { id: 'CC-001', toolName: 'Alarm Clock', description: 'นาฬิกาจับเวลา', price: 300 },
  { id: 'CC-002', toolName: 'Amalgamator', description: 'เครื่องปั่นผสมสารอุดฟัน', price: 600 },
  {
    id: 'CC-003',
    toolName: 'Ambient Thermometer',
    description: 'เทอร์โมมิเตอร์วัดอุณหภูมิภายในห้อง',
    price: 300,
  },
  { id: 'CC-004', toolName: 'Anaesthesia', description: 'เครื่องเปอร์เซ็นต์สารดมสลบ', price: 1800 },
  {
    id: 'CC-005',
    toolName: 'Anaesthesia (Machine)',
    description: 'เครื่องให้สารดมสลบ (ส่วนควบคุม)',
    price: 1200,
  },
  {
    id: 'CC-006',
    toolName: 'Anaesthesia (Vapourizer)',
    description: 'เครื่องให้สารดมสลบ (ส่วนไอระเหย)',
    price: 1200,
  },
  { id: 'CC-007', toolName: 'Analytical Balance', description: 'เครื่องชั่งสาร', price: 350 },
  { id: 'CC-008', toolName: 'Blood Bank', description: 'ตู้เย็นเก็บเลือด', price: 300 },
  { id: 'CC-009', toolName: 'Blood Pressure', description: 'เครื่องวัดความดันโลหิต', price: 600 },
  { id: 'CC-010', toolName: 'Centrifuge', description: 'เครื่องปั่นปสสาวะ', price: 800 },
  { id: 'CC-011', toolName: 'Defiblillator', description: 'เครื่องกระตุกหัวใจ', price: 800 },
  { id: 'CC-012', toolName: 'ECG Machine', description: 'เครื่องวัดคลื่นไฟฟ้าหัวใจ', price: 700 },
  {
    id: 'CC-013',
    toolName: 'Infusion Pump',
    description: 'เครื่องให้สารน้ำทางหลอดเลือด',
    price: 500,
  },
  { id: 'CC-014', toolName: 'Ventilator', description: 'เครื่องช่วยหายใจ', price: 2000 },
];

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<MedicalTool[]>(mockTools);
  const calibrationProcesses = ref<CalibrationProcess[]>(mockCalibrationProcesses);
  const calibrationCosts = ref<CalibrationCost[]>(mockCalibrationCosts);
  const searchQuery = ref('');
  const selectedType = ref<ToolType | ''>('');

  const typeOptions: { label: string; value: ToolType | '' }[] = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Dimension', value: 'Dimension' },
  ];

  const statusOptions = [
    { label: 'พร้อมใช้งาน', value: 'พร้อมใช้งาน' },
    { label: 'กำลังสอบเทียบ', value: 'กำลังสอบเทียบ' },
    { label: 'รอดำเนินการ', value: 'รอดำเนินการ' },
    { label: 'จำหน่ายแล้ว', value: 'จำหน่ายแล้ว' },
    { label: 'กำลังใช้งาน', value: 'กำลังใช้งาน' },
    { label: 'ส่งซ่อม', value: 'ส่งซ่อม' },
    { label: 'ปิดใช้งาน', value: 'ปิดใช้งาน' },
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

  function addCalibrationProcess(item: Omit<CalibrationProcess, 'id'>) {
    const nextNum = calibrationProcesses.value.length + 1;
    calibrationProcesses.value.push({ ...item, id: `CP-${String(nextNum).padStart(3, '0')}` });
  }

  function updateCalibrationProcess(id: string, data: Partial<CalibrationProcess>) {
    const idx = calibrationProcesses.value.findIndex((p) => p.id === id);
    if (idx !== -1) {
      calibrationProcesses.value[idx] = { ...calibrationProcesses.value[idx]!, ...data, id };
    }
  }

  function deleteCalibrationProcess(id: string) {
    calibrationProcesses.value = calibrationProcesses.value.filter((p) => p.id !== id);
  }

  function addCalibrationCost(item: Omit<CalibrationCost, 'id'>) {
    const nextNum = calibrationCosts.value.length + 1;
    calibrationCosts.value.push({ ...item, id: `CC-${String(nextNum).padStart(3, '0')}` });
  }

  function updateCalibrationCost(id: string, data: Partial<CalibrationCost>) {
    const idx = calibrationCosts.value.findIndex((c) => c.id === id);
    if (idx !== -1) {
      calibrationCosts.value[idx] = { ...calibrationCosts.value[idx]!, ...data, id };
    }
  }

  function deleteCalibrationCost(id: string) {
    calibrationCosts.value = calibrationCosts.value.filter((c) => c.id !== id);
  }

  return {
    tools,
    calibrationProcesses,
    calibrationCosts,
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
    addCalibrationProcess,
    updateCalibrationProcess,
    deleteCalibrationProcess,
    addCalibrationCost,
    updateCalibrationCost,
    deleteCalibrationCost,
  };
});
