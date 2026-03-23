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

    <!-- 1. Specific Parameters (e.g., for Infusion Pump) -->
    <div v-if="task?.specificParameters?.length" class="q-mb-xl">
      <div class="occlusion-section-title q-mb-md">พารามิเตอร์เฉพาะ (Specific Parameters)</div>
      <q-card flat bordered class="q-pa-lg">
        <div class="row q-col-gutter-lg">
          <div v-for="sp in task.specificParameters" :key="sp.id" class="col-12 col-sm-6 col-md-3">
            <div class="text-caption text-grey-8 q-mb-xs">{{ sp.name }}:</div>
            <div
              class="readonly-field"
              :class="{
                'text-positive text-weight-bold': sp.value === 'Pass' || sp.value === 'PASS',
                'text-negative text-weight-bold': sp.value === 'Fail' || sp.value === 'FAIL',
              }"
            >
              {{ sp.value || '-' }}
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- 2. Qualitative Parameters (Cards) -->
    <div v-if="Object.keys(groupedQualitatives).length > 0" class="q-mb-xl">
      <div v-for="(items, groupName) in groupedQualitatives" :key="groupName" class="q-mb-md">
        <EkgTestCard :ekg-items="items" :title="String(groupName)" :readonly="true" />
      </div>
    </div>

    <!-- 3. Quantitative Parameters (Tables) -->
    <div v-if="Object.keys(groupedMeasurements).length > 0">
      <div v-for="(rows, name) in groupedMeasurements" :key="name">
        <ApprovalParameterTable
          :title="String(name)"
          :rows="rows"
          :show-range="rows.some((r) => !!r.range)"
          :display-type="getMetadata(String(name)).displayType"
          :resolution="getMetadata(String(name)).resolution"
          :ucb1="getUcb(String(name)).ucb1"
          :ucb2="getUcb(String(name)).ucb2"
          :ucb3="getUcb(String(name)).ucb3"
        />
      </div>
    </div>

    <!-- 4. Summary Section -->
    <CalibrationSummary
      :custom-checklist="checklistItems"
      :inspector-name="task?.technician_name || task?.technician?.name || '-'"
      :inspector-role="task?.technician_position || task?.technician?.position || '-'"
    />
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

// Dynamic Data Grouping
const groupedQualitatives = computed(() => {
  const groups: Record<string, EkgItem[]> = {};
  (props.task?.qualitatives || []).forEach((q) => {
    const pName = q.parameter_name || 'พารามิเตอร์เชิงคุณภาพ';
    if (!groups[pName]) groups[pName] = [];
    groups[pName].push({
      id: String(q.id),
      label: q.item_name,
      status:
        q.result?.toUpperCase() === 'PASS'
          ? 'pass'
          : q.result?.toUpperCase() === 'FAIL'
            ? 'fail'
            : null,
    });
  });
  return groups;
});

const groupedMeasurements = computed(() => {
  const groups: Record<string, TestRow[]> = {};
  (props.task?.measurements || []).forEach((m) => {
    const pName = m.parameter_name;
    if (!groups[pName]) groups[pName] = [];
    groups[pName].push({
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
    });
  });
  return groups;
});

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

const checklistItems = computed(() => {
  const items: { label: string; icon: string; passed: boolean }[] = [];

  // Grouped results for checklist
  Object.entries(groupedQualitatives.value).forEach(([name, values]) => {
    const tested = values.filter((v) => v.status !== null);
    const passed = tested.length > 0 && tested.every((v) => v.status === 'pass');
    items.push({ label: name, icon: 'fact_check', passed });
  });

  Object.entries(groupedMeasurements.value).forEach(([name, rows]) => {
    const tested = rows.filter((r) => r.status !== null);
    const passed = tested.length > 0 && tested.every((r) => r.status === 'pass');
    items.push({ label: name, icon: 'analytics', passed });
  });

  return items;
});

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
