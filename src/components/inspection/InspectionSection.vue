<template>
  <q-card flat bordered class="inspection-section">
    <q-card-section class="section-header q-py-sm q-px-md">
      <span class="section-title">{{ title }}</span>
    </q-card-section>

    <q-card-section class="q-pa-md q-pt-sm">
      <div class="inspection-list">
        <div v-for="(item, idx) in items" :key="idx" class="inspection-row">
          <span class="inspection-label">{{ item.label }}</span>
          <div class="inspection-buttons">
            <q-btn
              dense
              unelevated
              no-caps
              label="ผ่าน"
              :class="[
                'ins-btn',
                item.value === 'ผ่าน' ? 'ins-btn--pass-active' : 'ins-btn--default',
              ]"
              @click="$emit('update', idx, 'ผ่าน')"
            />
            <q-btn
              dense
              unelevated
              no-caps
              label="ไม่ผ่าน"
              :class="[
                'ins-btn',
                item.value === 'ไม่ผ่าน' ? 'ins-btn--fail-active' : 'ins-btn--default',
              ]"
              @click="$emit('update', idx, 'ไม่ผ่าน')"
            />
            <q-btn
              dense
              unelevated
              no-caps
              label="N/A"
              :class="['ins-btn', item.value === 'N/A' ? 'ins-btn--na-active' : 'ins-btn--default']"
              @click="$emit('update', idx, 'N/A')"
            />
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div class="remarks-section q-mt-md">
        <div class="remarks-label">หมายเหตุ</div>
        <q-input
          type="textarea"
          outlined
          dense
          :model-value="remarks"
          @update:model-value="$emit('update:remarks', String($event))"
          rows="3"
          class="remarks-input"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { InspectionItem, InspectionValue } from 'src/stores/inspection';

defineProps<{
  title: string;
  items: InspectionItem[];
  remarks: string;
}>();

defineEmits<{
  update: [index: number, value: InspectionValue];
  'update:remarks': [value: string];
}>();
</script>

<style scoped lang="scss">
.inspection-section {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.section-header {
  background: $secondary;
  border-bottom: 2px solid $secondary;
}

.section-title {
  font-weight: 700;
  font-size: 16px;
  color: white;
}

.inspection-list {
  display: flex;
  flex-direction: column;
}

.inspection-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: none;
  }
}

.inspection-label {
  font-size: 14px;
  color: #333;
  min-width: 140px;
  flex: 1;
}

.inspection-buttons {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
}

.ins-btn {
  font-size: 12.5px !important;
  min-width: 58px;
  min-height: 28px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0;
  border: 1px solid #d9d9d9;
}

.ins-btn--default {
  background: #f5f5f5 !important;
  color: #888 !important;
  border-color: #d9d9d9;
}

.ins-btn--pass-active {
  background: $positive !important;
  color: #000 !important;
  border-color: $positive !important;
}

.ins-btn--fail-active {
  background: #ff4444 !important;
  color: #000 !important;
  border-color: #ff4444 !important;
}

.ins-btn--na-active {
  background: #bdbdbd !important;
  color: #000 !important;
  border-color: #bdbdbd !important;
}

.remarks-section {
  .remarks-label {
    font-size: 15px;
    font-weight: 600;
    color: #555;
    margin-bottom: 6px;
  }
}
</style>
