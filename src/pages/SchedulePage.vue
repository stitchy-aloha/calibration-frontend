<template>
  <q-page padding class="bg-grey-1">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">แผนการสอบเทียบเครื่องมือแพทย์</div>
      <div class="text-caption text-grey-6 text-subtitle1">จัดการและติดตามรอบการสอบเทียบ</div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column: Calendar -->
      <div class="col-12 col-md-7 col-lg-8 flex column schedule-col">
        <ScheduleCalendar class="col-grow" />
      </div>

      <!-- Right Column: Current Date Events -->
      <div
        class="col-12 col-md-5 col-lg-4 flex column relative-position schedule-col"
      >
        <!-- Purple Rounded Header Box -->
        <div
          class="bg-secondary text-white q-pa-lg shadow-1 q-mb-md"
          style="border-radius: 12px 12px 4px 4px"
        >
          <div class="text-h6 text-weight-regular q-mb-xs">รายการสอบเทียบ</div>
          <div class="text-subtitle2 opacity-80 q-mb-md font-weight-regular">
            {{ formattedSelectedDate }}
          </div>
          <q-badge
            rounded
            color="white"
            text-color="grey-9"
            class="q-px-md q-py-xs text-weight-bold"
            style="font-size: 11px"
          >
            ทั้งหมด : {{ store.selectedDateEvents.length }} เครื่อง
          </q-badge>
        </div>

        <!-- Events List -->
        <div class="events-scroll-area flex-1">
          <template v-if="store.selectedDateEvents.length > 0">
            <ScheduleEventCard
              v-for="event in store.selectedDateEvents"
              :key="event.id"
              :event="event"
            />
          </template>
          <div
            v-else
            class="text-center text-grey-6 q-pa-xl border-dashed rounded-borders bg-white"
          >
            <q-icon name="event_busy" size="48px" class="q-mb-sm text-grey-4" />
            <div>ไม่มีแผนการสอบเทียบในวันนี้</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore } from 'src/stores/schedule';
import ScheduleCalendar from 'src/components/schedule/ScheduleCalendar.vue';
import ScheduleEventCard from 'src/components/schedule/ScheduleEventCard.vue';

const store = useScheduleStore();

const thaiMonthsFull = [
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

const thaiDaysAbbr = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

const formattedSelectedDate = computed(() => {
  const parts = (store.selectedDate || '').split('-');
  const year = parseInt(parts[0] ?? '0', 10);
  const month = parseInt(parts[1] ?? '1', 10) - 1;
  const day = parseInt(parts[2] ?? '0', 10);

  const d = new Date(year, month, day);
  const dayName = thaiDaysAbbr[d.getDay()];

  return `${dayName}, ${day} ${thaiMonthsFull[month]} ${year + 543}`;
});
</script>

<style scoped lang="scss">
.opacity-80 {
  opacity: 0.8;
}

.events-scroll-area {
  flex: 1;
  overflow-y: auto;
  /* hide scrollbar for clean look */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.border-dashed {
  border: 2px dashed #e0e0e0;
}

.schedule-col {
  min-height: 400px;
}
@media (min-width: 1024px) {
  .schedule-col {
    height: calc(100vh - 160px);
  }
}
</style>
