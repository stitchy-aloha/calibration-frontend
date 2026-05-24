<template>
  <div class="q-py-md">
    <!-- 1. Qualitative Parameters -->
    <div v-if="qualitativeParams.length > 0 && !isInfusion" class="q-mb-xl">
      <div v-for="(group, groupName) in groupedQualitatives" :key="groupName" class="q-mb-md">
        <EkgTestCard :ekg-items="group" :title="String(groupName)" />
      </div>
    </div>

    <!-- Custom Infusion Pump Specific Parameters Form -->
    <div v-if="isInfusion" class="q-mb-xl">
      <div class="row q-col-gutter-lg">
        <!-- IV Set Configuration -->
        <div class="col-12 col-md-6">
          <div class="section-title q-mb-md">IV Set Configuration</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-8 q-mb-xs text-weight-medium">IV Set:</div>
              <q-input v-model="ivSet" outlined dense bg-color="white" placeholder="e.g. Covex" />
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-8 q-mb-xs text-weight-medium">Drop Rate:</div>
              <q-input
                v-model="dropRate"
                outlined
                dense
                bg-color="white"
                suffix="Drop/mL"
                placeholder="20"
              />
            </div>
          </div>
        </div>

        <!-- Alram -->
        <div class="col-12 col-md-6">
          <div class="section-title q-mb-md">Alram</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-8 q-mb-xs text-weight-medium">Air:</div>
              <q-select
                v-model="air"
                outlined
                dense
                bg-color="white"
                :options="['Pass', 'Fail']"
                placeholder="Select"
              />
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-caption text-grey-8 q-mb-xs text-weight-medium">
                Occlusion Pressure:
              </div>
              <q-input
                v-model="occlusionPressure"
                outlined
                dense
                bg-color="white"
                suffix="mmHg"
                placeholder="750"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Quantitative Parameters -->
    <div
      v-for="(param, i) in quantitativeParams"
      :key="(param.id || i) + '-' + (param.std_type || '')"
    >
      <TestParameterTable
        v-if="paramValues[i] && paramMetadata[i]"
        :title="param.parameter_name"
        v-model="paramValues[i]"
        v-model:display-type="paramMetadata[i].displayType"
        v-model:resolution="paramMetadata[i].resolution"
        :show-range="true"
        :error-limit="parseFloat(param.tolerance || '2.0')"
        :std-type="param.std_type || (param as any).stdType"
      />
    </div>

    <!-- 3. Summary Component -->
    <CalibrationSummary :custom-checklist="checklistItems" @save="emit('save')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import { useCalibrationSettingStore, isInfusionPump } from 'src/stores/calibrationSetting';
import EkgTestCard, { type EkgItem } from '../record/EkgTestCard.vue';
import TestParameterTable, { type TestRow } from '../record/TestParameterTable.vue';
import CalibrationSummary from '../record/CalibrationSummary.vue';
import type { MeasurementRecord, QualitativeRecord } from 'src/stores/calibrationRecord';

const store = useCalibrationRecordStore();
const settingStore = useCalibrationSettingStore();

const emit = defineEmits<{
  (e: 'save'): void;
}>();

/* ── State ── */
const qualitativeParams = computed(() =>
  settingStore.settings.filter((s) => s.type === 'qualitative'),
);
const quantitativeParams = computed(() =>
  settingStore.settings.filter((s) => s.type === 'quantitative'),
);

// Map quantitative settings to their reactive data rows
const paramValues = ref<TestRow[][]>([]);
const paramMetadata = ref<
  {
    displayType: string;
    resolution: string;
  }[]
>([]);

// Map qualitative settings to EkgItem structure
const qualValues = ref<Record<string, EkgItem[]>>({});

const isInfusion = computed(() => {
  return isInfusionPump(store.equipmentDetails?.name);
});

const ivSet = ref('Covex');
const dropRate = ref('20');
const air = ref('Pass');
const occlusionPressure = ref('750');

