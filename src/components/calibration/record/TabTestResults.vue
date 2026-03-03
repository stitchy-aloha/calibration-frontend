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

    <!-- Detailed Tests -->
    <EkgTestCard />

    <TestParameterTable title="Systolic Pressure" v-model="systolicData" />

    <TestParameterTable title="Diastolic Pressure" v-model="diastolicData" />

    <TestParameterTable title="Temp" v-model="tempData" />

    <TestParameterTable title="Heart Rate" v-model="heartRateData" />

    <TestParameterTable title="Spo2" v-model="spo2Data" />
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import EnvironmentCard from './EnvironmentCard.vue';
import StandardEquipmentSelector from './StandardEquipmentSelector.vue';
import EkgTestCard from './EkgTestCard.vue';
import TestParameterTable from './TestParameterTable.vue';
import type { TestRow } from './TestParameterTable.vue';

// Mock data structures corresponding to UI Mockup
const systolicData: Ref<TestRow[]> = ref([
  {
    range: 'ต่ำ',
    standard: 80,
    val1: 80,
    val2: 80,
    val3: 80,
    average: 80,
    error: 0,
    status: 'pass',
  },
  {
    range: 'สูง',
    standard: 120,
    val1: 121,
    val2: 120,
    val3: 120,
    average: 120.3,
    error: 0.3,
    status: 'pass',
  },
  {
    range: 'กลาง',
    standard: 160,
    val1: 160,
    val2: 160,
    val3: 163,
    average: 161,
    error: 1,
    status: 'pass',
  },
]);

const diastolicData: Ref<TestRow[]> = ref([
  {
    range: 'ต่ำ',
    standard: 50,
    val1: 50,
    val2: 50,
    val3: 50,
    average: 50,
    error: 0,
    status: 'pass',
  },
  {
    range: 'สูง',
    standard: 80,
    val1: 81,
    val2: 81,
    val3: 81,
    average: 81,
    error: 1,
    status: 'pass',
  },
  {
    range: 'กลาง',
    standard: 100,
    val1: 99,
    val2: 99,
    val3: 99,
    average: 99,
    error: -1,
    status: 'pass',
  },
]);

const tempData: Ref<TestRow[]> = ref([
  {
    range: '35',
    standard: 35,
    val1: 35,
    val2: 35,
    val3: 35,
    average: 35,
    error: 0,
    status: 'pass',
  },
  {
    range: '40',
    standard: 40,
    val1: 41,
    val2: 40,
    val3: 41,
    average: 41,
    error: 1,
    status: 'pass',
  },
  {
    range: 'กำหนดเอง',
    standard: null,
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
    range: '60',
    standard: 60,
    val1: 60,
    val2: 61,
    val3: 60,
    average: 60.3,
    error: 0.3,
    status: 'pass',
  },
  {
    range: '80',
    standard: 80,
    val1: 80,
    val2: 81,
    val3: 79,
    average: 80,
    error: 0,
    status: 'pass',
  },
  {
    range: 'กำหนดเอง',
    standard: null,
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
    range: '80',
    standard: 85,
    val1: 84,
    val2: 84,
    val3: 84,
    average: 84,
    error: -1,
    status: 'pass',
  },
  {
    range: '100',
    standard: 100,
    val1: 98,
    val2: 97,
    val3: 96,
    average: 97,
    error: -3,
    status: 'fail',
  }, // Modified to show fail
  {
    range: 'กำหนดเอง',
    standard: null,
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
.bg-purple-2 {
  background-color: $secondary !important;
}
</style>
