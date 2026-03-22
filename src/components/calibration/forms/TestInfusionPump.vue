<template>
  <div class="q-py-md">
    <!-- Occlusion Section -->
    <div class="occlusion-section q-mb-xl">
      <div class="section-title q-mb-md">Occlusion</div>
      <q-card flat bordered class="q-pa-lg occlusion-card">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">IV Set:</div>
            <q-input
              v-model="occlusion.ivSet"
              outlined
              dense
              bg-color="white"
              placeholder="e.g. Covex"
            />
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Amount:</div>
            <q-input
              v-model="occlusion.amount"
              outlined
              dense
              bg-color="white"
              suffix="Drop/mL"
              placeholder="200"
            />
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Occlusion Pressure:</div>
            <q-input
              v-model="occlusion.pressure"
              outlined
              dense
              bg-color="white"
              suffix="mmHg"
              placeholder="300"
            />
          </div>
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">Occlusion Alarm:</div>
            <q-select
              v-model="occlusion.alarm"
              outlined
              dense
              bg-color="white"
              :options="['Pass', 'Fail']"
              placeholder="Select"
            />
          </div>
        </div>
      </q-card>
    </div>

    <!-- Flow Rate Section -->
    <TestParameterTable
      title="Flow Rate"
      v-model="flowRate.data"
      :show-range="false"
      show-ucb
      v-model:ucb1="flowRate.ucb1"
      v-model:ucb2="flowRate.ucb2"
      v-model:ucb3="flowRate.ucb3"
      v-model:display-type="flowRate.displayType"
      v-model:resolution="flowRate.resolution"
      :error-limit="2.2"
    />

    <!-- Volume Section -->
    <TestParameterTable
      title="Volume"
      v-model="volume.data"
      :show-range="false"
      show-ucb
      v-model:ucb1="volume.ucb1"
      v-model:ucb2="volume.ucb2"
      v-model:ucb3="volume.ucb3"
      v-model:display-type="volume.displayType"
      v-model:resolution="volume.resolution"
      :error-limit="2.2"
    />

    <!-- Summary Section -->
    <div class="summary-section q-mt-xl">
      <q-card
        flat
        class="bg-purple-2 q-py-sm q-mb-lg text-center text-white text-subtitle1 text-weight-bold"
        style="border-radius: 4px"
      >
        สรุปผล
      </q-card>

      <div class="row q-col-gutter-lg items-start">
        <!-- Inspector Detail -->
        <div class="col-12 col-md-5">
          <InspectorCard />
          <q-btn
            unelevated
            :color="overallPassed ? 'positive' : 'negative'"
            class="full-width q-mt-md q-py-md result-btn"
            no-caps
          >
            <q-icon :name="overallPassed ? 'check_circle' : 'cancel'" size="28px" class="q-mr-sm" />
            <span class="text-h6">{{ overallPassed ? 'ผ่าน' : 'ไม่ผ่าน' }}</span>
          </q-btn>
        </div>

        <!-- Checklist -->
        <div class="col-12 col-md-7">
          <div class="checklist-container">
            <div
              v-for="item in checklist"
              :key="item.label"
              class="checklist-item row items-center q-px-md q-py-sm q-mb-sm"
            >
              <q-icon :name="item.icon" size="20px" color="grey-6" class="q-mr-md" />
              <span class="text-subtitle2 text-grey-9 text-weight-medium">{{ item.label }}</span>
              <q-space />
              <q-icon
                :name="item.passed ? 'check_circle' : 'cancel'"
                :color="item.passed ? 'positive' : 'negative'"
                size="24px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import TestParameterTable from '../record/TestParameterTable.vue';
import InspectorCard from '../record/InspectorCard.vue';
import type { TestRow } from '../record/TestParameterTable.vue';
import { useCalibrationRecordStore, type MeasurementRecord } from 'src/stores/calibrationRecord';

const store = useCalibrationRecordStore();

// Occlusion Data
const occlusion = ref({
  ivSet: 'Covex',
  amount: '200',
  pressure: '300',
  alarm: 'Pass',
});

