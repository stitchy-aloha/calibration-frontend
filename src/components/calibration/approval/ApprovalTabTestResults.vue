<template>
  <div class="q-pa-md">
    <!-- Environment and Standard Equipment Cards -->
    <div class="row q-col-gutter-md items-stretch q-mb-md">
      <div class="col-12 col-md-4 flex">
        <EnvironmentCard class="full-width" :readonly="true" :env-data="envData" />
      </div>
      <div class="col-12 col-md-8 flex">
        <StandardEquipmentSelector
          class="full-width"
          :readonly="true"
          :selected-ids="standardToolIds"
        />
      </div>
    </div>

    <!-- Section Divider Bar -->
    <q-card
      flat
      class="section-bar q-py-sm q-mb-xl text-center text-white text-subtitle1 text-weight-bold"
      style="border-radius: 4px"
    >
      ข้อมูลผลการทดสอบ
    </q-card>

    <!-- EKG Results (read-only) using existing EkgTestCard component -->
    <EkgTestCard :ekg-items="ekgItems" :readonly="true" />

    <!-- Parameter Tables (read-only) -->
    <ApprovalParameterTable title="Systolic Pressure" :rows="systolicData" :show-range="true" />

    <ApprovalParameterTable title="Diastolic Pressure" :rows="diastolicData" :show-range="true" />

    <ApprovalParameterTable title="Temp" :rows="tempData" :show-range="false" />

    <ApprovalParameterTable title="Heart Rate" :rows="heartRateData" :show-range="false" />

    <ApprovalParameterTable title="Spo2" :rows="spo2Data" :show-range="false" />

    <!-- Calibration Summary Component (reused from record) -->
    <CalibrationSummary
      :ekg-items="ekgItems"
      :systolic-data="systolicData"
      :diastolic-data="diastolicData"
      :temp-data="tempData"
      :heart-rate-data="heartRateData"
      :spo2-data="spo2Data"
      :inspector-name="task?.technician?.name || '-'"
      :inspector-role="task?.technician?.position || '-'"
      @save="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EnvironmentCard from 'components/calibration/record/EnvironmentCard.vue';
import StandardEquipmentSelector from 'components/calibration/record/StandardEquipmentSelector.vue';
import EkgTestCard from 'components/calibration/record/EkgTestCard.vue';
import CalibrationSummary from 'components/calibration/record/CalibrationSummary.vue';
import ApprovalParameterTable from './ApprovalParameterTable.vue';
import type { TaskApi } from 'src/services/pm.service';

interface EkgItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | null;
}

interface TestRow {
  range: string;
  standard: number | null;
  val1: number | null;
  val2: number | null;
  val3: number | null;
  average: number | null;
  error: number | null;
  status: 'pass' | 'fail' | null;
}

const props = defineProps<{
  task: TaskApi | null;
}>();

// Helper to map DB measurements to UI rows
const mapMeasurements = (name: string): TestRow[] => {
  const items = props.task?.measurements?.filter((m) => m.parameter_name === name) || [];
  return items.map((m) => ({
    range: m.range ? String(m.range) : '',
    standard: m.standard_value,
    val1: m.reading_1,
    val2: m.reading_2,
    val3: m.reading_3,
    average: m.average_value,
    error: m.error_value,
    status: m.result.toLowerCase() as 'pass' | 'fail',
  }));
};

const ekgItems = computed<EkgItem[]>(() => {
  return (props.task?.qualitatives || [])
    .filter((q) => q.parameter_name === 'EKG')
    .map((q) => ({
      id: q.item_name,
      label: q.item_name,
      status: q.result.toLowerCase() as 'pass' | 'fail',
    }));
});

const systolicData = computed(() => mapMeasurements('Systolic Pressure'));
const diastolicData = computed(() => mapMeasurements('Diastolic Pressure'));
const tempData = computed(() => mapMeasurements('Temperature'));
const heartRateData = computed(() => mapMeasurements('Heart Rate'));
const spo2Data = computed(() => mapMeasurements('SpO2'));

const envData = computed(() => {
  const env = props.task?.environments?.[0];
  return {
    temperature: env?.ambient_temp,
    humidity: env?.ambient_humidity,
  };
});

const standardToolIds = computed(() => {
  return props.task?.standardTools?.map((t) => t.id) || [];
});
</script>

<style scoped lang="scss">
.section-bar {
  background-color: $secondary !important;
}
</style>
