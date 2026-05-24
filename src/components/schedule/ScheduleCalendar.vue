<template>
  <div class="calendar-container bg-white rounded-borders border-grey overflow-hidden shadow-1">
    <!-- Header -->
    <div class="calendar-header row items-center q-px-md q-py-sm">
      <q-btn flat round dense icon="chevron_left" color="grey-8" @click="prevMonth" />
      <div class="text-subtitle1 text-weight-bold q-mx-sm">{{ monthYearString }}</div>
      <q-btn flat round dense icon="chevron_right" color="grey-8" @click="nextMonth" />
      <q-space />
      <div class="text-grey-6 text-caption hide-on-mobile">
        แสดง {{ totalEventsInMonth }} รายการ
      </div>
    </div>

    <q-separator />

    <!-- Unified Grid System -->
    <div class="calendar-main column">
      <div class="calendar-grid">
        <!-- Weekdays Row -->
        <div
          v-for="day in ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']"
          :key="day"
          class="weekday-cell text-center text-weight-medium text-grey-7 q-py-sm"
        >
          {{ day }}
        </div>

        <!-- Blank Days -->
        <div v-for="i in blankDays" :key="'blank-' + i" class="day-cell day-cell--blank"></div>

        <!-- Actual Days -->
        <div
          v-for="date in daysInMonth"
          :key="date"
          class="day-cell cursor-pointer relative-position"
          :class="{
            'day-cell--active': isSelected(date),
            'day-cell--today': isToday(date),
          }"
          @click="selectDate(date)"
        >
          <div class="day-content column items-center full-width">
            <div
              class="date-number"
              :class="{
                'today-ring': isToday(date),
                'text-primary text-weight-bolder': isSelected(date),
              }"
            >
              {{ date }}
            </div>

            <div
              class="calendar-badges column items-center q-gutter-y-xs full-width q-px-xs q-mt-xs"
            >
              <div v-if="getOtherEventCount(date) > 0" class="date-badge badge-other">
                {{ getOtherEventCount(date) }} เครื่อง
              </div>
              <div v-if="getMyEventCount(date) > 0" class="date-badge badge-mine">
                {{ getMyEventCount(date) }} เครื่อง
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Footer Legend -->
    <div
      class="calendar-footer row items-center q-px-md q-py-sm q-gutter-x-md no-wrap overflow-hidden"
    >
      <div class="legend-item flex items-center no-wrap">
        <div class="legend-dot bg-grey-4 q-mr-xs"></div>
        <span class="text-caption text-grey-8 no-wrap">งานทั้งหมด</span>
      </div>
      <div class="legend-item flex items-center no-wrap">
        <div class="legend-dot bg-secondary q-mr-xs"></div>
        <span class="text-caption text-grey-8 no-wrap">งานของฉัน</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useScheduleStore } from 'src/stores/schedule';

const store = useScheduleStore();

const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth());

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

const monthYearString = computed(
  () => `${thaiMonths[currentMonth.value]} ${currentYear.value + 543}`,
);

const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate(),
);
const blankDays = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

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
.calendar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  min-height: 56px;
}

.calendar-main {
  flex: 1;
  background: white;
  padding: 8px 12px;
  overflow-y: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  border-top: 1px solid #f1f5f9;
  border-left: 1px solid #f1f5f9;
}

.weekday-cell {
  font-size: 13px;
  color: #64748b;
  border-bottom: 2px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  background: #f8fafc;
}

.day-cell {
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  min-height: 100px;
  padding: 8px 4px;
  transition: background 0.2s ease;

  &:hover:not(.day-cell--blank) {
    background: #f1f5f9;
  }
}

.day-cell--active {
  background: #f0f7ff;
  box-shadow: inset 0 0 0 1px $primary;
}

.day-cell--today {
  background: #fffcf0;
}

.day-content {
  height: 100%;
}

.date-number {
  font-size: 14px;
  color: #1e293b;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.today-ring {
  background: $negative;
  color: white !important;
  border-radius: 50%;
  font-weight: bold;
}

.date-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 999px;
  width: 100%;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.badge-other {
  background: #e2e8f0;
  color: #475569;
}

.badge-mine {
  background: $secondary;
  color: white;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Responsive Scaling */
@media (max-width: 1023px) {
  .day-cell {
    min-height: 80px;
  }
  .calendar-main {
    padding: 4px;
  }
}

@media (max-width: 599px) {
  .hide-on-mobile {
    display: none;
  }
  .day-cell {
    min-height: 60px;
    padding: 4px 2px;
  }
  .date-number {
    font-size: 12px;
    width: 22px;
    height: 22px;
  }
  .date-badge {
    font-size: 9px;
    padding: 1px 4px;
  }
}
</style>
