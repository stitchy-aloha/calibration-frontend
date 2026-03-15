<script setup lang="ts">
import EquipmentDetailsCard from 'components/calibration/record/EquipmentDetailsCard.vue';
import LocationDetailsCard from 'components/calibration/record/LocationDetailsCard.vue';
import type { TaskApi } from 'src/services/pm.service';

defineProps<{
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
</script>

<template>
  <div class="q-pa-md">
    <!-- Equipment Details (reuse existing component) -->
    <EquipmentDetailsCard />

    <!-- Inspector Section -->
    <div class="section-title q-mb-sm q-mt-lg">ข้อมูลผู้สอบเทียบ</div>
    <q-card flat bordered class="q-pa-md q-mb-xl">
      <div class="info-grid text-body2">
        <span class="info-label">ชื่อ</span>
        <span class="info-value">{{ task?.technician?.name || '-' }}</span>

        <span class="info-label">ตำแหน่ง</span>
        <span class="info-value">{{ task?.technician?.position || '-' }}</span>

        <span class="info-label">วันที่สอบเทียบ</span>
        <span class="info-value">{{ formatDate(task?.createdAt) }}</span>

        <span class="info-label">สถานะการสอบ</span>
        <span class="info-value text-positive">ผ่าน</span>
      </div>
    </q-card>

    <!-- Location Details (reuse existing component) -->
    <LocationDetailsCard />
  </div>
</template>

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
