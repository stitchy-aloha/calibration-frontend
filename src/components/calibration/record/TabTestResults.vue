<template>
  <div class="q-pa-md">
    <!-- Environment and Standard Equipment Cards placed horizontally if on larger screens -->
    <div class="row q-col-gutter-md items-stretch">
      <div class="col-12 col-md-4 flex">
        <EnvironmentCard class="full-width" />
      </div>
      <div class="col-12 col-md-8 flex">
        <StandardEquipmentSelector class="full-width" />
      </div>
    </div>

    <!-- Divider Bar -->
    <q-card
      flat
      class="bg-purple-2 q-py-sm q-mb-xl text-center text-white text-subtitle1 text-weight-bold"
      style="border-radius: 4px"
    >
      บันทึกผลการทดสอบ
    </q-card>

    <!-- Dynamic Detailed Tests -->
    <component
      :is="currentDeviceComponent"
      :equipment-type="store.equipmentDetails.name"
      @save="emit('save')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import EnvironmentCard from './EnvironmentCard.vue';
import StandardEquipmentSelector from './StandardEquipmentSelector.vue';

// Import Specific Forms
import TestPatientMonitor from '../forms/TestPatientMonitor.vue';
import TestInfusionPump from '../forms/TestInfusionPump.vue';
import TestUnknown from '../forms/TestUnknown.vue';

const store = useCalibrationRecordStore();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

// Map device types to their respective form components
const deviceComponentMap: Record<string, Component> = {
  'Patient Monitor': TestPatientMonitor,
  'Infusion Pump': TestInfusionPump,
  // Add other equipment types here...
};

// Compute which component to show based on the equipment name in the store
const currentDeviceComponent = computed(() => {
  const type = store.equipmentDetails.name;
  return deviceComponentMap[type] || TestUnknown;
});
</script>



<style scoped lang="scss">
.bg-purple-2 {
  background-color: $secondary !important;
}
</style>
