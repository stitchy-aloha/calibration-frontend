import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export interface CalibrationEvent {
  id: string; // Event ID
  toolCode: string; // e.g., 'BME-003'
  toolName: string; // e.g., 'Infusion Pump'
  location: string; // e.g., 'ICU / เตียง 2'
  frequency: string; // e.g., 'ทุก 6 เดือน'
  assignedTo: string; // Name of the person, e.g., 'นายสมโชค ขัยเกษม'
  dueDate: string; // format 'YYYY-MM-DD'
  isCompleted: boolean;
}

export const useScheduleStore = defineStore('schedule', () => {
  const authStore = useAuthStore();

  // Create some mock events dynamically around the current month
  function generateMockEvents(): CalibrationEvent[] {
    const events: CalibrationEvent[] = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const thisMonthStr = String(month).padStart(2, '0');

    // We'll mock a user name for 'other'
    const otherUserName = 'นายศุภโชค อนันต์';
    // The current user name, defaulting if not logged in
    const currentUserName = authStore.user?.fullName || 'ช่างเทคนิค';

    // Helper to add an event
    const addE = (
      day: number,
      isCurrentUser: boolean,
      toolName = 'Infusion Pump',
      toolCode = 'BME-003',
      location = 'ICU / เตียง 2',
    ) => {
      events.push({
        id: `EVT-${events.length + 1}`,
        toolCode,
        toolName,
        location,
        frequency: 'ทุก 6 เดือน',
        assignedTo: isCurrentUser ? currentUserName : otherUserName,
        dueDate: `${year}-${thisMonthStr}-${String(day).padStart(2, '0')}`,
        isCompleted: day < now.getDate(), // Mark past days as completed just for realism
      });
    };

    // Add some events to current month
    // Mix of current user and other user
    addE(2, true, 'Ventilator', 'BME-001', 'ER / เตียง 1');
    addE(5, false, 'Patient Monitor', 'BME-005', 'OR / ห้อง 3');
    addE(12, true);
    addE(15, false);
    addE(18, true, 'Infusion Pump', 'BME-008', 'Ward-1A');
    addE(18, false, 'Syringe Pump', 'BME-012', 'Ward-1A');
    addE(22, true);

    // Some for today or near today
    const today = now.getDate();
    addE(today, true, 'Defibrillator', 'BME-002', 'ER');
    addE(today, false, 'Infusion Pump', 'BME-004', 'ICU');

    if (today + 2 <= 28) {
      addE(today + 2, true);
      addE(today + 2, true, 'Patient Monitor', 'BME-007', 'OR');
    }

    return events;
  }

  const events = ref<CalibrationEvent[]>(generateMockEvents());

  // Default selected date to today
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const selectedDate = ref<string>(todayStr);

  const selectedDateEvents = computed(() => {
    return events.value.filter((e) => e.dueDate === selectedDate.value);
  });

  // A mapping of date strings to number of events for the calendar badges
  const eventsCountByDate = computed(() => {
    const counts: Record<string, number> = {};
    events.value.forEach((e) => {
      counts[e.dueDate] = (counts[e.dueDate] || 0) + 1;
    });
    return counts;
  });

  function selectDate(dateStr: string) {
    selectedDate.value = dateStr;
  }

  return {
    events,
    selectedDate,
    selectedDateEvents,
    eventsCountByDate,
    selectDate,
    currentUserName: computed(() => authStore.user?.fullName),
  };
});
