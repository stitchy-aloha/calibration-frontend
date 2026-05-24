<script setup lang="ts">
import type { StandardTool } from '../../../stores/standardTools';

defineProps<{
  tool: StandardTool;
}>();

const emit = defineEmits<{
  (e: 'remove'): void;
}>();
</script>

<template>
  <q-card
    flat
    bordered
    class="equip-card bg-white"
    style="min-width: 220px; position: relative; height: 100%"
  >
    <!-- X button top-right -->
    <q-btn
      flat
      round
      dense
      icon="close"
      size="sm"
      color="grey-5"
      class="absolute-top-right q-ma-xs"
      style="z-index: 1"
      @click="emit('remove')"
    />

    <q-card-section class="q-pa-lg flex flex-center" style="min-height: 200px">
      <!-- Icon + tool name centered -->
      <div class="column items-center">
        <div class="icon-bg q-mb-md">
          <q-icon name="app:med" size="48px" color="secondary" />
        </div>
        <div class="text-weight-bold text-h6 text-center text-primary-dark">
          {{ tool.name }}
        </div>
        <div class="text-caption text-grey-6 q-mt-xs">Standard Tool Type</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.equip-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.icon-bg {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-primary-dark {
  color: #1a1a2e;
}

.label-text {
  color: #666;
  font-weight: 500;
  font-size: 13px;
}

.value-text {
  text-align: right;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 13px;
}
</style>
