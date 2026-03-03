<template>
  <!-- Title outside the card -->
  <div class="section-title q-mb-sm">ข้อมูลสถานที่</div>

  <q-card flat bordered class="q-pa-md q-mb-md">
    <div class="info-grid text-body2">
      <span class="info-label">หน่วยงาน</span>
      <span class="info-value">{{ inspection.deviceInfo.department || '-' }}</span>

      <span class="info-label">โรงพยาบาล</span>
      <span class="info-value">{{ calRecord.locationDetails.hospital || '-' }}</span>

      <span class="info-label">อำเภอ</span>
      <span class="info-value">{{ calRecord.locationDetails.district || '-' }}</span>

      <span class="info-label">จังหวัด</span>
      <span class="info-value">{{ calRecord.locationDetails.province || '-' }}</span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useInspectionStore } from 'stores/inspection';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';

const inspection = useInspectionStore();
const calRecord = useCalibrationRecordStore();
</script>

<style scoped lang="scss">
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid #f4c242;
  padding-left: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px 32px;
}

.info-label {
  color: #666;
  font-weight: 500;
  font-size: 14px;
}

.info-value {
  text-align: right;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 14px;
}
</style>