// Flow Rate Data
const flowRate = ref({
  displayType: 'Digital',
  resolution: '0.1',
  ucb1: '0.002000',
  ucb2: '0.000000',
  ucb3: '0.000000',
  data: [
    {
      standard: 10,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
    {
      standard: 50,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
    {
      standard: 100,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
  ] as TestRow[],
});

// Volume Data
const volume = ref({
  displayType: 'Digital',
  resolution: '0.1',
  ucb1: '0.002000',
  ucb2: '0.000000',
  ucb3: '0.000000',
  data: [
    {
      standard: 50,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
    {
      standard: 100,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
    {
      standard: 200,
      val1: null,
      val2: null,
      val3: null,
      average: null,
      error: null,
      status: null,
      range: '',
    },
  ] as TestRow[],
});

// Checklist
const checklist = computed(() => [
  {
    label: 'Infusion Set',
    icon: 'vaccines',
    passed: occlusion.value.alarm === 'Pass',
  },
  {
    label: 'Flow Rate',
    icon: 'waves',
    passed: flowRate.value.data.every((r) => r.status === 'pass'),
  },
  {
    label: 'Volume',
    icon: 'opacity',
    passed: volume.value.data.every((r) => r.status === 'pass'),
  },
]);

const overallPassed = computed(() => checklist.value.every((item) => item.passed));

// Sync to store
watch(
  [occlusion, flowRate, volume, overallPassed],
  () => {
    // Sync Specific Parameters (Occlusion)
    store.specificParameters = [
      { name: 'IV Set', value: occlusion.value.ivSet },
      { name: 'Amount', value: occlusion.value.amount, unit: 'Drop/mL' },
      { name: 'Occlusion Pressure', value: occlusion.value.pressure, unit: 'mmHg' },
      { name: 'Occlusion Alarm', value: occlusion.value.alarm },
    ];

    // Sync Measurements
    const mapRows = (
      rows: TestRow[],
      paramName: string,
      displayType: string,
      resolution: string,
      ucb1?: string | number,
      ucb2?: string | number,
      ucb3?: string | number,
    ): MeasurementRecord[] =>
      rows.map((r) => {
        const row: MeasurementRecord = {
          parameter_name: paramName,
          result: r.status === 'pass' ? 'PASS' : 'FAIL',
          display_type: displayType,
          resolution: resolution,
        };
        if (r.standard !== null) row.standard_value = r.standard;
        if (r.val1 !== null) row.reading_1 = r.val1;
        if (r.val2 !== null) row.reading_2 = r.val2;
        if (r.val3 !== null) row.reading_3 = r.val3;
        if (r.average !== null) row.average_value = r.average;
        if (r.error !== null) row.error_value = r.error;
        if (ucb1 !== undefined && ucb1 !== '') row.ucb1 = Number(ucb1);
        if (ucb2 !== undefined && ucb2 !== '') row.ucb2 = Number(ucb2);
        if (ucb3 !== undefined && ucb3 !== '') row.ucb3 = Number(ucb3);
        return row;
      });

    store.measurements = [
      ...mapRows(
        flowRate.value.data,
        'Flow Rate',
        flowRate.value.displayType,
        flowRate.value.resolution,
        flowRate.value.ucb1,
        flowRate.value.ucb2,
        flowRate.value.ucb3,
      ),
      ...mapRows(
        volume.value.data,
        'Volume',
        volume.value.displayType,
        volume.value.resolution,
        volume.value.ucb1,
        volume.value.ucb2,
        volume.value.ucb3,
      ),
    ];

    store.overallResult = overallPassed.value ? 'Pass' : 'Fail';
  },
  { deep: true },
);

onMounted(() => {
  // Initialize from store if needed
  if (store.specificParameters.length > 0) {
    const findValue = (name: string) =>
      store.specificParameters.find((p) => p.name === name)?.value || '';
    occlusion.value.ivSet = findValue('IV Set') || 'Covex';
    occlusion.value.amount = findValue('Amount') || '200';
    occlusion.value.pressure = findValue('Occlusion Pressure') || '300';
    occlusion.value.alarm = findValue('Occlusion Alarm') || 'Pass';
  }
});
</script>

<style scoped lang="scss">
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid #ffab00;
  padding-left: 12px;
}

.occlusion-card {
  border-radius: 8px;
  background-color: #fff;
}

.bg-purple-2 {
  background-color: $secondary !important;
}

.result-btn {
  border-radius: 12px !important;
  font-weight: 700;
  height: 64px;
}

.checklist-container {
  display: flex;
  flex-direction: column;
}

.checklist-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #edf2f7;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}
</style>
