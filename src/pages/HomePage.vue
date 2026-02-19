<template>
  <q-page class="q-pa-lg">
    <!-- Header Section -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold text-grey-9">ภาพรวมการสอบเทียบเครื่องมือแพทย์</div>
      <div class="text-caption text-grey-6">ภาพรวมและติดตามการสอบเทียบเครื่องมือแพทย์</div>
    </div>

    <!-- Summary Cards Row -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="stat in dashboardStore.summaryStats"
        :key="stat.id"
        class="col-12 col-sm-6 col-md-3"
      >
        <SummaryCard v-bind="stat" />
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Left Column: Urgent Work Table -->
      <div class="col-12 col-lg-8">
        <UrgentWorkTable :items="dashboardStore.urgentWork" />

        <!-- Charts Row (Below content) -->
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-4">
            <q-card
              class="shadow-1 full-height q-pa-md"
              style="border-radius: 12px; min-height: 100px"
            >
              <div class="text-subtitle2 text-weight-bold">ปริมาณงานสอบเทียบ (รายเดือน)</div>
              <!-- Placeholder Chart -->
              <div style="height: 100px" class="flex flex-center text-grey-4">Chart Area</div>
            </q-card>
          </div>
          <div class="col-12 col-md-8">
            <ResultGauge :percent="92" />
          </div>
        </div>
      </div>

      <!-- Right Column: Quick Actions & Alerts -->
      <div class="col-12 col-lg-4">
        <div class="column q-gutter-y-lg">
          <QuickActions />
          <AlertsWidget :alerts="dashboardStore.alerts" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useDashboardStore } from 'stores/dashboard';
import SummaryCard from 'components/dashboard/SummaryCard.vue';
import UrgentWorkTable from 'components/dashboard/UrgentWorkTable.vue';
import QuickActions from 'components/dashboard/QuickActions.vue';
import AlertsWidget from 'components/dashboard/AlertsWidget.vue';
import ResultGauge from 'components/dashboard/ResultGauge.vue';

const dashboardStore = useDashboardStore();
</script>
