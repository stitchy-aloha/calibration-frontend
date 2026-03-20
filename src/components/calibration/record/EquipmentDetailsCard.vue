<template>
  <!-- Title outside the card -->
  <div class="section-title q-mb-sm">ข้อมูลเครื่องมือแพทย์</div>

  <!-- Two-card layout same as DeviceInfoCard on ExternalInspectionPage -->
  <div class="device-info-row q-mb-md">
    <!-- Left Card -->
    <q-card flat bordered class="device-card">
      <q-card-section class="q-pa-md">
        <div class="info-grid">
          <span class="info-label">เครื่องมือ</span>
          <span class="info-value">{{ inspection.deviceInfo.deviceName || '-' }}</span>
          <span class="info-label">บริษัท</span>
          <span class="info-value">{{ inspection.deviceInfo.company || '-' }}</span>
          <span class="info-label">รุ่น</span>
          <span class="info-value">{{ inspection.deviceInfo.model || '-' }}</span>
          <span class="info-label">หมายเลขเครื่อง</span>
          <span class="info-value">{{ inspection.deviceInfo.serialNumber || '-' }}</span>
          <span class="info-label">รหัสครุภัณฑ์</span>
          <span class="info-value">{{ inspection.deviceInfo.assetCode || '-' }}</span>
        </div>
      </q-card-section>
    </q-card>

    <!-- Right Card -->
    <q-card flat bordered class="device-card">
      <q-card-section class="q-pa-md">
        <div class="info-grid">
          <span class="info-label">ความเสี่ยง</span>
          <span class="info-value">{{ calRecord.equipmentDetails.riskLevel || '-' }}</span>
          <span class="info-label">ประเภท</span>
          <span class="info-value">{{ calRecord.equipmentDetails.type || '-' }}</span>
          <span class="info-label">รอบการสอบเทียบ</span>
          <span class="info-value">{{ inspection.deviceInfo.calibrationInterval || '-' }}</span>
          <span class="info-label">วันที่สอบเทียบครั้งล่าสุด</span>
          <span class="info-value">{{ inspection.deviceInfo.lastCalibrationDate || '-' }}</span>
          <span class="info-label">กำหนดวันสอบเทียบ</span>
          <span class="info-value">{{ inspection.deviceInfo.dueDate || '-' }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
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
  font-size: 14px;
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
