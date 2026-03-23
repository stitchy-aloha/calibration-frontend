<template>
  <q-card class="schedule-card bg-white" flat bordered>
    <q-card-section class="q-pa-lg">
      <div class="row items-start justify-between q-mb-md">
        <div>
          <div
            class="text-subtitle1 text-weight-bold text-grey-10 q-mb-xs"
            style="line-height: 1.2"
          >
            {{ event.toolName }}
          </div>
          <div class="text-caption text-grey-5">{{ event.toolCode }}</div>
        </div>
        <!-- Light green badge for positive status -->
        <q-badge
          rounded
          style="background-color: #b9f6ca; color: #2e7d32"
          class="q-px-md q-py-xs text-weight-bold font-size-12"
        >
          ตรงตามรอบ
        </q-badge>
      </div>

      <div class="row q-col-gutter-y-sm text-grey-10 font-size-13 q-mb-lg">
        <div class="col-12 col-sm-6 flex items-center gap-sm no-wrap">
          <q-icon name="location_on" size="18px" class="q-mr-xs text-grey-9 flex-shrink-0" />
          <span class="ellipsis">{{ event.location }}</span>
        </div>
        <div class="col-12 col-sm-6 flex items-center gap-sm no-wrap">
          <q-icon name="person" size="18px" class="q-mr-xs text-grey-9 flex-shrink-0" />
          <span class="ellipsis">{{ event.assignedTo }}</span>
        </div>
        <div class="col-12 col-sm-6 flex items-center gap-sm no-wrap">
          <q-icon name="sync" size="18px" class="q-mr-xs text-grey-9 flex-shrink-0" />
          <span class="ellipsis">{{ event.frequency }}</span>
        </div>
        <div class="col-12 col-sm-6 flex items-center gap-sm no-wrap">
          <q-icon name="alarm" size="18px" class="q-mr-xs text-grey-9 flex-shrink-0" />
          <span class="ellipsis">ครั้งล่าสุด: {{ lastCalDateFormatted }}</span>
        </div>
      </div>

      <!-- Actions footer -->
      <div class="row q-gutter-x-lg text-primary text-weight-medium font-size-13">
        <div class="cursor-pointer hover-text-blue text-blue-8" @click="goToCalibration">
          ดูรายละเอียดเครื่อง
        </div>
        <div class="cursor-pointer hover-text-blue text-blue-8" @click="goToHistory">
          ดูประวัติการสอบเทียบ
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { CalibrationEvent } from 'src/types';

const props = defineProps<{
  event: CalibrationEvent;
}>();

const router = useRouter();
// const store = useScheduleStore();

// const isMyJob = computed(() => {
//   return props.event.assignedTo === store.currentUserName;
// });

// Since we mock the due date, we can assume last cal date was 6 months ago loosely
const lastCalDateFormatted = computed(() => {
  // Let's just create a formatted string for display
  const spl = (props.event.dueDate || '').split('-');
  const year = parseInt(spl[0] ?? '0', 10);
  const month = parseInt(spl[1] ?? '0', 10);
  const day = spl[2] ?? '0';

  // Minus 6 months
  const lastCalDate = new Date(year, month - 1 - 6, parseInt(day, 10));

  const thaiMonthsAbbr = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  return `${lastCalDate.getDate()} ${thaiMonthsAbbr[lastCalDate.getMonth()]} ${lastCalDate.getFullYear() + 543}`;
});

async function goToCalibration() {
  await router.push('/calibration');
}

async function goToHistory() {
  // Assuming calibration page has a history tab or we go to history
  await router.push('/calibration'); // Map to appropriate route as specified
}
</script>

<style scoped lang="scss">
.schedule-card {
  border-radius: 12px;
  border-color: #f0f0f0;
}

.font-size-12 {
  font-size: 12px;
}

.font-size-13 {
  font-size: 13px;
}

.hover-text-blue:hover {
  text-decoration: underline;
}

.gap-sm {
  gap: 8px;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
