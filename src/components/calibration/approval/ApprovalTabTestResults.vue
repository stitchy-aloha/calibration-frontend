<template>
  <div class="q-pa-md">
    <!-- Environment and Standard Equipment Cards -->
    <div class="row q-col-gutter-md items-stretch q-mb-md">
      <div class="col-12 col-md-4 flex">
        <EnvironmentCard class="full-width" :readonly="true" />
      </div>
      <div class="col-12 col-md-8 flex">
        <StandardEquipmentSelector class="full-width" :readonly="true" />
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
      inspector-name="นาย วิววาด ใจกว้าง"
      inspector-role="นายช่างเทคนิค"
      @save="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import EnvironmentCard from 'components/calibration/record/EnvironmentCard.vue';
import StandardEquipmentSelector from 'components/calibration/record/StandardEquipmentSelector.vue';
import EkgTestCard from 'components/calibration/record/EkgTestCard.vue';
import CalibrationSummary from 'components/calibration/record/CalibrationSummary.vue';
import ApprovalParameterTable from './ApprovalParameterTable.vue';

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

defineProps<{
  ekgItems: EkgItem[];
  systolicData: TestRow[];
  diastolicData: TestRow[];
  tempData: TestRow[];
  heartRateData: TestRow[];
  spo2Data: TestRow[];
}>();
</script>

<style scoped lang="scss">
.section-bar {
  background-color: $secondary !important;
}
</style>
