import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Ward {
  id: string;
  name: string;
  description: string;
  toolCount: number;
}

export interface WardTimelineEvent {
  id: number;
  date: number; // Just the day number for mock
  toolName: string;
  toolCode: string;
}

export interface WardTool {
  id: string; // e.g. BME-001
  name: string;
  dueDate: string; // e.g. 2025-12-26
  statusLabel: string; // e.g. 'วันนี้', 'อีก 2 วัน'
  isDanger: boolean; // For red status text
}

export const useWardsStore = defineStore('wards', () => {
  // Helper to generate a batch of the same tool type
  function generateTools(
    wardId: string,
    toolName: string,
    count: number,
    startIdx: number,
    dateOffsetRange: [number, number],
  ): WardTool[] {
    const result: WardTool[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    // Default to a date near the 20th if today is earlier, or let's just make it relative to today for more realism
    const todayDay = now.getDate();

    // We want the dates to be roughly today + offset
    for (let i = 0; i < count; i++) {
      // Randomize within range for mock
      const dayOffset =
        Math.floor(Math.random() * (dateOffsetRange[1] - dateOffsetRange[0] + 1)) +
        dateOffsetRange[0];

      // Date relative to today, capped at end of month to keep it simple for the calendar view
      // (a real app would cross months, but let's stick to current month for the demo UI request)
      let dateDay = todayDay + dayOffset;
      if (dateDay > daysInMonth) dateDay = daysInMonth; // Cap at month end for display simplicity

      const monthStr = String(currentMonth).padStart(2, '0');
      const dueDate = `${currentYear}-${monthStr}-${String(dateDay).padStart(2, '0')}`;

      let statusLabel = '';
      let isDanger = false;
      if (dateDay === todayDay) {
        statusLabel = 'วันนี้';
        isDanger = true;
      } else if (dateDay > todayDay) {
        statusLabel = `อีก ${dateDay - todayDay} วัน`;
        isDanger = false;
      } else {
        statusLabel = `เลยมา ${todayDay - dateDay} วัน`;
        isDanger = true;
      }

      result.push({
        id: `${wardId}-BME-${String(startIdx + i).padStart(3, '0')}`,
        name: toolName,
        dueDate,
        statusLabel,
        isDanger,
      });
    }
    return result;
  }

  // Pre-generate all tools for all wards so we can correctly count them
  const allTools = computed<Record<string, WardTool[]>>(() => {
    return {
      ER: [
        ...generateTools('ER', 'Defibrillator', 3, 1, [0, 2]),
        ...generateTools('ER', 'Patient Monitor', 5, 4, [1, 5]),
        ...generateTools('ER', 'Transport Ventilator', 2, 9, [0, 5]),
      ],
      ICU: [
        ...generateTools('ICU', 'Ventilator', 4, 1, [0, 3]),
        ...generateTools('ICU', 'Patient Monitor', 6, 5, [1, 5]),
        ...generateTools('ICU', 'Infusion Pump', 5, 11, [0, 4]),
      ],
      OR: [
        ...generateTools('OR', 'Anesthesia Machine', 4, 1, [1, 5]),
        ...generateTools('OR', 'Electrosurgical Unit', 3, 5, [0, 4]),
        ...generateTools('OR', 'Patient Monitor', 4, 8, [2, 5]),
        ...generateTools('OR', 'Infusion Pump', 4, 12, [0, 3]),
      ],
      'Ward-1A': [
        ...generateTools('Ward-1A', 'Infusion Pump', 6, 1, [1, 5]),
        ...generateTools('Ward-1A', 'Patient Monitor', 4, 7, [0, 4]),
        ...generateTools('Ward-1A', 'ECG Machine', 1, 11, [2, 2]),
      ],
      'Ward-2A': [
        ...generateTools('Ward-2A', 'Infusion Pump', 5, 1, [0, 5]),
        ...generateTools('Ward-2A', 'Syringe Pump', 5, 6, [1, 4]),
      ],
    };
  });

  const baseWards = [
    { id: 'ER', name: 'ER', description: 'Emergency Room' },
    { id: 'ICU', name: 'ICU', description: 'Intensive Care' },
    { id: 'OR', name: 'OR', description: 'Operating Room' },
    { id: 'Ward-1A', name: 'Ward-1A', description: 'General Ward' },
    { id: 'Ward-2A', name: 'Ward-2A', description: 'General Ward' },
  ];

  const wards = computed<Ward[]>(() => {
    return baseWards.map((w) => ({
      ...w,
      toolCount: allTools.value[w.id]?.length || 0,
    }));
  });

  const selectedWardId = ref<string>('ER');

  const selectedWard = computed(() => {
    return wards.value.find((w) => w.id === selectedWardId.value) || wards.value[0];
  });

  const tools = computed<WardTool[]>(() => {
    const unsortedTools = allTools.value[selectedWardId.value] || [];
    // Sort tools by date ascending so it matches the timeline order
    return [...unsortedTools].sort((a, b) => {
      const dayA = parseInt((a.dueDate || '').split('-')[2] ?? '0', 10);
      const dayB = parseInt((b.dueDate || '').split('-')[2] ?? '0', 10);
      return dayA - dayB;
    });
  });

  const timelineEvents = computed<WardTimelineEvent[]>(() => {
    // Derive timeline events directly from the generated tools
    return tools.value
      .map((t, index) => {
        // Parse the day out of '2025-12-XX'
        const dateParts = t.dueDate.split('-');
        const dateDay = parseInt(dateParts[2] ?? '0', 10);

        return {
          id: index + 1,
          date: dateDay,
          toolName: t.name,
          toolCode: t.id,
        };
      })
      .sort((a, b) => a.date - b.date); // Sort by date ascending for timeline
  });

  function selectWard(id: string) {
    selectedWardId.value = id;
  }

  return {
    wards,
    selectedWardId,
    selectedWard,
    timelineEvents,
    tools,
    selectWard,
  };
});
