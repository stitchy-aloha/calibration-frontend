<script setup lang="ts">
import { computed } from 'vue';
import EquipmentDetailsCard from 'components/calibration/record/EquipmentDetailsCard.vue';
import LocationDetailsCard from 'components/calibration/record/LocationDetailsCard.vue';
import type { TaskApi } from 'src/services/pm.service';

const props = defineProps<{
  task: TaskApi | null;
}>();

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
const equipmentInfo = computed(() => {
  const eq = props.task?.equipment;
  return {
    deviceName: eq?.name || '-',
    company: eq?.manufacturer || '-',
    model: eq?.model || '-',
    serialNumber: eq?.serial_number || '-',
    assetCode: eq?.asset_code || '-',
    riskLevel: eq?.risk_level || '-',
    type: eq?.equipmentType?.name || '-',
    calibrationInterval: eq?.interval ? `${eq.interval} วัน` : '-',
    lastCalibrationDate: eq?.calibration_date_last || '-',
    dueDate: eq?.calibration_due_date || '-',
    department: eq?.section?.name || eq?.department || '-',
    location: eq?.section?.hospital?.name || eq?.location || '-',
  };
});

const locationInfo = computed(() => {
  const eq = props.task?.equipment;
  return {
    department: eq?.section?.name || eq?.department || '-',
    hospital: eq?.section?.hospital?.name || eq?.location || '-',
    district: eq?.section?.hospital?.district || '-',
    province: eq?.section?.hospital?.province || '-',
  };
});
</script>

<template>
  <div class="q-pa-md">
    <!-- Equipment Details (reuse existing component) -->
    <EquipmentDetailsCard :details="equipmentInfo" />

    <!-- Inspector Section -->
    <div class="section-title q-mb-sm q-mt-lg">ข้อมูลผู้สอบเทียบ</div>
    <q-card flat bordered class="q-pa-md q-mb-xl">
      <div class="info-grid text-body2">
        <span class="info-label">ชื่อ</span>
        <span class="info-value">{{ task?.technician?.name || '-' }}</span>

        <span class="info-label">ตำแหน่ง</span>
        <span class="info-value">
          {{ task?.technician?.role?.description || task?.technician?.role?.name || '-' }}
        </span>

        <span class="info-label">วันที่สอบเทียบ</span>
        <span class="info-value">{{ formatDate(task?.createdAt) }}</span>

        <span class="info-label">สถานะการสอบ</span>
        <span class="info-value text-positive">ผ่าน</span>
      </div>
    </q-card>

    <!-- Location Details (reuse existing component) -->
    <LocationDetailsCard :details="locationInfo" />
  </div>
</template>

<style scoped lang="scss">
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid $secondary;
  padding-left: 10px;
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
