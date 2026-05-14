<script setup lang="ts">
import {} from 'vue';

interface TestValue {
  label: string;
  value: number;
}

interface QuantData {
  parameter: string;
  unit: string;
  tolerance: string;
  stdType: string;
  display: string;
  uncertainty: string;
  ucb1: string;
  ucb2: string;
  ucb3: string;
  testValues: TestValue[];
}

const props = defineProps<{
  index: number;
  data: QuantData;
  showUcb?: boolean;
}>();

const emit = defineEmits<{
  (e: 'remove'): void;
  (e: 'update:data', val: QuantData): void;
}>();

function updateData(patch: Partial<QuantData>) {
  emit('update:data', { ...props.data, ...patch });
}

function addTestValue() {
  const nextIdx = props.data.testValues.length + 1;
  const newItems = [...props.data.testValues, { label: `ค่าทดสอบที่ ${nextIdx}`, value: 0 }];
  updateData({ testValues: newItems });
}

function removeTestValue(idx: number) {
  const newItems = props.data.testValues.filter((_, i) => i !== idx);
  updateData({ testValues: newItems });
}

function updateTestValue(idx: number, patch: Partial<TestValue>) {
  const newItems = props.data.testValues.map((item, i) =>
    i === idx ? { ...item, ...patch } : item,
  );
  updateData({ testValues: newItems });
}

const stdTypeOptions = [
  '1 - แบบอ้างอิงเครื่องมาตรฐาน (1 STD : 3 UUT)',
  '2 - แบบอ้างอิงเครื่องถูกสอบ (1 UUT : 3 STD)',
  '3 - แบบจับคู่วัดหลายตำแหน่ง (Multi-Point)',
];
const displayOptions = ['Digital', 'Analog'];
</script>

<template>
  <div class="quant-card q-mb-md">
    <!-- Card header row: index + close -->
    <div class="row items-center q-mb-md">
      <div class="index-circle q-mr-md">{{ index }}</div>
      <q-space />
      <q-btn flat round dense icon="close" size="sm" color="grey-5" @click="emit('remove')" />
    </div>

    <div class="row q-col-gutter-xl">
      <!-- ── Left: Parameter Info Table ── -->
      <div class="col-12 col-md-7">
        <div class="param-table">
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">พารามิเตอร์</span>
            <q-input
              :model-value="data.parameter"
              @update:model-value="updateData({ parameter: $event as string })"
              outlined
              dense
              class="param-input col-7"
            />
          </div>
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">หน่วย</span>
            <q-input
              :model-value="data.unit"
              @update:model-value="updateData({ unit: $event as string })"
              outlined
              dense
              class="param-input col-7"
            />
          </div>
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">ค่าความคลาดเคลื่อน</span>
            <q-input
              :model-value="data.tolerance"
              @update:model-value="updateData({ tolerance: $event as string })"
              outlined
              dense
              class="param-input col-7"
            />
          </div>
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">แบบฟอร์ม</span>
            <q-select
              :model-value="data.stdType"
              @update:model-value="updateData({ stdType: $event as string })"
              :options="stdTypeOptions"
              outlined
              dense
              class="param-input col-7"
            />
          </div>
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">การแสดงผล (A/D)</span>
            <q-select
              :model-value="data.display"
              @update:model-value="updateData({ display: $event as string })"
              :options="displayOptions"
              outlined
              dense
              class="param-input col-7"
            />
          </div>
          <div class="param-row row items-center no-wrap">
            <span class="param-label col-5">ค่าความละเอียด (R)</span>
            <q-input
              :model-value="data.uncertainty"
              @update:model-value="updateData({ uncertainty: $event as string })"
              outlined
              dense
              class="param-input col-7"
            />
          </div>

          <!-- Conditional UCb Fields -->
          <template v-if="showUcb">
            <div class="param-row row items-center no-wrap">
              <span class="param-label col-5">UCB1</span>
              <q-input
                :model-value="data.ucb1"
                @update:model-value="updateData({ ucb1: $event as string })"
                outlined
                dense
                class="param-input col-7"
              />
            </div>
            <div class="param-row row items-center no-wrap">
              <span class="param-label col-5">UCB2</span>
              <q-input
                :model-value="data.ucb2"
                @update:model-value="updateData({ ucb2: $event as string })"
                outlined
                dense
                class="param-input col-7"
              />
            </div>
            <div class="param-row row items-center no-wrap">
              <span class="param-label col-5">UCB3</span>
              <q-input
                :model-value="data.ucb3"
                @update:model-value="updateData({ ucb3: $event as string })"
                outlined
                dense
                class="param-input col-7"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- ── Right: Test Values ── -->
      <div class="col-12 col-md-5">
        <div class="test-values-box">
          <div class="test-header row justify-center items-center">ค่าทดสอบ</div>
          <div class="test-content q-pa-sm">
            <div
              v-for="(val, idx) in data.testValues"
              :key="idx"
              class="test-value-row row items-center no-wrap"
            >
              <div class="dot q-mr-sm"></div>
              <span class="text-caption text-grey-8 col-5">{{ val.label }}</span>
              <q-input
                :model-value="val.value"
                @update:model-value="updateTestValue(idx, { value: Number($event) })"
                dense
                borderless
                type="number"
                class="col test-val-input"
                input-class="text-right text-weight-bold"
              />
              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                size="sm"
                color="red-5"
                class="q-ml-sm"
                @click="removeTestValue(idx)"
              />
            </div>
          </div>
          <div class="test-footer row justify-center">
            <q-btn
              flat
              dense
              icon="add"
              label="เพิ่มค่าทดสอบ"
              class="btn-add-test"
              @click="addTestValue"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quant-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
}

.index-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $secondary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
}

/* ── Left form layout ── */
.param-table {
  width: 100%;
}

.param-row {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.param-label {
  color: #334155;
  font-size: 13.5px;
  font-weight: 500;
  padding-right: 16px;
}

.param-input {
  :deep(.q-field__control) {
    border-radius: 8px;
    background: #fff;
  }
}

/* ── Right test values ── */
.test-values-box {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e0e6ed;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.test-header {
  height: 48px;
  border-bottom: 1px solid #f0f4f8;
  color: $secondary;
  font-weight: 700;
  font-size: 15px;
}

.test-content {
  flex-grow: 1;
}

.test-value-row {
  border-bottom: 1px solid #f8fafc;
  padding: 8px 12px;

  &:last-child {
    border-bottom: none;
  }
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ffd600;
  flex-shrink: 0;
  box-shadow: 0 0 4px rgba(255, 214, 0, 0.4);
}

.test-footer {
  padding: 12px;
  border-top: 1px solid #f0f4f8;
}

.btn-add-test {
  color: $secondary;
  font-size: 13px;
  font-weight: 600;
  text-transform: none;

  :deep(.q-icon) {
    font-size: 18px;
    margin-right: 4px;
  }
}

.test-val-input {
  :deep(.q-field__control) {
    height: 32px;
    min-height: unset;
  }
  :deep(input) {
    font-size: 14px;
    color: #334155;
  }
}

:deep(.q-field--borderless .q-field__control:before) {
  border: none;
}
</style>
