<template>
  <q-card class="shadow-1 alerts-card full-height">
    <q-card-section class="row items-center justify-between q-pb-sm">
      <div class="text-subtitle1 text-weight-bold text-grey-9">การแจ้งเตือน (Alerts)</div>
      <q-badge color="red-1" text-color="red" label="2 ใหม่" class="text-weight-bold" />
    </q-card-section>

    <q-card-section class="q-pt-none q-px-sm">
      <q-list separator>
        <q-item v-for="alert in alerts" :key="alert.id" class="q-py-md">
          <q-item-section avatar top>
            <q-icon v-if="alert.type === 'error'" name="error" color="red" size="sm" />
            <q-icon
              v-else-if="alert.type === 'info'"
              name="add_circle"
              color="deep-purple"
              size="sm"
            />
            <q-icon v-else-if="alert.type === 'warning'" name="warning" color="orange" size="sm" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold text-grey-9 q-mb-xs">{{
              alert.title
            }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ alert.description }}</q-item-label>

            <div class="q-mt-sm" v-if="alert.time === 'ดูรายละเอียด'">
              <q-btn
                unelevated
                color="red-1"
                text-color="red-9"
                label="ดูรายละเอียด"
                size="xs"
                class="text-weight-bold"
                dense
                padding="xs md"
              />
            </div>
            <q-item-label v-else caption class="text-grey-5 q-mt-xs">{{ alert.time }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
export interface Alert {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'error' | 'info' | 'warning';
}

defineProps<{
  alerts: Alert[];
}>();
</script>

<style scoped>
.alerts-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
</style>
