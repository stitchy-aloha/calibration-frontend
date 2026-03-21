<template>
  <div class="q-py-md">
    <SpecificParameterGrid
      :required-params="[
        { name: 'IV Set' },
        { name: 'Amount', unit: 'ml' },
        { name: 'Occlusion Pressure', unit: 'mmHg' },
        { name: 'Occlusion Alarm', unit: 'mmHg' },
      ]"
    />
    <TestParameterTable
      title="Flow Rate (ml/h)"
      v-model="flowRateData"
      :show-range="false"
      show-ucb
      v-model:ucb1="flowRateUcb1"
      v-model:ucb2="flowRateUcb2"
      v-model:ucb3="flowRateUcb3"
    />
    <TestParameterTable
      title="Occlusion Pressure (mmHg)"
      v-model="occlusionData"
      :show-range="false"
      show-ucb
      v-model:ucb1="occlusionUcb1"
      v-model:ucb2="occlusionUcb2"
      v-model:ucb3="occlusionUcb3"
    />

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
import SpecificParameterGrid from '../record/SpecificParameterGrid.vue';
import type { TestRow } from '../record/TestParameterTable.vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import { watch } from 'vue';

const store = useCalibrationRecordStore();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const overallStatus = ref<string | null>(null);
const statusOptions = ['Pass', 'Fail'];

// UCB Meta
const flowRateUcb1 = ref(0);
const flowRateUcb2 = ref(0);
const flowRateUcb3 = ref(0);

const occlusionUcb1 = ref(0);
const occlusionUcb2 = ref(0);
const occlusionUcb3 = ref(0);

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

// Sync to store
watch(
  [flowRateData, occlusionData, flowRateUcb1, flowRateUcb2, flowRateUcb3, occlusionUcb1, occlusionUcb2, occlusionUcb3, overallStatus],
  () => {
    const mapRows = (rows: TestRow[], param: string, ucb1: string | number, ucb2: string | number, ucb3: string | number) =>
      rows.map((r) => {
        const obj: {
          parameter_name: string;
          range: number;
          result: 'PASS' | 'FAIL';
          ucb1: number;
          ucb2: number;
          ucb3: number;
          standard_value?: number;
          reading_1?: number;
          reading_2?: number;
          reading_3?: number;
          average_value?: number;
          error_value?: number;
        } = {
          parameter_name: param,
          range: 0,
          result: r.status === 'pass' ? 'PASS' : 'FAIL',
          ucb1: Number(ucb1),
          ucb2: Number(ucb2),
          ucb3: Number(ucb3),
        };
        if (r.standard !== null) obj.standard_value = r.standard;
        if (r.val1 !== null) obj.reading_1 = r.val1;
        if (r.val2 !== null) obj.reading_2 = r.val2;
        if (r.val3 !== null) obj.reading_3 = r.val3;
        if (r.average !== null) obj.average_value = r.average;
        if (r.error !== null) obj.error_value = r.error;
        return obj;
      });

    store.measurements = [
      ...mapRows(flowRateData.value, 'Flow Rate', flowRateUcb1.value, flowRateUcb2.value, flowRateUcb3.value),
      ...mapRows(occlusionData.value, 'Occlusion Pressure', occlusionUcb1.value, occlusionUcb2.value, occlusionUcb3.value),
    ];
    
    if (overallStatus.value) {
      store.overallResult = overallStatus.value as 'Pass' | 'Fail' | 'NA';
    }
  },
  { deep: true },
);
</script>
