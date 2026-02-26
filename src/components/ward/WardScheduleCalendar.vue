<template>
  <div class="calendar-card">
    <!-- Header -->
    <div class="calendar-header">
      <div class="text-subtitle1 text-weight-medium text-grey-9">Schedule</div>
      <div class="text-caption text-grey-8 text-weight-medium">{{ monthName }}</div>
    </div>

    <q-separator />

    <!-- Calendar Body -->
    <div class="calendar-body">
      <!-- Weekdays -->
      <div class="weekdays">
        <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="weekday-cell">
          {{ day }}
        </div>
      </div>

      <!-- Days Grid -->
      <div class="days-grid">
        <!-- Empty slots for previous month -->
        <div v-for="i in startingDay" :key="'empty-' + i" class="day-cell"></div>

        <!-- Days 1 to end of month -->
        <div v-for="date in daysInMonth" :key="date" class="day-cell">
          <span
            class="day-number"
            :class="{ 'text-primary text-weight-bold': date === now.getDate() }"
          >
            {{ date }}
          </span>
          <div v-if="hasEvent(date)" class="event-dot"></div>
        </div>
      </div>
    </div>

    <div class="calendar-footer">
      <div class="event-legend-dot"></div>
      <span class="text-caption text-grey-7">กำหนดสอบเทียบ</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWardsStore } from 'src/stores/wards';

const store = useWardsStore();

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// Month name (e.g., 'Feb 2026')
const monthName = computed(() => {
  const date = new Date(currentYear, currentMonth);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
});

// Calculate number of days in the month
const daysInMonth = computed(() => {
  return new Date(currentYear, currentMonth + 1, 0).getDate();
});

// Calculate what weekday the month starts on (0=Sun, 1=Mon, ..., 6=Sat)
// We need this for the empty slots before day 1
const startingDay = computed(() => {
  return new Date(currentYear, currentMonth, 1).getDay();
});

// Get unique dates that have events
const eventDates = computed(() => {
  const dates = store.timelineEvents.map((e) => e.date);
  return new Set(dates);
});

function hasEvent(date: number) {
  return eventDates.value.has(date);
}
</script>

<style scoped lang="scss">
.calendar-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.calendar-body {
  padding: 16px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
}

.weekday-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #757575;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 16px;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  position: relative;
}

.day-number {
  font-size: 13px;
  color: #424242;
  font-weight: 500;
}

.event-dot {
  width: 5px;
  height: 5px;
  background-color: #757575;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
}

.calendar-footer {
  padding: 0 20px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-legend-dot {
  width: 5px;
  height: 5px;
  background-color: #757575;
  border-radius: 50%;
}
</style>
