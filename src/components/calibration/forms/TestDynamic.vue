<template>
  <div class="q-py-md">
    <!-- 1. Qualitative Parameters -->
    <div v-if="qualitativeParams.length > 0" class="q-mb-xl">
      <div v-for="(group, groupName) in groupedQualitatives" :key="groupName" class="q-mb-md">
        <EkgTestCard :ekg-items="group" :title="String(groupName)" />
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
        v-model:ucb1="paramMetadata[i].ucb1"
        v-model:ucb2="paramMetadata[i].ucb2"
        v-model:ucb3="paramMetadata[i].ucb3"
        :show-range="true"
        :show-ucb="isUcbActive(param)"
        :error-limit="parseFloat(param.tolerance || '2.0')"
        :stdType="param.std_type || (param as any).stdType"
      />
    </div>

    <!-- 3. Summary Component -->
    <CalibrationSummary :custom-checklist="checklistItems" @save="emit('save')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import { useCalibrationSettingStore } from 'src/stores/calibrationSetting';
import EkgTestCard, { type EkgItem } from '../record/EkgTestCard.vue';
import TestParameterTable, { type TestRow } from '../record/TestParameterTable.vue';
import CalibrationSummary from '../record/CalibrationSummary.vue';
import type { CalibrationSetting } from 'src/services/calibration-setting.service';
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
    ucb1: string;
    ucb2: string;
    ucb3: string;
  }[]
>([]);

// Map qualitative settings to EkgItem structure
const qualValues = ref<Record<string, EkgItem[]>>({});

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
      average: null,
      error: null,
      status: null,
    }));
  });

  paramMetadata.value = quantitativeParams.value.map((param) => ({
    displayType: param.display_type || 'Digital',
    resolution: param.resolution || '0.1',
    ucb1: param.ucb1 || '0',
    ucb2: param.ucb2 || '0',
    ucb3: param.ucb3 || '0',
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
}

function fillLocalMockData() {
  // 1. Quantitative
  paramValues.value = paramValues.value.map((rows) => {
    return rows.map((row) => {
      const stdVal = typeof row.standard === 'number' ? row.standard : 0;
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
    });
  });

  // 2. Qualitative
  Object.entries(qualValues.value).forEach(([key, items]) => {
    qualValues.value[key] = items.map((item) => ({
      ...item,
      status: 'pass',
    }));
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

function isUcbActive(param: CalibrationSetting) {
  // Show UCB only if at least one field is non-zero
  const u1 = parseFloat(param.ucb1 || '0');
  const u2 = parseFloat(param.ucb2 || '0');
  const u3 = parseFloat(param.ucb3 || '0');
  return u1 !== 0 || u2 !== 0 || u3 !== 0;
}

const groupedQualitatives = computed(() => qualValues.value);

// Summary Checklist
const checklistItems = computed(() => {
  const items: { label: string; icon: string; passed: boolean }[] = [];

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
  [paramValues, paramMetadata, qualValues],
  () => {
    // 1. Map Qualitatives
    const qualitatives: QualitativeRecord[] = [];
    Object.entries(qualValues.value).forEach(([paramName, items]) => {
      items.forEach((item) => {
        qualitatives.push({
          parameter_name: paramName,
          item_name: item.label,
          result: item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'NA',
        });
      });
    });
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
          average_value: r.average ?? undefined,
          error_value: r.error ?? undefined,
          display_type: meta.displayType,
          resolution: meta.resolution,
          ucb1: parseFloat(meta.ucb1 || '0'),
          ucb2: parseFloat(meta.ucb2 || '0'),
          ucb3: parseFloat(meta.ucb3 || '0'),
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
