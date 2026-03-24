<template>
  <div class="q-py-md">
    <!-- Detailed Tests specific to Patient Monitor -->
    <EkgTestCard :ekg-items="ekgItems" />
    <TestParameterTable
      title="Systolic Pressure"
      v-model="systolicData"
      v-model:display-type="systolicDisplayType"
      v-model:resolution="systolicResolution"
      :show-range="true"
    />
    <TestParameterTable title="Diastolic Pressure" v-model="diastolicData" :show-range="true" />
    <TestParameterTable
      title="Temp"
      v-model="tempData"
      v-model:display-type="tempDisplayType"
      v-model:resolution="tempResolution"
      :show-range="false"
    />
    <TestParameterTable
      title="Heart Rate"
      v-model="heartRateData"
      v-model:display-type="heartRateDisplayType"
      v-model:resolution="heartRateResolution"
      :show-range="false"
    />
    <TestParameterTable
      title="Spo2"
      v-model="spo2Data"
      v-model:display-type="spo2DisplayType"
      v-model:resolution="spo2Resolution"
      :show-range="false"
    />

    <!-- Summary Component -->
    <CalibrationSummary
      :ekg-items="ekgItems"
      :systolic-data="systolicData"
      :diastolic-data="diastolicData"
      :temp-data="tempData"
      :heart-rate-data="heartRateData"
      :spo2-data="spo2Data"
      @save="emit('save')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue';
import EkgTestCard from '../record/EkgTestCard.vue';
import TestParameterTable from '../record/TestParameterTable.vue';
import CalibrationSummary from '../record/CalibrationSummary.vue';
import type { TestRow } from '../record/TestParameterTable.vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';

const store = useCalibrationRecordStore();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

// EKG — all blank, user selects pass/fail per lead
const ekgItems = ref([
  { id: 'i', label: 'I', status: null as 'pass' | 'fail' | null },
  { id: 'ii', label: 'II', status: null as 'pass' | 'fail' | null },
  { id: 'iii', label: 'III', status: null as 'pass' | 'fail' | null },
  { id: 'alarm', label: 'Alarm', status: null as 'pass' | 'fail' | null },
  { id: 'avr', label: 'aVR', status: null as 'pass' | 'fail' | null },
  { id: 'avl', label: 'aVL', status: null as 'pass' | 'fail' | null },
  { id: 'avf', label: 'aVF', status: null as 'pass' | 'fail' | null },
  { id: '1mv', label: '1mV', status: null as 'pass' | 'fail' | null },
]);

// Metadata state per parameter
const systolicDisplayType = ref('');
const systolicResolution = ref('');
const tempDisplayType = ref('');
const tempResolution = ref('');
const heartRateDisplayType = ref('');
const heartRateResolution = ref('');
const spo2DisplayType = ref('');
const spo2Resolution = ref('');

