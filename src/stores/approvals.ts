import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ApprovalEvent } from 'src/types';

export const useApprovalsStore = defineStore('approvals', () => {
  // Generate mock data for approvals based on the mockup image
  function generateMockApprovals(): ApprovalEvent[] {
    const list: ApprovalEvent[] = [];
    const baseDate = '2025-06-26';

    const items = [
      { id: 'CAL-200', name: 'Infusion Pump', code: 'BME-101', loc: 'ER-01' },
      { id: 'CAL-002', name: 'Patient Monitor', code: 'BME-002', loc: 'NUR' },
      { id: 'CAL-202', name: 'Infusion Pump', code: 'BME-015', loc: 'ICU-01' },
      { id: 'CAL-203', name: 'Infusion Pump', code: 'BME-016', loc: 'ICU-02' },
      { id: 'CAL-204', name: 'Infusion Pump', code: 'BME-017', loc: 'ICU-02' },
      { id: 'CAL-205', name: 'Infusion Pump', code: 'BME-021', loc: 'ICU-03' },
      { id: 'CAL-206', name: 'Infusion Pump', code: 'BME-022', loc: 'ICU-03' },
      { id: 'CAL-207', name: 'Infusion Pump', code: 'BME-031', loc: 'ICU-04' },
      { id: 'CAL-208', name: 'Infusion Pump', code: 'BME-041', loc: 'ICU-05' },
      { id: 'CAL-209', name: 'Infusion Pump', code: 'BME-042', loc: 'ICU-05' },
      { id: 'CAL-210', name: 'Infusion Pump', code: 'BME-043', loc: 'ICU-05' },
      { id: 'CAL-211', name: 'Infusion Pump', code: 'BME-044', loc: 'ICU-05' },
      { id: 'CAL-212', name: 'Infusion Pump', code: 'BME-045', loc: 'ICU-05' },
      { id: 'CAL-213', name: 'Infusion Pump', code: 'BME-046', loc: 'ICU-05' },
      { id: 'CAL-214', name: 'Infusion Pump', code: 'BME-047', loc: 'ICU-05' },
    ];

    items.forEach((item) => {
      list.push({
        id: item.id,
        toolName: item.name,
        toolCode: item.code,
        location: item.loc,
        calDate: baseDate,
        result: 'ผ่าน',
        status: 'pending',
      });
    });

    return list;
  }

  const approvals = ref<ApprovalEvent[]>(generateMockApprovals());
  const searchQuery = ref('');
  const selectedType = ref('ทั้งหมด');

  const typeOptions = [
    { label: 'ทั้งหมด', value: 'ทั้งหมด' },
    { label: 'รอดำเนินการ', value: 'pending' },
    { label: 'อนุมัติแล้ว', value: 'approved' },
    { label: 'ปฏิเสธ', value: 'rejected' },
  ];

  const filteredApprovals = computed(() => {
    let result = approvals.value;

    // Filter by search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.toolName.toLowerCase().includes(q) ||
          a.toolCode.toLowerCase().includes(q),
      );
    }

    if (selectedType.value !== 'ทั้งหมด') {
      result = result.filter((a) => a.status === selectedType.value);
    }

    return result;
  });

  function approveEvent(id: string) {
    const event = approvals.value.find((e) => e.id === id);
    if (event) {
      event.status = 'approved';
    }
  }

  return {
    approvals,
    searchQuery,
    selectedType,
    typeOptions,
    filteredApprovals,
    approveEvent,
  };
});
