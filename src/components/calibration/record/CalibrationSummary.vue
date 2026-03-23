<template>
  <div class="summary-wrapper q-mt-xl">
    <!-- Section Header Bar (matches other section dividers in the page) -->
    <q-card
      flat
      class="section-bar q-py-sm q-mb-lg text-center text-white text-subtitle1 text-weight-bold"
      style="border-radius: 4px"
    >
      สรุปผล
    </q-card>

    <!-- Two-column layout: Left = Inspector + Button, Right = Checklist -->
    <div class="row q-col-gutter-xl items-start">
      <!-- LEFT: Inspector card + Confirm button -->
      <div class="col-12 col-md-5">
        <InspectorCard v-bind="inspectorName ? { inspectorName, inspectorRole } : {}" />

        <!-- Big confirm/save button -->
        <template v-if="allPassed">
          <q-btn
            unelevated
            color="positive"
            icon="check_circle"
            label="ผ่าน"
            class="confirm-btn q-mt-md"
            no-caps
          />
        </template>
        <template v-else>
          <div class="result-fail q-mt-md">
            <q-icon name="cancel" size="22px" class="q-mr-sm" />
            ไม่ผ่าน
          </div>
        </template>
      </div>

      <!-- RIGHT: Checklist -->
      <div class="col-12 col-md-7">
        <div class="checklist">
          <div
            v-for="item in checklistItems"
            :key="'key' in item ? item.key : item.label"
            class="checklist-item"
          >
            <q-icon :name="item.icon" size="18px" color="grey-6" class="q-mr-sm" />
            <span class="checklist-item__label">{{ item.label }}</span>
            <q-space />
            <q-icon
              :name="item.passed ? 'check_circle' : 'cancel'"
              :color="item.passed ? 'positive' : 'negative'"
              size="22px"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Confirmation Dialog -->
    <SaveConfirmDialog v-model="showSaveDialog" @confirm="onConfirmSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import InspectorCard from './InspectorCard.vue';
import SaveConfirmDialog from './SaveConfirmDialog.vue';

interface TestRow {
  status: 'pass' | 'fail' | null;
}

interface EkgItem {
  status: 'pass' | 'fail' | null;
}

const props = withDefaults(
  defineProps<{
    ekgItems?: EkgItem[];
    systolicData?: TestRow[];
    diastolicData?: TestRow[];
    tempData?: TestRow[];
    heartRateData?: TestRow[];
    spo2Data?: TestRow[];
    inspectorName?: string;
    inspectorRole?: string;
    customChecklist?: { key?: string; label: string; icon: string; passed: boolean }[];
  }>(),
  {
    ekgItems: () => [],
    systolicData: () => [],
    diastolicData: () => [],
    tempData: () => [],
    heartRateData: () => [],
    spo2Data: () => [],
  },
);

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const ekgPassed = computed(() => {
  const tested = props.ekgItems.filter((i) => i.status !== null);
  return tested.length > 0 && tested.every((i) => i.status === 'pass');
});

const tablePassed = (rows: TestRow[]): boolean => {
  const tested = rows.filter((r) => r.status !== null);
  return tested.length > 0 && tested.every((r) => r.status === 'pass');
};

const checklistItems = computed(
  () =>
    props.customChecklist ?? [
      { key: 'ekg', label: 'EKG', icon: 'monitor_heart', passed: ekgPassed.value },
      {
        key: 'systolic',
        label: 'Systolic Pressure',
        icon: 'speed',
        passed: tablePassed(props.systolicData),
      },
      {
        key: 'diastolic',
        label: 'Diastolic Pressure',
        icon: 'speed',
        passed: tablePassed(props.diastolicData),
      },
      {
        key: 'temp',
        label: 'Temp',
        icon: 'device_thermostat',
        passed: tablePassed(props.tempData),
      },
      {
        key: 'heartRate',
        label: 'Heart Rate',
        icon: 'favorite',
        passed: tablePassed(props.heartRateData),
      },
      { key: 'spo2', label: 'SPO2', icon: 'app:med', passed: tablePassed(props.spo2Data) },
    ],
);

const allPassed = computed(() => checklistItems.value.every((i) => i.passed));

const showSaveDialog = ref(false);

const onConfirmSave = () => {
  emit('save');
};
</script>

<style scoped lang="scss">
.summary-wrapper {
  margin-bottom: 40px;
}

.section-bar {
  background-color: $secondary !important;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checklist-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  background: #f7f7f9;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  &__label {
    flex: 1;
  }
}

.confirm-btn {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 10px !important;
  letter-spacing: 0.5px;
}

.result-fail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 10px;
  background: rgba($negative, 0.1);
  border: 2px solid rgba($negative, 0.35);
  color: $negative;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>
