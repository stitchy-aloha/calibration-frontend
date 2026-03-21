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

    <!-- Infusion Pump Results -->
    <template v-if="isInfusionPump">
      <!-- Occlusion Alarm Section -->
      <q-card flat bordered class="q-pa-md q-mb-md">
        <div class="text-subtitle1 text-weight-bold q-mb-sm">1. Occlusion Alarm Test</div>
        <div class="row q-col-gutter-md text-center">
          <div class="col-6">
            <div class="text-grey-7 q-mb-xs">Result</div>
            <div
              class="text-h6 text-weight-bold"
              :class="
                occlusionResult === 'PASS'
                  ? 'text-positive'
                  : occlusionResult === 'FAIL'
                    ? 'text-negative'
                    : ''
              "
            >
              {{
                occlusionResult === 'PASS' ? 'ผ่าน' : occlusionResult === 'FAIL' ? 'ไม่ผ่าน' : '-'
              }}
            </div>
          </div>
          <div class="col-6">
            <div class="text-grey-7 q-mb-xs">Value (psi)</div>
            <div class="text-h6 text-weight-bold">{{ occlusionValue }}</div>
          </div>
        </div>
      </q-card>

      <ApprovalParameterTable
        title="Flow Rate Test"
        :rows="flowRateData"
        :show-range="false"
        :display-type="getMetadata('Flow Rate').displayType"
        :resolution="getMetadata('Flow Rate').resolution"
      />

      <ApprovalParameterTable
        title="Volume Test"
        :rows="volumeData"
        :show-range="false"
        :display-type="getMetadata('Volume').displayType"
        :resolution="getMetadata('Volume').resolution"
      />
    </template>

    <!-- Patient Monitor Results (Default Example) -->
    <template v-else>
      <!-- EKG Results (read-only) using existing EkgTestCard component -->
      <EkgTestCard :ekg-items="ekgItems" :readonly="true" />

      <!-- Parameter Tables (read-only) -->
      <ApprovalParameterTable
        title="Systolic Pressure"
        :rows="systolicData"
        :show-range="true"
        :display-type="getMetadata('Systolic Pressure').displayType"
        :resolution="getMetadata('Systolic Pressure').resolution"
      />

      <ApprovalParameterTable
        title="Diastolic Pressure"
        :rows="diastolicData"
        :show-range="true"
        :display-type="getMetadata('Diastolic Pressure').displayType"
        :resolution="getMetadata('Diastolic Pressure').resolution"
      />

      <ApprovalParameterTable
        title="Temp"
        :rows="tempData"
        :show-range="false"
        :display-type="getMetadata('Temperature').displayType"
        :resolution="getMetadata('Temperature').resolution"
      />

      <ApprovalParameterTable
        title="Heart Rate"
        :rows="heartRateData"
        :show-range="false"
        :display-type="getMetadata('Heart Rate').displayType"
        :resolution="getMetadata('Heart Rate').resolution"
      />

      <ApprovalParameterTable
        title="Spo2"
        :rows="spo2Data"
        :show-range="false"
        :display-type="getMetadata('SpO2').displayType"
        :resolution="getMetadata('SpO2').resolution"
      />

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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EnvironmentCard from 'src/components/calibration/record/EnvironmentCard.vue';
import StandardEquipmentSelector from 'src/components/calibration/record/StandardEquipmentSelector.vue';
import EkgTestCard from 'src/components/calibration/record/EkgTestCard.vue';
import CalibrationSummary from 'src/components/calibration/record/CalibrationSummary.vue';
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

// Equipment Type detection
const isInfusionPump = computed(() => {
  const typeName = props.task?.equipment?.equipmentType?.name?.toLowerCase() || '';
  const modelName = props.task?.equipment?.name?.toLowerCase() || '';
  return (
    typeName.includes('infusion') ||
    typeName.includes('syringe') ||
    modelName.includes('infusion') ||
    modelName.includes('syringe') ||
    typeName.includes('เครื่องให้สารน้ำ')
  );
});

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
    status:
      m.result?.toUpperCase() === 'PASS'
        ? 'pass'
        : m.result?.toUpperCase() === 'FAIL'
          ? 'fail'
          : null,
  }));
};

const getMetadata = (name: string) => {
  const item = props.task?.measurements?.find((m) => m.parameter_name === name);
  return {
    displayType: item?.display_type || '',
    resolution: item?.resolution || '',
  };
};

// Patient Monitor Data
const ekgItems = computed<EkgItem[]>(() => {
  return (props.task?.qualitatives || [])
    .filter((q) => q.parameter_name === 'EKG')
    .map((q) => ({
      id: q.item_name,
      label: q.item_name,
      status:
        q.result?.toUpperCase() === 'PASS'
          ? 'pass'
          : q.result?.toUpperCase() === 'FAIL'
            ? 'fail'
            : null,
    }));
});

const systolicData = computed(() => mapMeasurements('Systolic Pressure'));
const diastolicData = computed(() => mapMeasurements('Diastolic Pressure'));
const tempData = computed(() => mapMeasurements('Temperature'));
const heartRateData = computed(() => mapMeasurements('Heart Rate'));
const spo2Data = computed(() => mapMeasurements('SpO2'));

// Infusion Pump Data
const occlusionResult = computed(() => {
  const item = props.task?.qualitatives?.find((q) => q.parameter_name === 'Occlusion Alarm');
  return item?.result?.toUpperCase() || '-';
});

const occlusionValue = computed(() => {
  const qual = props.task?.qualitatives?.find(
    (q) => q.item_name === 'Value' && q.parameter_name === 'Occlusion Alarm',
  );
  if (qual) return qual.result;

  const meas = props.task?.measurements?.find((m) => m.parameter_name === 'Occlusion Alarm');
  return meas?.reading_1 !== undefined ? meas.reading_1 : '-';
});

const flowRateData = computed(() => mapMeasurements('Flow Rate'));
const volumeData = computed(() => mapMeasurements('Volume'));

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
