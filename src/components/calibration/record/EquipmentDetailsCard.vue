<template>
  <div class="equipment-details-container q-mb-lg">
    <!-- Section Title with Yellow Bar -->
    <div class="section-title q-mb-md">ข้อมูลเครื่องมือแพทย์</div>

    <div class="row q-col-gutter-md">
      <!-- Left Card -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="detail-card q-pa-md h-full">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">เครื่องมือ</span>
              <span class="info-value">{{ details.deviceName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">บริษัท</span>
              <span class="info-value">{{ details.company }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">รุ่น</span>
              <span class="info-value">{{ details.model }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">หมายเลขเครื่อง</span>
              <span class="info-value">{{ details.serialNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">รหัสครุภัณฑ์</span>
              <span class="info-value">{{ details.assetCode }}</span>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Right Card -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="detail-card q-pa-md h-full">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">ความเสี่ยง</span>
              <span class="info-value">{{ riskLabel }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ประเภท</span>
              <span class="info-value">{{ details.type }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">รอบสอบเทียบ</span>
              <span class="info-value">{{ details.calibrationInterval }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">วันที่สอบเทียบล่าสุด</span>
              <span class="info-value">{{ details.lastCalibrationDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">วันกำหนดสอบเทียบ</span>
              <span class="info-value">{{ details.dueDate }}</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface EquipmentDetails {
  deviceName: string;
  company: string;
  model: string;
  serialNumber: string;
  assetCode: string;
  riskLevel: string;
  type: string;
  calibrationInterval: string;
  lastCalibrationDate: string;
  dueDate: string;
}

const props = defineProps<{
  details: EquipmentDetails;
}>();

const riskLabel = computed(() => {
  const level = props.details.riskLevel?.toLowerCase();
  if (level === 'high') return 'สูง';
  if (level === 'medium') return 'กลาง';
  if (level === 'low') return 'ต่ำ';
  return props.details.riskLevel || '-';
});
</script>

<style scoped lang="scss">
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid $secondary;
  padding-left: 12px;
  line-height: 1.2;
}

.detail-card {
  border-radius: 12px;
  border: 1px solid #d0d0d0;
  height: 100%;
}

.h-full {
  height: 100%;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: #333;
  font-weight: 500;
}

.info-value {
  color: #1a1a2e;
  font-weight: 600;
  text-align: right;
}
</style>
