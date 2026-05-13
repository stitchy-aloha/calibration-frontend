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
  <q-card flat bordered class="equip-card bg-white" style="min-width: 220px; position: relative">
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

    <q-card-section class="q-pa-md">
      <!-- Icon + tool name centered -->
      <div class="column items-center q-mb-sm">
        <q-icon name="app:med" size="42px" color="secondary" class="q-mb-xs" />
        <div class="text-weight-bold text-subtitle1 text-center">
          {{ tool.name }}
        </div>
      </div>

      <!-- Info rows -->
      <div class="info-grid">
        <span class="label-text">รุ่น</span>
        <span class="value-text">{{ tool.model || '-' }}</span>

        <span class="label-text">บริษัท</span>
        <span class="value-text">{{ tool.manufacturer || '-' }}</span>

        <span class="label-text">หมายเลขประจำเครื่อง</span>
        <span class="value-text">{{ tool.serialNumber || '-' }}</span>

        <span class="label-text">หน่วยวัด</span>
        <span class="value-text">{{ tool.unit || '-' }}</span>

        <span class="label-text">วันที่สอบเทียบ</span>
        <span class="value-text">{{ tool.lastCalibrationDate || '-' }}</span>

        <span class="label-text">หมายเลขใบรับรอง</span>
        <span class="value-text">{{ tool.certificateNumber || '-' }}</span>
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

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
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