// Watch and sync custom infusion pump fields to global store specificParameters
watch(
  [isInfusion, ivSet, dropRate, air, occlusionPressure],
  () => {
    if (!isInfusion.value) return;

    store.specificParameters = [
      { name: 'IV Set', value: ivSet.value },
      { name: 'Drop Rate', value: dropRate.value, unit: 'Drop/mL' },
      { name: 'Air', value: air.value },
      { name: 'Occlusion Pressure', value: occlusionPressure.value, unit: 'mmHg' },
    ];
  },
  { deep: true, immediate: true },
);

// Initialize data when settings are available or change
watch(
  () => settingStore.settings,
  (newSettings) => {
    if (newSettings && newSettings.length > 0) {
      console.log('[TestDynamic] settings loaded:', newSettings);
      console.log('[TestDynamic] quantitativeParams:', quantitativeParams.value);
      initializeData();
    }
  },
  { immediate: true },
);

function initializeData() {
  // 1. Initialize Quantitative
  paramValues.value = quantitativeParams.value.map((param) => {
    const testValues = param.test_values || [];
    return testValues.map((tv) => ({
      range: tv.label,
      standard: tv.value,
      val1: null,
      val2: null,
      val3: null,
      stdVal1: null,
      stdVal2: null,
      stdVal3: null,
      average: null,
      averageStd: null,
      error: null,
      status: null,
    }));
  });

  paramMetadata.value = quantitativeParams.value.map((param) => ({
    displayType: param.display_type || '',
    resolution: param.resolution || '',
  }));

  // 2. Initialize Qualitative
  const qualGroup: Record<string, EkgItem[]> = {};
  qualitativeParams.value.forEach((param) => {
    let items = param.test_values || [];

    // Fallback: If no sub-items, use the parameter name itself as one item
    if (items.length === 0) {
      items = [{ label: param.parameter_name, value: 0 }];
    }

    qualGroup[param.parameter_name] = items.map((v, idx) => ({
      id: v.label || `${param.parameter_name}_item_${idx}`,
      label: v.label || param.parameter_name,
      status: null,
    }));
  });
  qualValues.value = qualGroup;

  // 3. Load specific parameters for Infusion Pump if already saved
  if (isInfusion.value && store.specificParameters && store.specificParameters.length > 0) {
    const findValue = (name: string) =>
      store.specificParameters.find((p) => p.name === name)?.value;

    const savedIvSet = findValue('IV Set');
    const savedDropRate = findValue('Drop Rate');
    const savedAir = findValue('Air');
    const savedPressure = findValue('Occlusion Pressure');

    if (savedIvSet !== undefined && savedIvSet !== null) ivSet.value = savedIvSet;
    if (savedDropRate !== undefined && savedDropRate !== null) dropRate.value = savedDropRate;
    if (savedAir !== undefined && savedAir !== null) air.value = savedAir;
    if (savedPressure !== undefined && savedPressure !== null)
      occlusionPressure.value = savedPressure;
  }
}

function fillLocalMockData() {
  // 1. Quantitative
  paramValues.value = paramValues.value.map((rows, i) => {
    const param = quantitativeParams.value[i];
    const isMode4 =
      param?.std_type?.includes('4') ||
      param?.std_type?.includes('3 UUC') ||
      param?.std_type?.includes('3 UUC : 3 STD');
    return rows.map((row) => {
      const stdVal = typeof row.standard === 'number' ? row.standard : 0;
      if (isMode4) {
        const std1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const std2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const std3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const avgStd = (std1 + std2 + std3) / 3;

        const r1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const r2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const r3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const avg = (r1 + r2 + r3) / 3;
        const err = avg - avgStd;

        return {
          ...row,
          stdVal1: Number(std1.toFixed(2)),
          stdVal2: Number(std2.toFixed(2)),
          stdVal3: Number(std3.toFixed(2)),
          val1: Number(r1.toFixed(2)),
          val2: Number(r2.toFixed(2)),
          val3: Number(r3.toFixed(2)),
          average: Number(avg.toFixed(2)),
          averageStd: Number(avgStd.toFixed(2)),
          error: Number(err.toFixed(2)),
          status: 'pass',
        };
      } else {
        const r1 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const r2 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const r3 = stdVal + (Math.random() - 0.5) * (stdVal * 0.005);
        const avg = (r1 + r2 + r3) / 3;
        const err = avg - stdVal;

        return {
          ...row,
          val1: Number(r1.toFixed(2)),
          val2: Number(r2.toFixed(2)),
          val3: Number(r3.toFixed(2)),
          average: Number(avg.toFixed(2)),
          error: Number(err.toFixed(2)),
          status: 'pass',
        };
      }
    });
  });

  // 2. Qualitative
  Object.entries(qualValues.value).forEach(([key, items]) => {
    qualValues.value[key] = items.map((item) => ({
      ...item,
      status: 'pass',
    }));
  });

  if (isInfusion.value) {
    ivSet.value = 'Covex';
    dropRate.value = '20';
    air.value = 'Pass';
    occlusionPressure.value = '750';
  }
}

