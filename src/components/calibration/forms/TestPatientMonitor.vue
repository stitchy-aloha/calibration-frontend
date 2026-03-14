<template>
  <div class="q-py-md">
    <!-- Detailed Tests specific to Patient Monitor -->
    <EkgTestCard :ekg-items="ekgItems" />
    <TestParameterTable title="Systolic Pressure" v-model="systolicData" :show-range="true" />
    <TestParameterTable title="Diastolic Pressure" v-model="diastolicData" :show-range="true" />
    <TestParameterTable title="Temp" v-model="tempData" :show-range="false" />
    <TestParameterTable title="Heart Rate" v-model="heartRateData" :show-range="false" />
    <TestParameterTable title="Spo2" v-model="spo2Data" :show-range="false" />

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
import { ref, type Ref } from 'vue';
import EkgTestCard from '../record/EkgTestCard.vue';
import TestParameterTable from '../record/TestParameterTable.vue';
import CalibrationSummary from '../record/CalibrationSummary.vue';
import type { TestRow } from '../record/TestParameterTable.vue';

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

// Non-pressure tables: no range column, user fills values
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
</script>

<style scoped lang="scss">
</style>
