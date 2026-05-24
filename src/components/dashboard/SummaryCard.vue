<template>
  <q-card class="shadow-1 summary-card full-height">
    <q-card-section class="q-pa-md">
      <div class="row items-start justify-between">
        <div>
          <div class="text-caption text-grey-7 q-mb-xs">{{ title }}</div>
          <div class="text-h4 text-weight-bold q-mb-sm">{{ count }}</div>
          <div class="row items-center">
            <q-icon
              v-if="status === 'urgent'"
              name="warning"
              color="red"
              size="xs"
              class="q-mr-xs"
            />
            <q-icon
              v-else-if="status === 'normal' && isPositiveTrend"
              name="trending_up"
              :color="trendColor.split('-')[0]"
              size="xs"
              class="q-mr-xs"
            />
            <q-icon
              v-else-if="status === 'warning'"
              name="schedule"
              :color="trendColor.split('-')[0]"
              size="xs"
              class="q-mr-xs"
            />

            <div :class="`text-caption text-weight-medium text-${trendColor}`">
              {{ trend }}
            </div>
          </div>
        </div>
        <div :class="`icon-box bg-${iconColor} text-${iconTextColor} row flex-center`">
          <q-icon :name="icon" size="24px" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  count: number;
  trend: string;
  trendColor: string;
  icon: string;
  iconColor: string;
  iconTextColor: string;
  status: string;
}>();

const isPositiveTrend = computed(() => {
  return props.trend.includes('+');
});
</script>

<style scoped>
.summary-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}
</style>