// Pressure tables: keep range + standard, user fills val1/val2/val3
const systolicData: Ref<TestRow[]> = ref([
  {
    range: 'ต่ำ',
    standard: 80,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: 'สูง',
    standard: 120,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: 'กลาง',
    standard: 160,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

const diastolicData: Ref<TestRow[]> = ref([
  {
    range: 'ต่ำ',
    standard: 50,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: 'สูง',
    standard: 80,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: 'กลาง',
    standard: 100,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

const tempData: Ref<TestRow[]> = ref([
  {
    range: '',
    standard: 35,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: '',
    standard: 40,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

const heartRateData: Ref<TestRow[]> = ref([
  {
    range: '',
    standard: 60,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: '',
    standard: 80,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

const spo2Data: Ref<TestRow[]> = ref([
  {
    range: '',
    standard: 85,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: '',
    standard: 100,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

function fillLocalMockData() {
  const fillRows = (rows: TestRow[]) => {
    rows.forEach((row) => {
      const stdVal = row.standard ?? 0;
      row.val1 = Number((stdVal + (Math.random() - 0.5) * (stdVal * 0.005)).toFixed(2));
      row.val2 = Number((stdVal + (Math.random() - 0.5) * (stdVal * 0.005)).toFixed(2));
      row.val3 = Number((stdVal + (Math.random() - 0.5) * (stdVal * 0.005)).toFixed(2));
      row.average = Number(((row.val1 + row.val2 + row.val3) / 3).toFixed(2));
      row.error = Number((row.average - stdVal).toFixed(2));
      row.status = 'pass';
    });
  };

  fillRows(systolicData.value);
  fillRows(diastolicData.value);
  fillRows(tempData.value);
  fillRows(heartRateData.value);
  fillRows(spo2Data.value);

  ekgItems.value.forEach((item) => {
    item.status = 'pass';
  });
}

watch(
  () => store.mockTrigger,
  () => {
    if (store.mockTrigger > 0) {
      fillLocalMockData();
    }
  },
);

// Sync to store
watch(
  [
    ekgItems,
    systolicData,
    diastolicData,
    tempData,
    heartRateData,
    spo2Data,
    systolicDisplayType,
    systolicResolution,
    tempDisplayType,
    tempResolution,
    heartRateDisplayType,
    heartRateResolution,
    spo2DisplayType,
    spo2Resolution,
  ],
  () => {
    // Map qualitatives
    store.qualitatives = ekgItems.value.map((item) => ({
      parameter_name: 'EKG',
      item_name: item.label,
      result: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'NA',
    }));

    // Map measurements
    const mapRows = (rows: TestRow[], param: string, displayType: string, resolution: string) =>
      rows.map((r) => {
        const obj: {
          parameter_name: string;
          range: number;
          result: 'PASS' | 'FAIL';
          standard_value?: number;
          reading_1?: number;
          reading_2?: number;
          reading_3?: number;
          average_value?: number;
          error_value?: number;
          display_type?: string;
          resolution?: string;
        } = {
          parameter_name: param,
          range: r.range === 'ต่ำ' ? 1 : r.range === 'กลาง' ? 2 : r.range === 'สูง' ? 3 : 0,
          result: r.status === 'pass' ? 'PASS' : 'FAIL',
          display_type: displayType,
          resolution: resolution,
        };
        if (r.standard !== null && r.standard !== undefined) obj.standard_value = r.standard;
        if (r.val1 !== null && r.val1 !== undefined) obj.reading_1 = r.val1;
        if (r.val2 !== null && r.val2 !== undefined) obj.reading_2 = r.val2;
        if (r.val3 !== null && r.val3 !== undefined) obj.reading_3 = r.val3;
        if (r.average !== null && r.average !== undefined) obj.average_value = r.average;
        if (r.error !== null && r.error !== undefined) obj.error_value = r.error;
        return obj;
      });

    store.measurements = [
      ...mapRows(
        systolicData.value,
        'Systolic Pressure',
        systolicDisplayType.value,
        systolicResolution.value,
      ),
      ...mapRows(diastolicData.value, 'Diastolic Pressure', '', ''),
      ...mapRows(tempData.value, 'Temperature', tempDisplayType.value, tempResolution.value),
      ...mapRows(
        heartRateData.value,
        'Heart Rate',
        heartRateDisplayType.value,
        heartRateResolution.value,
      ),
      ...mapRows(spo2Data.value, 'SpO2', spo2DisplayType.value, spo2Resolution.value),
    ];

    // ตรวจสอบว่ามีรายการใดไม่ผ่านหรือไม่ เพื่อส่งค่า overallResult ที่ถูกต้องไปบันทึก
    const hasFail =
      store.measurements.some((m) => m.result === 'FAIL') ||
      store.qualitatives.some((q) => q.result === 'FAIL');
    store.overallResult = hasFail ? 'Fail' : 'Pass';
  },
  { deep: true },
);
</script>

<style scoped lang="scss"></style>
