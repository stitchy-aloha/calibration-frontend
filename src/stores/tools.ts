import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MedicalTool, CalibrationProcess, CalibrationCost, ToolStatus } from 'src/types';
import { ToolService, HospitalService, SectionService } from 'src/services/tool.service';
import type { BackendEquipment, Hospital, Section } from 'src/services/tool.service';

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

// Type interface removed to allow better inference in Setup Store pattern

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<MedicalTool[]>([]);
  const loading = ref(false);
  const equipmentTypes = ref<{ id: number; name: string }[]>([]);
  const hospitals = ref<Hospital[]>([]);
  const sections = ref<Section[]>([]);

  // Map backend status string → frontend Thai status
  function mapStatus(s: string): ToolStatus {
    const map: Record<string, ToolStatus> = {
      active: 'กำลังใช้งาน',
      inactive: 'ปิดใช้งาน',
      maintenance: 'กำลังสอบเทียบ',
      ready: 'พร้อมใช้งาน',
    };
    return map[s] ?? 'พร้อมใช้งาน';
  }

  // Map frontend Thai status → backend string
  function unmapStatus(s: ToolStatus): string {
    const map: Record<ToolStatus, string> = {
      กำลังใช้งาน: 'active',
      ปิดใช้งาน: 'inactive',
      กำลังสอบเทียบ: 'maintenance',
      พร้อมใช้งาน: 'active',
      รอดำเนินการ: 'inactive',
      ส่งซ่อม: 'maintenance',
      จำหน่ายแล้ว: 'inactive',
    };
    return map[s] ?? 'active';
  }

  // Normalize date: if "-" or empty, return null
  function normalizeDate(d: string | undefined | null): string | null {
    if (!d || d === '-') return null;
    return d;
  }

  async function fetchEquipmentTypes(): Promise<void> {
    try {
      const res = await ToolService.getEquipmentTypes();
      equipmentTypes.value = res.data;
    } catch (e) {
      console.error('fetchEquipmentTypes error:', e);
    }
  }
  async function fetchHospitals(): Promise<void> {
    try {
      const res = await HospitalService.getAll();
      hospitals.value = res.data;
    } catch (e) {
      console.error('fetchHospitals error:', e);
    }
  }
  async function fetchSections(): Promise<void> {
    try {
      const res = await SectionService.getAll();
      sections.value = res.data;
    } catch (e) {
      console.error('fetchSections error:', e);
    }
  }

  async function fetchTools(): Promise<void> {
    loading.value = true;
    try {
      // Ensure types are fetched
      if (equipmentTypes.value.length === 0) {
        await fetchEquipmentTypes();
      }

      const res = await ToolService.getAll();
      tools.value = res.data.map((item: BackendEquipment) => ({
        id: item.asset_code || String(item.id),
        backendId: item.id,
        name: item.name,
        company: item.manufacturer ?? '-',
        model: item.model ?? '-',
        type: item.equipmentType?.name || '-',
        riskLevel: item.risk_level || '-',
        equipment_type_id: item.equipment_type_id || null, // Added || null
        serialNumber: item.serial_number ?? '-',
        calibrationCycle: item.interval ? `${item.interval} วัน` : '-',
        dueDate: item.calibration_due_date ?? '-',
        lastCalibrationDate: item.calibration_date_last ?? '-',
        location: item.section?.hospital?.name || item.location || '-',
        department: item.section?.name || item.department || '-',
        hospitalId: item.section?.hospital?.id || null,
        sectionId: item.sectionId || null,
        status: mapStatus(item.status),
      }));
    } catch (e) {
      console.error('fetchTools error:', e);
    } finally {
      loading.value = false;
    }
  }

  async function addTool(tool: Omit<MedicalTool, 'id'>): Promise<void> {
    await ToolService.create({
      name: tool.name,
      manufacturer: tool.company,
      model: tool.model,
      serial_number: tool.serialNumber,
      interval: parseInt(tool.calibrationCycle) || 365,
      calibration_due_date: normalizeDate(tool.dueDate),
      calibration_date_last: normalizeDate(tool.lastCalibrationDate),
      status: unmapStatus(tool.status),
      risk_level: tool.riskLevel || 'medium',
      equipment_type_id: tool.equipment_type_id ?? null,
      sectionId: tool.sectionId ?? null,
    });
    await fetchTools();
  }

  async function updateTool(id: string, data: Partial<MedicalTool>): Promise<void> {
    const target = tools.value.find((t) => t.id === id);
    const backendId = target?.backendId ?? Number(id);
    await ToolService.update(backendId, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.company !== undefined && { manufacturer: data.company }),
      ...(data.model !== undefined && { model: data.model }),
      ...(data.serialNumber !== undefined && { serial_number: data.serialNumber }),
      ...(data.riskLevel !== undefined && { risk_level: data.riskLevel }),
      ...(data.equipment_type_id !== undefined && {
        equipment_type_id: data.equipment_type_id ?? null,
      }),
      ...(data.calibrationCycle !== undefined && {
        interval: parseInt(data.calibrationCycle) || 365,
      }),
      ...(data.dueDate !== undefined && { calibration_due_date: normalizeDate(data.dueDate) }),
      ...(data.lastCalibrationDate !== undefined && {
        calibration_date_last: normalizeDate(data.lastCalibrationDate),
      }),
      ...(data.status !== undefined && { status: unmapStatus(data.status) }),
      ...(data.sectionId !== undefined && { sectionId: data.sectionId ?? null }),
    });
    await fetchTools();
  }

  async function deleteTool(id: string): Promise<void> {
    const target = tools.value.find((t) => t.id === id);
    const backendId = target?.backendId ?? Number(id);
    await ToolService.remove(backendId);
    await fetchTools();
  }

  const calibrationProcesses = ref<CalibrationProcess[]>(mockCalibrationProcesses);
  const calibrationCosts = ref<CalibrationCost[]>(mockCalibrationCosts);
  const searchQuery = ref('');
  const selectedType = ref<string>('');

  const typeOptions = computed(() => {
    const options = [{ label: 'ทั้งหมด', value: '' }];
    equipmentTypes.value.forEach((t) => {
      options.push({ label: t.name, value: t.name });
    });
    return options;
  });

  const statusOptions: { label: string; value: ToolStatus }[] = [
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
    fetchTools,
    loading,
    equipmentTypes,
    fetchEquipmentTypes,
    hospitals,
    sections,
    fetchHospitals,
    fetchSections,
  };
});
