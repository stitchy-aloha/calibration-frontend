<template>
  <q-page class="bg-grey-1 relative-position">
    <div class="ward-page-container">
      <!-- Header Area -->
      <div class="ward-page__header">
        <div class="text-h6 text-weight-bold row items-center">ติดตามเครื่องมือแพทย์ตามแผนก</div>
        <div class="text-caption text-grey-6">
          ตรวจสอบตำแหน่งและกำหนดการสอบเทียบเครื่องมือแพทย์แยกตามแผนก
        </div>
      </div>

      <div class="ward-page__body">
        <!-- Left Column (Wards, Calendar, Timeline) -->
        <div class="ward-page__left">
          <!-- Wards List -->
          <div class="ward-page__wards">
            <WardDepartmentList />
          </div>

          <!-- Below Wards: Calendar & Timeline side-by-side -->
          <div class="ward-page__cal-timeline">
            <div class="ward-page__calendar">
              <WardScheduleCalendar />
            </div>
            <div class="ward-page__timeline">
              <WardTimeline />
            </div>
          </div>
        </div>

        <!-- Right Column (Ward Tools) -->
        <div class="ward-page__right">
          <!-- Selected Ward Title -->
          <div class="text-subtitle1 text-weight-bold text-right q-mb-sm">
            {{ store.selectedWard?.name || 'Loading...' }}
          </div>

          <!-- Tool Cards List (scrollable) -->
          <div class="ward-page__tools">
            <div class="column q-gutter-y-sm">
              <WardToolCard v-for="tool in store.tools" :key="tool.id" :tool="tool" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useWardsStore } from 'src/stores/wards';
import WardDepartmentList from 'src/components/ward/WardDepartmentList.vue';
import WardScheduleCalendar from 'src/components/ward/WardScheduleCalendar.vue';
import WardTimeline from 'src/components/ward/WardTimeline.vue';
import WardToolCard from 'src/components/ward/WardToolCard.vue';

const store = useWardsStore();
</script>

<style scoped lang="scss">
.ward-page-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 24px;
}

.ward-page__header {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.ward-page__body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  min-height: 0; /* critical: allows children to shrink */
  overflow: hidden;
}

/* ── Left Column ── */
.ward-page__left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;
}

.ward-page__wards {
  flex-shrink: 0;
}

.ward-page__cal-timeline {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

.ward-page__calendar {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ward-page__timeline {
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
}

/* ── Right Column ── */
.ward-page__right {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.ward-page__tools {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
}

@media (max-width: 960px) {
  .ward-page__body {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}
</style>
