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

    <TestDynamic v-if="hasSettings" @save="emit('save')" />
    <TestUnknown v-else :equipment-type="store.equipmentDetails.name" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import EnvironmentCard from './EnvironmentCard.vue';
import StandardEquipmentSelector from './StandardEquipmentSelector.vue';
import TestUnknown from '../forms/TestUnknown.vue';
import TestDynamic from '../forms/TestDynamic.vue';
import { useCalibrationSettingStore } from 'src/stores/calibrationSetting';

const store = useCalibrationRecordStore();
const settingStore = useCalibrationSettingStore();

const hasSettings = computed(() => settingStore.settings.length > 0);

const emit = defineEmits<{
  (e: 'save'): void;
}>();
</script>

<style scoped lang="scss">
.bg-purple-2 {
  background-color: $secondary !important;
}
</style>
