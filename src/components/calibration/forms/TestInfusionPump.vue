<template>
  <div class="q-py-md">
    <TestParameterTable title="Flow Rate (ml/h)" v-model="flowRateData" :show-range="false" />
    <TestParameterTable title="Occlusion Pressure (mmHg)" v-model="occlusionData" :show-range="false" />

    <q-card flat bordered class="q-pa-md q-mt-md">
      <div class="text-h6 text-grey-9 q-mb-md">สรุปผลการทดสอบ (Infusion Pump)</div>
      
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="overallStatus"
            :options="statusOptions"
            label="Overall Result"
            outlined
            dense
            color="primary"
          />
        </div>
      </div>
      
      <div class="row justify-end q-mt-lg">
        <q-btn
          unelevated
          color="primary"
          icon="save"
          label="บันทึกผลการสอบเทียบ"
          class="q-px-lg"
          @click="emit('save')"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import TestParameterTable from '../record/TestParameterTable.vue';
import type { TestRow } from '../record/TestParameterTable.vue';

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const overallStatus = ref<string | null>(null);
const statusOptions = ['PASS', 'FAIL'];

const flowRateData: Ref<TestRow[]> = ref([
  {
    range: '',
    standard: 10,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: '',
    standard: 50,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);

const occlusionData: Ref<TestRow[]> = ref([
  {
    range: '',
    standard: 300,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
  {
    range: '',
    standard: 600,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  },
]);
</script>
