<template>
  <q-page padding class="bg-grey-1">
    <!-- Header Area -->
    <div class="q-mb-md">
      <div class="text-h6 text-weight-bold row items-center">ติดตามเครื่องมือแพทย์ตามแผนก</div>
      <div class="text-caption text-grey-6">
        ตรวจสอบตำแหน่งและกำหนดการสอบเทียบเครื่องมือแพทย์แยกตามแผนก
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column (Wards, Calendar, Timeline) -->
      <div class="col-12 col-md-5 col-lg-4 column q-gutter-y-lg">
        <!-- Wards List -->
        <WardDepartmentList />

        <!-- Below Wards: Calendar & Timeline row -->
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <WardScheduleCalendar />
          </div>
          <div class="col-6">
            <WardTimeline />
          </div>
        </div>
      </div>

      <!-- Right Column (Ward Tools) -->
      <div class="col-12 col-md-7 col-lg-8 column">
        <!-- Selected Ward Title -->
        <div class="text-subtitle1 text-weight-bold text-right q-mb-md">
          {{ store.selectedWard?.name || 'Loading...' }}
        </div>

        <!-- Tool Cards List -->
        <div class="column q-gutter-y-sm">
          <WardToolCard v-for="tool in store.tools" :key="tool.id" :tool="tool" />
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
/* Add any specific page-level overrides here */
</style>
