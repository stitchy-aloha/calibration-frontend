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
      <div class="occlusion-section-title q-mb-md">Occlusion</div>
      <q-card flat bordered class="q-pa-lg q-mb-xl">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">IV Set:</div>
            <div class="readonly-field">{{ getSpecificParam('IV Set') || '-' }}</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Amount:</div>
            <div class="readonly-field">
              {{ getSpecificParam('Amount') || '-' }}
              <span v-if="getSpecificParam('Amount')" class="text-grey-6">Drop/mL</span>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Occlusion Pressure:</div>
            <div class="readonly-field">
              {{ getSpecificParam('Occlusion Pressure') || '-' }}
              <span v-if="getSpecificParam('Occlusion Pressure')" class="text-grey-6">mmHg</span>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Occlusion Alarm:</div>
            <div
              class="readonly-field text-weight-bold"
              :class="
                occlusionAlarmValue === 'Pass'
                  ? 'text-positive'
                  : occlusionAlarmValue === 'Fail'
                    ? 'text-negative'
                    : ''
              "
            >
              {{ occlusionAlarmValue || '-' }}
            </div>
          </div>
        </div>
      </q-card>

      <ApprovalParameterTable
        title="Flow Rate Test"
        :rows="flowRateData"
        :show-range="false"
        :display-type="getMetadata('Flow Rate').displayType"
        :resolution="getMetadata('Flow Rate').resolution"
        :ucb1="getUcb('Flow Rate').ucb1"
        :ucb2="getUcb('Flow Rate').ucb2"
        :ucb3="getUcb('Flow Rate').ucb3"
      />

      <ApprovalParameterTable
        title="Volume Test"
        :rows="volumeData"
        :show-range="false"
        :display-type="getMetadata('Volume').displayType"
        :resolution="getMetadata('Volume').resolution"
        :ucb1="getUcb('Volume').ucb1"
        :ucb2="getUcb('Volume').ucb2"
        :ucb3="getUcb('Volume').ucb3"
      />

      <!-- Summary Section (reuse CalibrationSummary with custom checklist) -->
      <CalibrationSummary
        :custom-checklist="ipChecklist"
        :inspector-name="task?.technician?.name || '-'"
        :inspector-role="task?.technician?.position || task?.technician?.role?.name || '-'"
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
        :inspector-role="task?.technician?.position || task?.technician?.role?.name || '-'"
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

const getUcb = (name: string) => {
  const item = props.task?.measurements?.find((m) => m.parameter_name === name);
  return {
    ucb1: item?.ucb1,
    ucb2: item?.ucb2,
    ucb3: item?.ucb3,
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
const getSpecificParam = (name: string): string => {
  const param = props.task?.specificParameters?.find((p) => p.name === name);
  return param?.value || '';
};

const occlusionAlarmValue = computed(() => getSpecificParam('Occlusion Alarm'));

const flowRateData = computed(() => mapMeasurements('Flow Rate'));
const volumeData = computed(() => mapMeasurements('Volume'));

const tablePassed = (rows: TestRow[]): boolean => {
  const tested = rows.filter((r) => r.status !== null);
  return tested.length > 0 && tested.every((r) => r.status === 'pass');
};

const ipChecklist = computed(() => [
  {
    label: 'Infusion Set (Occlusion Alarm)',
    icon: 'vaccines',
    passed: occlusionAlarmValue.value === 'Pass',
  },
  { label: 'Flow Rate', icon: 'waves', passed: tablePassed(flowRateData.value) },
  { label: 'Volume', icon: 'opacity', passed: tablePassed(volumeData.value) },
]);

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

.occlusion-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid #ffab00;
  padding-left: 12px;
}

.readonly-field {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 12px;
  background: #fafafa;
  font-size: 14px;
  color: #1a1a2e;
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
