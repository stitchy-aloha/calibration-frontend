<template>
  <q-card flat bordered class="overflow-hidden q-mb-md">
    <!-- Secondary color title bar -->
    <div class="card-header">ข้อมูลสภาวะแวดล้อม</div>

    <div class="q-pa-md">
      <!-- อุณหภูมิ -->
      <div class="q-mb-md">
        <div class="field-label q-mb-xs">อุณหภูมิ <span class="text-negative">*</span></div>
        <q-input
          v-model.number="store.environment.temperature"
          type="number"
          outlined
          bg-color="white"
        >
          <template #append>
            <span class="unit-text">°C</span>
          </template>
        </q-input>
      </div>

      <!-- ความชื้น -->
      <div>
        <div class="field-label q-mb-xs">ความชื้น <span class="text-negative">*</span></div>
        <q-input
          v-model.number="store.environment.humidity"
          type="number"
          outlined
          bg-color="white"
        >
          <template #append>
            <span class="unit-text">%Rh</span>
          </template>
        </q-input>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useCalibrationRecordStore } from 'stores/calibrationRecord';

const store = useCalibrationRecordStore();
</script>

<style scoped lang="scss">
.card-header {
  background-color: $secondary;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.unit-text {
  font-size: 13px;
  color: #888;
}
</style>
