<script setup lang="ts">
import { computed } from 'vue';
import { useInspectionStore } from 'stores/inspection';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';
import EquipmentDetailsCard from './EquipmentDetailsCard.vue';
import LocationDetailsCard from './LocationDetailsCard.vue';

const inspection = useInspectionStore();
const calRecord = useCalibrationRecordStore();

const equipmentInfo = computed(() => ({
  deviceName: inspection.deviceInfo.deviceName,
  company: inspection.deviceInfo.company,
  model: inspection.deviceInfo.model,
  serialNumber: inspection.deviceInfo.serialNumber,
  assetCode: inspection.deviceInfo.assetCode,
  riskLevel: calRecord.equipmentDetails.riskLevel,
  type: calRecord.equipmentDetails.type,
  calibrationInterval: inspection.deviceInfo.calibrationInterval,
  lastCalibrationDate: inspection.deviceInfo.lastCalibrationDate,
  dueDate: inspection.deviceInfo.dueDate,
  department: inspection.deviceInfo.department,
  location: inspection.deviceInfo.location,
}));
</script>

<template>
  <div class="q-pa-md">
    <EquipmentDetailsCard :details="equipmentInfo" />
    <LocationDetailsCard />
  </div>
</template>
