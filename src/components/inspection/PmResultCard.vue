<template>
  <q-card flat bordered class="pm-result-card">
    <q-card-section class="q-pa-md">
      <div class="result-header">
        <span class="result-title">PM Result</span>
        <q-badge :class="['result-badge', resultClass]" :label="result" />
      </div>

      <q-separator class="q-my-sm" />

      <div class="result-info">
        <div class="result-row">
          <span class="result-label">PM By</span>
          <span class="result-value">{{ pmBy }}</span>
        </div>
        <div class="result-row">
          <span class="result-label">ตำแหน่ง</span>
          <span class="result-value">{{ position }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  result: 'ผ่าน' | 'ไม่ผ่าน' | 'N/A';
  pmBy: string;
  position: string;
}>();

const resultClass = computed(() => {
  switch (props.result) {
    case 'ผ่าน':
      return 'result-badge--pass';
    case 'ไม่ผ่าน':
      return 'result-badge--fail';
    default:
      return 'result-badge--na';
  }
});
</script>

<style scoped lang="scss">
.pm-result-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 8px 4px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.result-badge {
  font-size: 15px;
  font-weight: 700;
  padding: 8px 32px;
  border-radius: 6px;
}

.result-badge--pass {
  background: $positive !important;
  color: #000 !important;
}

.result-badge--fail {
  background: $negative !important;
  color: #000 !important;
}

.result-badge--na {
  background: $surface !important;
  color: #000 !important;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  font-size: 14.5px;
}

.result-label {
  color: #888;
  font-weight: 500;
}

.result-value {
  font-weight: 600;
  color: #1a1a2e;
}
</style>