watch(
  () => store.mockTrigger,
  () => {
    if (store.mockTrigger > 0) {
      fillLocalMockData();
    }
  },
);

const groupedQualitatives = computed(() => qualValues.value);

// Summary Checklist
const checklistItems = computed(() => {
  const items: { label: string; icon: string; passed: boolean }[] = [];

  if (isInfusion.value) {
    items.push({
      label: 'Alram',
      icon: 'alarm',
      passed: air.value === 'Pass',
    });
  } else {
    // Qualitative checks
    Object.entries(qualValues.value).forEach(([name, values]) => {
      const tested = values.filter((v) => v.status !== null);
      const passed = tested.length > 0 && tested.every((v) => v.status === 'pass');
      items.push({
        label: name,
        icon: 'fact_check',
        passed,
      });
    });
  }

  // 4. Quantitative checks
  quantitativeParams.value.forEach((param, i) => {
    const rows = paramValues.value[i] || [];
    const tested = rows.filter((r) => r.status !== null);
    const passed = tested.length > 0 && tested.every((r) => r.status === 'pass');
    items.push({
      label: param.parameter_name,
      icon: 'analytics',
      passed,
    });
  });

  return items;
});

// Sync to Global Store
watch(
  [paramValues, paramMetadata, qualValues, ivSet, dropRate, air, occlusionPressure],
  () => {
    // 1. Map Qualitatives
    const qualitatives: QualitativeRecord[] = [];
    if (!isInfusion.value) {
      Object.entries(qualValues.value).forEach(([paramName, items]) => {
        items.forEach((item) => {
          qualitatives.push({
            parameter_name: paramName,
            item_name: item.label,
            result: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'NA',
          });
        });
      });
    }
    store.qualitatives = qualitatives;

    // 2. Map Measurements
    const measurements: MeasurementRecord[] = [];
    quantitativeParams.value.forEach((param, i) => {
      const rows = paramValues.value[i];
      const meta = paramMetadata.value[i];
      if (!rows || !meta) return;

      rows.forEach((r) => {
        measurements.push({
          parameter_name: param.parameter_name,
          range: 0, // General index
          result: r.status === 'pass' ? 'PASS' : 'FAIL',
          standard_value: r.standard ?? undefined,
          reading_1: r.val1 ?? undefined,
          reading_2: r.val2 ?? undefined,
          reading_3: r.val3 ?? undefined,
          std_reading_1: r.stdVal1 ?? undefined,
          std_reading_2: r.stdVal2 ?? undefined,
          std_reading_3: r.stdVal3 ?? undefined,
          average_value: r.average ?? undefined,
          average_standard: r.averageStd ?? undefined,
          error_value: r.error ?? undefined,
          display_type: meta.displayType,
          resolution: meta.resolution,

          std_type: param.std_type,
        });
      });
    });
    store.measurements = measurements;

    // 3. Overall Result
    const hasFail = checklistItems.value.some((item) => !item.passed);
    store.overallResult = hasFail ? 'Fail' : 'Pass';
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid $secondary;
  padding-left: 10px;
}
</style>
