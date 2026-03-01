<template>
  <div class="device-info-row">
    <!-- Left Card -->
    <q-card flat bordered class="device-card">
      <q-card-section class="q-pa-md">
        <div class="info-grid">
          <span class="info-label">เครื่องมือ</span>
          <span class="info-value">{{ info.deviceName }}</span>
          <span class="info-label">บริษัท</span>
          <span class="info-value">{{ info.company }}</span>
          <span class="info-label">รุ่น</span>
          <span class="info-value">{{ info.model }}</span>
          <span class="info-label">หมายเลขเครื่อง</span>
          <span class="info-value">{{ info.serialNumber }}</span>
          <span class="info-label">รหัสครุภัณฑ์</span>
          <span class="info-value">{{ info.assetCode }}</span>
        </div>
      </q-card-section>
    </q-card>

    <!-- Right Card -->
    <q-card flat bordered class="device-card">
      <q-card-section class="q-pa-md">
        <div class="info-grid">
          <span class="info-label">Category</span>
          <span class="info-value">{{ info.category }}</span>
          <span class="info-label">Department</span>
          <span class="info-value">{{ info.department }}</span>
          <span class="info-label">Location</span>
          <span class="info-value">{{ info.location }}</span>
          <span class="info-label">Calibration Interval</span>
          <span class="info-value">{{ info.calibrationInterval }}</span>
          <span class="info-label">Last Calibration Date</span>
          <span class="info-value">{{ info.lastCalibrationDate }}</span>
          <span class="info-label">Due Date</span>
          <span class="info-value">{{ info.dueDate }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import type { DeviceInfo } from 'src/stores/inspection';

defineProps<{ info: DeviceInfo }>();
</script>

<style scoped lang="scss">
.device-info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.device-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 24px;
  font-size: 15px;
}

.info-label {
  color: #555;
  font-weight: 500;
}

.info-value {
  text-align: right;
  font-weight: 600;
  color: #1a1a2e;
}
</style>
