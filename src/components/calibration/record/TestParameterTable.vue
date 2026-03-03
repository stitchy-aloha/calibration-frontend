<template>
  <!-- Title and add button OUTSIDE the card border -->
  <div class="row justify-between items-center q-mb-sm">
    <div class="section-title">{{ title }}</div>
    <q-btn flat dense no-caps icon="add" label="เพิ่มพารามิเตอร์" @click="addRow" class="btn" />
  </div>

  <q-table
    :rows="rows"
    :columns="columns"
    row-key="range"
    flat
    bordered
    dense
    hide-bottom
    class="param-table q-mb-xl"
    :rows-per-page-options="[0]"
  >
    <!-- Custom header with secondary color -->
    <template #header="props">
      <q-tr :props="props" class="table-header">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-white text-center"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <!-- Custom body cells -->
    <template #body="props">
      <q-tr :props="props">
        <!-- ช่วง: double-click to edit inline -->
        <q-td key="range" :props="props" class="text-center" @dblclick="startEdit(props.rowIndex)">
          <q-input
            v-if="editingRowIndex === props.rowIndex"
            v-model="props.row.range"
            dense
            outlined
            autofocus
            input-class="text-center"
            style="min-width: 80px"
            @blur="editingRowIndex = null"
            @keyup.enter="editingRowIndex = null"
          />
          <span v-else class="cursor-pointer" style="user-select: none">
            {{ props.row.range }}
            <q-tooltip>ดับเบิ้ลคลิกเพื่อแก้ไข</q-tooltip>
          </span>
        </q-td>

        <!-- ค่ามาตรฐาน: read-only -->
        <q-td key="standard" :props="props" class="text-center text-grey-8">
          {{ props.row.standard !== null ? props.row.standard : '-' }}
        </q-td>

        <!-- ครั้งที่ 1 -->
        <q-td key="val1" :props="props">
          <q-input
            v-model.number="props.row.val1"
            type="number"
            outlined
            dense
            bg-color="white"
            input-class="text-center"
            style="min-width: 70px"
            @update:model-value="calculate(props.rowIndex)"
          />
        </q-td>

        <!-- ครั้งที่ 2 -->
        <q-td key="val2" :props="props">
          <q-input
            v-model.number="props.row.val2"
            type="number"
            outlined
            dense
            bg-color="white"
            input-class="text-center"
            style="min-width: 70px"
            @update:model-value="calculate(props.rowIndex)"
          />
        </q-td>

        <!-- ครั้งที่ 3 -->
        <q-td key="val3" :props="props">
          <q-input
            v-model.number="props.row.val3"
            type="number"
            outlined
            dense
            bg-color="white"
            input-class="text-center"
            style="min-width: 70px"
            @update:model-value="calculate(props.rowIndex)"
          />
        </q-td>

        <!-- ค่าเฉลี่ย -->
        <q-td key="average" :props="props" class="text-center text-weight-bold">
          {{ props.row.average !== null ? props.row.average : '-' }}
        </q-td>

        <!-- ค่าความคาดเคลื่อน -->
        <q-td key="error" :props="props" class="text-center text-weight-bold">
          <span :class="errorClass(props.row.error)">
            {{ formatError(props.row.error) }}
          </span>
        </q-td>

        <!-- ผลการทดสอบ -->
        <q-td key="status" :props="props" class="text-center">
          <span v-if="props.row.status === 'pass'" class="status-badge status-badge--pass">
            <q-icon name="check_circle" size="14px" class="q-mr-xs" />ผ่าน
          </span>
          <span v-else-if="props.row.status === 'fail'" class="status-badge status-badge--fail">
            <q-icon name="cancel" size="14px" class="q-mr-xs" />ไม่ผ่าน
          </span>
          <span v-else class="status-badge status-badge--pending">
            <q-icon name="schedule" size="14px" class="q-mr-xs" />รอดำเนินการ
          </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
export interface TestRow {
  range: string;
  standard: number | null;
  val1: number | null;
  val2: number | null;
  val3: number | null;
  average: number | null;
  error: number | null;
  status: 'pass' | 'fail' | null;
}
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { QTableProps } from 'quasar';

const props = defineProps<{
  title: string;
  modelValue: TestRow[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TestRow[]): void;
}>();

const columns: QTableProps['columns'] = [
  { name: 'range', label: 'ช่วง', field: 'range', align: 'center' },
  { name: 'standard', label: 'ค่ามาตรฐาน', field: 'standard', align: 'center' },
  { name: 'val1', label: 'ครั้งที่ 1', field: 'val1', align: 'center' },
  { name: 'val2', label: 'ครั้งที่ 2', field: 'val2', align: 'center' },
  { name: 'val3', label: 'ครั้งที่ 3', field: 'val3', align: 'center' },
  { name: 'average', label: 'ค่าเฉลี่ย', field: 'average', align: 'center' },
  { name: 'error', label: 'ค่าความคาดเคลื่อน', field: 'error', align: 'center' },
  { name: 'status', label: 'ผลการทดสอบ', field: 'status', align: 'center' },
];

const rows = ref<TestRow[]>([]);
const editingRowIndex = ref<number | null>(null);

const startEdit = (index: number) => {
  editingRowIndex.value = index;
};

onMounted(() => {
  rows.value = JSON.parse(JSON.stringify(props.modelValue)) as TestRow[];
});

watch(
  rows,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
  { deep: true },
);

const calculate = (index: number) => {
  const row = rows.value[index];
  if (!row) return;

  if (row.val1 !== null && row.val2 !== null && row.val3 !== null) {
    const avg = (row.val1 + row.val2 + row.val3) / 3;
    row.average = Number(avg.toFixed(1));

    if (row.standard !== null) {
      const err = row.average - row.standard;
      row.error = Number(err.toFixed(1));
      // Pass/Fail: within ±2 of standard
      row.status = Math.abs(row.error) <= 2 ? 'pass' : 'fail';
    } else {
      row.error = null;
      row.status = null;
    }
  } else {
    row.average = null;
    row.error = null;
    row.status = null;
  }
};

const addRow = () => {
  rows.value.push({
    range: 'กำหนดเอง',
    standard: null,
    val1: null,
    val2: null,
    val3: null,
    average: null,
    error: null,
    status: null,
  });
};

const errorClass = (error: number | null): string => {
  if (error === null) return '';
  if (error > 0) return 'text-positive';
  if (error < 0) return 'text-negative';
  return '';
};

const formatError = (error: number | null): string => {
  if (error === null) return '-';
  return (error > 0 ? '+' : '') + error;
};
</script>

<style scoped lang="scss">
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid $secondary;
  padding-left: 10px;
}

.param-table {
  border-radius: 8px;
  overflow: hidden;
}

// Override q-table header with secondary color
.param-table :deep(.table-header) {
  background-color: $secondary !important;
}

.param-table :deep(.table-header th) {
  color: #fff !important;
  font-weight: 600;
  font-size: 13px;
  background-color: $secondary !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
.btn {
  background-color: $secondary;
  color: #412c67;
  width: 150px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid;
  white-space: nowrap;
  width: 100px;
  justify-content: center;
  height: 30px;

  &--pass {
    background: #fff;
    color: $positive;
    border-color: $positive;
  }

  &--fail {
    background: #fff;
    color: $negative;
    border-color: $negative;
  }

  &--pending {
    background: #fff;
    color: #999;
    border-color: #ccc;
  }
}
</style>
