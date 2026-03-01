import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { useCalibrationStore } from './calibration';
import { useToolsStore } from './tools';

export type InspectionValue = 'ผ่าน' | 'ไม่ผ่าน' | 'N/A';

export interface InspectionItem {
  label: string;
  value: InspectionValue;
}

export interface DeviceInfo {
  deviceName: string;
  company: string;
  model: string;
  serialNumber: string;
  assetCode: string;
  category: string;
  department: string;
  location: string;
  calibrationInterval: string;
  lastCalibrationDate: string;
  dueDate: string;
}

const createGeneralItems = (): InspectionItem[] => [
  { label: 'สภาพภายนอก/โครงสร้าง', value: 'N/A' },
  { label: 'ลักษณะการติดตั้ง/ยึดโครง', value: 'N/A' },
  { label: 'การขับเคลื่อน/เบรค', value: 'N/A' },
  { label: 'สายไฟ AC ปลั๊ก', value: 'N/A' },
  { label: 'สายสัญญาณ', value: 'N/A' },
  { label: 'ความคิง หย่อน', value: 'N/A' },
  { label: 'เบรกเกอร์/ฟิวส์', value: 'N/A' },
  { label: 'หลอด ท่อ', value: 'N/A' },
  { label: 'สายเคเบิล', value: 'N/A' },
  { label: 'ข้อต่อ/จุดต่อต่างๆ', value: 'N/A' },
  { label: 'Electrodes/Transducers', value: 'N/A' },
  { label: 'ฟิลเตอร์', value: 'N/A' },
  { label: 'สวิทช์/การควบคุม', value: 'N/A' },
  { label: 'ฮีทเตอร์', value: 'N/A' },
  { label: 'มอเตอร์', value: 'N/A' },
  { label: 'ระดับของเหลว', value: 'N/A' },
  { label: 'แบตเตอรี่', value: 'N/A' },
  { label: 'การแสดงผล', value: 'N/A' },
  { label: 'Self Test', value: 'N/A' },
  { label: 'สัญญาณเตือน', value: 'N/A' },
  { label: 'สัญญาณการทำงาน', value: 'N/A' },
  { label: 'ฉลาก/เครื่องหมาย', value: 'N/A' },
  { label: 'อุปกรณ์', value: 'N/A' },
];

const createSafetyItems = (): InspectionItem[] => [
  { label: 'ระบบกราวด์ (0.5 OHM)', value: 'N/A' },
  { label: 'การรั่วของกระแสไฟฟ้า', value: 'N/A' },
];

const createMaintenanceItems = (): InspectionItem[] => [
  { label: 'ทำความสะอาดเครื่อง, ส่วนประกอบ', value: 'N/A' },
  { label: 'การหล่อเลื่อนจุดหมุนกลไกต่าง ๆ', value: 'N/A' },
  { label: 'ปรับเทียบค่ามาตรฐาน/ปรับกลไก', value: 'N/A' },
  { label: 'เปลี่ยนฟิลเตอร์/แปลงถ่าน', value: 'N/A' },
  { label: 'เปลี่ยนถ่ายของเหลวในกระเปาะ', value: 'N/A' },
];

let pmCounter = 0;

function generatePmNo(): string {
  pmCounter += 1;
  return `PM-${String(pmCounter).padStart(2, '0')}`;
}

export const useInspectionStore = defineStore('inspection', () => {
  const pmNo = ref(generatePmNo());

  const deviceInfo = ref<DeviceInfo>({
    deviceName: '',
    company: '',
    model: '',
    serialNumber: '',
    assetCode: '',
    category: '',
    department: '',
    location: '',
    calibrationInterval: '',
    lastCalibrationDate: '',
    dueDate: '',
  });

  const generalItems = ref<InspectionItem[]>(createGeneralItems());
  const safetyItems = ref<InspectionItem[]>(createSafetyItems());
  const maintenanceItems = ref<InspectionItem[]>(createMaintenanceItems());

  const generalRemarks = ref('');
  const safetyRemarks = ref('');
  const maintenanceRemarks = ref('');

  function loadFromCalibration(calId: string) {
    const calStore = useCalibrationStore();
    const toolsStore = useToolsStore();

    const calRecord = calStore.records.find((r) => r.id === calId);
    if (!calRecord) return;

    const tool = toolsStore.tools.find((t) => t.id === calRecord.deviceCode);

    deviceInfo.value = {
      deviceName: calRecord.deviceName,
      company: tool?.company ?? '-',
      model: tool?.model ?? '-',
      serialNumber: tool?.serialNumber ?? '-',
      assetCode: calRecord.deviceCode,
      category: calRecord.type,
      department: tool?.department ?? '-',
      location: calRecord.location,
      calibrationInterval: tool?.calibrationCycle ?? '6 เดือน',
      lastCalibrationDate: tool?.lastCalibrationDate ?? '-',
      dueDate: calRecord.dueDate,
    };

    // Reset items for fresh inspection
    generalItems.value = createGeneralItems();
    safetyItems.value = createSafetyItems();
    maintenanceItems.value = createMaintenanceItems();
    generalRemarks.value = '';
    safetyRemarks.value = '';
    maintenanceRemarks.value = '';
    pmNo.value = generatePmNo();
  }

  function setItemValue(
    section: 'general' | 'safety' | 'maintenance',
    index: number,
    value: InspectionValue,
  ) {
    const items =
      section === 'general' ? generalItems : section === 'safety' ? safetyItems : maintenanceItems;

    if (items.value[index]) {
      items.value[index].value = value;
    }
  }

  const allItems = computed(() => [
    ...generalItems.value,
    ...safetyItems.value,
    ...maintenanceItems.value,
  ]);

  const pmResult = computed<'ผ่าน' | 'ไม่ผ่าน' | 'N/A'>(() => {
    const items = allItems.value;
    const hasFail = items.some((i) => i.value === 'ไม่ผ่าน');
    if (hasFail) return 'ไม่ผ่าน';

    const hasPass = items.some((i) => i.value === 'ผ่าน');
    if (hasPass) return 'ผ่าน';

    return 'N/A';
  });

  const pmBy = computed(() => {
    const auth = useAuthStore();
    return auth.user?.fullName ?? '';
  });

  const pmPosition = computed(() => 'ช่างสอบเทียบ');

  function resetAll() {
    generalItems.value = createGeneralItems();
    safetyItems.value = createSafetyItems();
    maintenanceItems.value = createMaintenanceItems();
    generalRemarks.value = '';
    safetyRemarks.value = '';
    maintenanceRemarks.value = '';
  }

  return {
    pmNo,
    deviceInfo,
    generalItems,
    safetyItems,
    maintenanceItems,
    generalRemarks,
    safetyRemarks,
    maintenanceRemarks,
    loadFromCalibration,
    setItemValue,
    allItems,
    pmResult,
    pmBy,
    pmPosition,
    resetAll,
  };
});
