<script setup lang="ts">
import {  } from 'vue';

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

const stdTypeOptions = ['1 - แบบอ้างอิงเครื่องมือมาตรฐาน', '2 - แบบอื่นๆ'];
const displayOptions = ['Digital', 'Analog', 'None'];
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
          <div class="param-row">
            <span class="param-label">พารามิเตอร์</span>
            <q-input
              :model-value="data.parameter"
              @update:model-value="updateData({ parameter: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">หน่วย</span>
            <q-input
              :model-value="data.unit"
              @update:model-value="updateData({ unit: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">ค่าความคลาดเคลื่อน</span>
            <q-input
              :model-value="data.tolerance"
              @update:model-value="updateData({ tolerance: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">แบบฟอร์ม</span>
            <q-select
              :model-value="data.stdType"
              @update:model-value="updateData({ stdType: $event as string })"
              :options="stdTypeOptions"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">การแสดงผล (A/D)</span>
            <q-select
              :model-value="data.display"
              @update:model-value="updateData({ display: $event as string })"
              :options="displayOptions"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">ค่าความละเอียด (R)</span>
            <q-input
              :model-value="data.uncertainty"
              @update:model-value="updateData({ uncertainty: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">UCB1</span>
            <q-input
              :model-value="data.ucb1"
              @update:model-value="updateData({ ucb1: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">UCB2</span>
            <q-input
              :model-value="data.ucb2"
              @update:model-value="updateData({ ucb2: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
          <div class="param-row">
            <span class="param-label">UCB3</span>
            <q-input
              :model-value="data.ucb3"
              @update:model-value="updateData({ ucb3: $event as string })"
              borderless
              dense
              class="param-input"
            />
          </div>
        </div>
      </div>

      <!-- ── Right: Test Values ── -->
      <div class="col-12 col-md-5">
        <div class="test-values-box q-pa-md">
          <div class="text-subtitle2 text-weight-bold q-mb-md">ค่าทดสอบ</div>
          <div
            v-for="(val, idx) in data.testValues"
            :key="idx"
            class="test-value-row row items-center no-wrap q-mb-xs"
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
              input-class="text-right"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="xs"
              color="red-4"
              class="q-ml-xs"
              @click="removeTestValue(idx)"
            />
          </div>
          <div class="q-mt-sm">
            <q-btn
              flat
              dense
              icon="add"
              label="เพิ่มค่าทดสอบ"
              color="primary"
              size="sm"
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

/* ── Left table layout ── */
.param-table {
  width: 100%;
  display: table;
  border-collapse: collapse;
}

.param-row {
  display: table-row;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.param-label {
  display: table-cell;
  padding: 6px 16px 6px 0;
  color: #555;
  font-size: 13px;
  white-space: nowrap;
  vertical-align: middle;
  width: 44%;
}

.param-input {
  display: table-cell;
  width: 56%;
  vertical-align: middle;
  padding: 2px 0;
}

/* ── Right test values ── */
.test-values-box {
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #eee;
  min-height: 100%;
}

.test-value-row {
  border-bottom: 1px dashed #eee;
  padding: 4px 0;

  &:last-child {
    border-bottom: none;
  }
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffcc00;
  flex-shrink: 0;
}

.test-val-input {
  :deep(.q-field__control) {
    height: 28px;
    min-height: unset;
  }
}

:deep(.q-field--borderless .q-field__control:before) {
  border: none;
}
</style>
