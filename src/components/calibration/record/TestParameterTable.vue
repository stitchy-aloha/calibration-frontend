<template>
  <!-- Title and add button OUTSIDE the card border -->
  <div class="row justify-between items-center q-mb-sm">
    <div class="section-title">{{ title }}</div>
    <q-btn flat dense no-caps icon="add" label="เพิ่มพารามิเตอร์" @click="addRow" class="btn" />
  </div>

  <q-table
    :rows="rows"
    :columns="visibleColumns"
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
        <!-- Trash column header placeholder -->
        <q-th class="text-white text-center" style="width: 48px"></q-th>
      </q-tr>
    </template>

    <!-- Custom body cells -->
    <template #body="props">
      <q-tr :props="props" class="param-row" @click="toggleActiveRow(props.rowIndex)">
        <!-- ช่วง: double-click to edit inline (only shown when showRange is true) -->
        <q-td
          v-if="showRange"
          key="range"
          :props="props"
          class="text-center"
          @dblclick.stop="startEdit(props.rowIndex)"
        >
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
            @click.stop
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
            @click.stop
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
            @click.stop
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
            @click.stop
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

        <!-- Trash icon column -->
        <q-td class="text-center" style="width: 48px">
          <transition name="fade">
            <q-btn
              v-if="activeRowIndex === props.rowIndex"
              flat
              round
              dense
              icon="delete"
              color="negative"
              size="md"
              @click.stop="openDeleteDialog(props.rowIndex)"
            >
              <q-tooltip>ลบแถวนี้</q-tooltip>
            </q-btn>
          </transition>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <DeleteConfirmDialog v-model="showDeleteDialog" @confirm="confirmDelete" />
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
import { ref, watch, onMounted, computed } from 'vue';
import type { QTableProps } from 'quasar';
import DeleteConfirmDialog from './DeleteConfirmDialog.vue';

const props = defineProps<{
  title: string;
  modelValue: TestRow[];
  showRange?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TestRow[]): void;
}>();

const showRange = computed(() => props.showRange !== false);

const allColumns: QTableProps['columns'] = [
  { name: 'standard', label: 'ค่ามาตรฐาน', field: 'standard', align: 'center' },
  { name: 'val1', label: 'ครั้งที่ 1', field: 'val1', align: 'center' },
  { name: 'val2', label: 'ครั้งที่ 2', field: 'val2', align: 'center' },
  { name: 'val3', label: 'ครั้งที่ 3', field: 'val3', align: 'center' },
  { name: 'average', label: 'ค่าเฉลี่ย', field: 'average', align: 'center' },
  { name: 'error', label: 'ค่าความคาดเคลื่อน', field: 'error', align: 'center' },
  { name: 'status', label: 'ผลการทดสอบ', field: 'status', align: 'center' },
];

const visibleColumns = computed(() =>
  showRange.value ? allColumns : allColumns.filter((c) => c.name !== 'range'),
);

const rows = ref<TestRow[]>([]);
const editingRowIndex = ref<number | null>(null);
const activeRowIndex = ref<number | null>(null);
const showDeleteDialog = ref(false);
const rowToDeleteIndex = ref<number | null>(null);

const startEdit = (index: number) => {
  editingRowIndex.value = index;
};

const toggleActiveRow = (index: number) => {
  activeRowIndex.value = activeRowIndex.value === index ? null : index;
};

const openDeleteDialog = (index: number) => {
  rowToDeleteIndex.value = index;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (rowToDeleteIndex.value !== null) {
    deleteRow(rowToDeleteIndex.value);
    rowToDeleteIndex.value = null;
  }
};

const deleteRow = (index: number) => {
  rows.value.splice(index, 1);
  activeRowIndex.value = null;
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
  color: white;
  width: 150px;
}

.param-row {
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba($secondary, 0.06);
  }
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

// Fade transition for trash icon
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
