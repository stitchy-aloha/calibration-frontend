import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { pmService, type ChecklistCategoryApi } from 'src/services/pm.service';

export type InspectionValue = 'ผ่าน' | 'ไม่ผ่าน' | 'N/A';

export interface InspectionItem {
  id: number; // checklist_items.id — needed for pm-save payload
  categoryId: number;
  label: string;
  value: InspectionValue;
}

export interface InspectionSection {
  id: number; // checklist_categories.id — needed for remarks payload
  title: string;
  items: InspectionItem[];
  remarks: string;
}

export interface DeviceInfo {
  deviceName: string;
  company: string; // alias for manufacturer — used by DeviceInfoCard & ApprovalDetailPage
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetCode: string;
  category: string; // ประเภท — FK not yet available
  department: string; // หน่วยงาน — FK not yet available
  location: string; // ที่ตั้ง — FK not yet available
  calibrationInterval: string;
  lastCalibrationDate: string;
  dueDate: string;
}

const VALUE_MAP_REVERSE: Record<InspectionValue, 'Pass' | 'Fail' | 'NA'> = {
  ผ่าน: 'Pass',
  ไม่ผ่าน: 'Fail',
  'N/A': 'NA',
};

const RESULT_MAP_REVERSE: Record<'ผ่าน' | 'ไม่ผ่าน' | 'N/A', 'Pass' | 'Fail' | 'NA'> = {
  ผ่าน: 'Pass',
  ไม่ผ่าน: 'Fail',
  'N/A': 'NA',
};

export const useInspectionStore = defineStore('inspection', () => {
  const pmNo = ref('');
  const taskId = ref<number | null>(null);
  const pmByName = ref('');
  const pmByPosition = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const deviceInfo = ref<DeviceInfo>({
    deviceName: '',
    company: '',
    manufacturer: '',
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

  const sections = ref<InspectionSection[]>([]);

  // ── Computed helpers ────────────────────────────────────────────────────────
  const allItems = computed(() => sections.value.flatMap((s) => s.items));

  const pmResult = computed<'ผ่าน' | 'ไม่ผ่าน' | 'N/A'>(() => {
    if (allItems.value.some((i) => i.value === 'ไม่ผ่าน')) return 'ไม่ผ่าน';
    if (allItems.value.some((i) => i.value === 'ผ่าน')) return 'ผ่าน';
    return 'N/A';
  });

  const pmBy = computed(() => {
    const auth = useAuthStore();
    return pmByName.value || auth.user?.fullName || '';
  });

  const pmPosition = computed(() => pmByPosition.value || 'ช่างสอบเทียบ');

  // ── Backwards-compat getters for InspectionSection component ───────────────
  const generalItems = computed(() => sections.value[0]?.items ?? []);
  const safetyItems = computed(() => sections.value[1]?.items ?? []);
  const maintenanceItems = computed(() => sections.value[2]?.items ?? []);
  const generalRemarks = computed({
    get: () => sections.value[0]?.remarks ?? '',
    set: (v: string) => {
      if (sections.value[0]) sections.value[0].remarks = v;
    },
  });
  const safetyRemarks = computed({
    get: () => sections.value[1]?.remarks ?? '',
    set: (v: string) => {
      if (sections.value[1]) sections.value[1].remarks = v;
    },
  });
  const maintenanceRemarks = computed({
    get: () => sections.value[2]?.remarks ?? '',
    set: (v: string) => {
      if (sections.value[2]) sections.value[2].remarks = v;
    },
  });

  // ── Actions ─────────────────────────────────────────────────────────────────

  function buildSections(categories: ChecklistCategoryApi[]): InspectionSection[] {
    return categories.map((cat) => ({
      id: cat.id,
      title: cat.name,
      remarks: '',
      items: cat.items.map((item) => ({
        id: item.id,
        categoryId: cat.id,
        label: item.description,
        value: 'N/A' as InspectionValue,
      })),
    }));
  }

  async function loadFromTask(tId: number) {
    isLoading.value = true;
    error.value = null;
    try {
      const task = await pmService.getTask(tId);
      if (!task) throw new Error(`Task #${tId} not found`);

      taskId.value = task.id;
      pmNo.value = task.pm_no ?? '';
      pmByName.value = task.technician?.name ?? '';
      pmByPosition.value = task.technician?.position ?? '';

      const [categoriesRes, equipmentRes] = await Promise.all([
        pmService.getPmForm(task.equipment_id),
        pmService.getEquipment(task.equipment_id),
      ]);

      const eq = equipmentRes.data;
      const mfr = eq.manufacturer ?? '-';
      deviceInfo.value = {
        deviceName: eq.name,
        company: mfr,
        manufacturer: mfr,
        model: eq.model ?? '-',
        serialNumber: eq.serial_number ?? '-',
        assetCode: eq.asset_code ?? '-',
        category: '-',
        department: '-',
        location: '-',
        calibrationInterval: eq.interval ? `${eq.interval} วัน` : '-',
        lastCalibrationDate: eq.calibration_date_last ?? '-',
        dueDate: eq.calibration_due_date ?? '-',
      };

      sections.value = buildSections(categoriesRes.data);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'เกิดข้อผิดพลาด';
    } finally {
      isLoading.value = false;
    }
  }

  function setItemValue(sectionIdx: number, itemIdx: number, value: InspectionValue) {
    const section = sections.value[sectionIdx];
    if (section?.items[itemIdx]) {
      section.items[itemIdx].value = value;
    }
  }

  async function submitPmForm(): Promise<{ success: boolean; error?: string }> {
    if (!taskId.value) return { success: false, error: 'ไม่มี task_id' };

    const results = allItems.value.map((item) => ({
      item_id: item.id,
      status: VALUE_MAP_REVERSE[item.value],
    }));

    const remarks = sections.value
      .filter((s) => s.remarks.trim() !== '')
      .map((s) => ({ category_id: s.id, text: s.remarks }));

    try {
      await pmService.savePmForm({
        task_id: taskId.value,
        overall_result: RESULT_MAP_REVERSE[pmResult.value],
        status: 'Done',
        results,
        remarks,
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ' };
    }
  }

  function resetAll() {
    sections.value = [];
    pmNo.value = '';
    taskId.value = null;
    pmByName.value = '';
    pmByPosition.value = '';
    error.value = null;
  }

  return {
    pmNo,
    taskId,
    pmByName,
    pmByPosition,
    isLoading,
    error,
    deviceInfo,
    sections,
    allItems,
    pmResult,
    pmBy,
    pmPosition,
    generalItems,
    safetyItems,
    maintenanceItems,
    generalRemarks,
    safetyRemarks,
    maintenanceRemarks,
    loadFromTask,
    setItemValue,
    submitPmForm,
    resetAll,
  };
});
