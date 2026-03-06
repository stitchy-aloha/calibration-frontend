<template>
  <div class="schedule-calendar bg-white rounded-borders border-grey flex column overflow-hidden">
    <!-- Header -->
    <div class="calendar-header">
      <q-btn flat round dense icon="chevron_left" @click="prevMonth" />
      <div class="text-subtitle1 text-weight-medium">{{ monthYearString }}</div>
      <q-btn flat round dense icon="chevron_right" @click="nextMonth" />
      <div class="q-ml-auto text-grey-6 text-caption">แสดง {{ totalEventsInMonth }} รายการ</div>
    </div>

    <q-separator />

    <!-- Grid -->
    <div class="calendar-grid">
      <!-- Weekdays -->
      <div class="weekdays-row">
        <div
          v-for="day in ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']"
          :key="day"
          class="weekday-cell"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days Grid -->
      <div class="days-row">
        <div v-for="i in blankDays" :key="'blank-' + i" class="day-cell day-cell--blank"></div>

        <div
          v-for="date in daysInMonth"
          :key="date"
          class="day-cell cursor-pointer"
          :class="{
            'day-cell--active': isSelected(date),
            'day-cell--today': isToday(date),
          }"
          @click="selectDate(date)"
        >
          <div class="date-number-wrapper">
            <div
              class="date-number"
              :class="{ 'text-primary text-weight-bold': isToday(date) || isSelected(date) }"
            >
              {{ date }}
            </div>
            <!-- Red circle for today if needed, or we just bold it -->
          </div>

          <div class="calendar-badges full-width column items-center q-gutter-y-xs q-px-xs">
            <div v-if="getOtherEventCount(date) > 0" class="date-badge bg-grey-4 text-grey-8">
              {{ getOtherEventCount(date) }} เครื่อง
            </div>
            <div v-if="getMyEventCount(date) > 0" class="date-badge bg-secondary text-white">
              {{ getMyEventCount(date) }} เครื่อง
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Footer Legend -->
    <div class="calendar-footer row items-center q-gutter-x-md">
      <div class="legend-item">
        <div class="legend-dot bg-grey-4"></div>
        <span class="text-caption text-grey-8">งานทั้งหมด</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot bg-secondary"></div>
        <span class="text-caption text-grey-8">งานของฉัน</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useScheduleStore } from 'src/stores/schedule';

const store = useScheduleStore();

// Calendar state based on current date since we mock data around current month
const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth()); // 0-11

// Thai months array
const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const monthYearString = computed(() => {
  return `${thaiMonths[currentMonth.value]} ${currentYear.value + 543}`;
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const blankDays = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const totalEventsInMonth = computed(() => {
  let total = 0;
  for (let i = 1; i <= daysInMonth.value; i++) {
    total += getMyEventCount(i) + getOtherEventCount(i);
  }
  return total;
});

function getDateStr(day: number) {
  const m = String(currentMonth.value + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${currentYear.value}-${m}-${d}`;
}

function getMyEventCount(day: number) {
  const dateStr = getDateStr(day);
  return store.events.filter((e) => e.dueDate === dateStr && e.assignedTo === store.currentUserName)
    .length;
}

function getOtherEventCount(day: number) {
  const dateStr = getDateStr(day);
  return store.events.filter((e) => e.dueDate === dateStr && e.assignedTo !== store.currentUserName)
    .length;
}

function isSelected(day: number) {
  return store.selectedDate === getDateStr(day);
}

function isToday(day: number) {
  const d = new Date();
  return (
    d.getDate() === day &&
    d.getMonth() === currentMonth.value &&
    d.getFullYear() === currentYear.value
  );
}

function selectDate(day: number) {
  store.selectDate(getDateStr(day));
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}
</script>

<style scoped lang="scss">
.border-grey {
  border: 1px solid #e0e0e0;
}

.calendar-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
}

.calendar-grid {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.weekdays-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 20px;
}

.weekday-cell {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.days-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 110px;
  row-gap: 4px;
  flex: 1;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px;
  transition: background 0.2s;
  border-radius: 8px;

  &:hover {
    background: #f5f5f5;
  }
}

.day-cell--blank {
  cursor: default;
  &:hover {
    background: transparent;
  }
}

.day-cell--active {
  background: #f0f0f0; /* Slight highlight for selected day */
}

.date-number-wrapper {
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-number {
  font-size: 15px;
  color: #333;
}

.day-cell--today .date-number {
  border: 2px solid $negative; /* Red circle around today per mockup */
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 500;
  width: 92%;
  text-align: center;
  white-space: nowrap;
  line-height: 1.6;
}

.calendar-footer {
  padding: 10px 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
</style>
