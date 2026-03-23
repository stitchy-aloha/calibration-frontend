<template>
  <!-- Title outside the table -->
  <div class="row items-center q-mb-sm">
    <div class="section-title">{{ title }}</div>
  </div>

  <!-- Parameter Metadata: Display Type and Resolution (Read-only) -->
  <div
    v-if="displayType || resolution"
    class="row q-gutter-x-md q-mb-sm text-grey-7 text-caption items-center q-pl-sm"
    style="margin-top: -4px"
  >
    <div v-if="displayType" class="row items-center">
      <span class="q-mr-xs">Display Type:</span>
      <span class="text-weight-bold text-grey-9 text-uppercase">{{ displayType }}</span>
    </div>
    <div v-if="resolution" class="row items-center">
      <span class="q-mr-xs">Resolution:</span>
      <span class="text-weight-bold text-grey-9">{{ resolution }}</span>
    </div>
  </div>

  <!-- UCB Values (Read-only) -->
  <div
    v-if="showUcb && (ucb1 !== undefined || ucb2 !== undefined || ucb3 !== undefined)"
    class="row q-gutter-x-lg q-mb-sm text-grey-7 text-caption items-center q-pl-sm"
  >
    <span v-if="ucb1 !== undefined"><strong class="text-grey-9">UCB1:</strong> {{ ucb1 }}</span>
    <span v-if="ucb2 !== undefined"><strong class="text-grey-9">UCB2:</strong> {{ ucb2 }}</span>
    <span v-if="ucb3 !== undefined"><strong class="text-grey-9">UCB3:</strong> {{ ucb3 }}</span>
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
    <!-- Custom header -->
    <template #header="headerProps">
      <q-tr :props="headerProps" class="table-header">
        <q-th
          v-for="col in headerProps.cols"
          :key="col.name"
          :props="headerProps"
          class="text-white text-center"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <!-- Custom body cells (read-only) -->
    <template #body="bodyProps">
      <q-tr :props="bodyProps">
        <!-- ช่วง -->
        <q-td v-if="showRange" key="range" :props="bodyProps" class="text-center text-grey-8">
          {{ bodyProps.row.range }}
        </q-td>

        <!-- ค่ามาตรฐาน -->
        <q-td key="standard" :props="bodyProps" class="text-center text-grey-8">
          {{ bodyProps.row.standard !== null ? bodyProps.row.standard : '-' }}
        </q-td>

        <!-- ครั้งที่ 1 -->
        <q-td key="val1" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val1 !== null ? bodyProps.row.val1 : '-' }}
        </q-td>

        <!-- ครั้งที่ 2 -->
        <q-td key="val2" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val2 !== null ? bodyProps.row.val2 : '-' }}
        </q-td>

        <!-- ครั้งที่ 3 -->
        <q-td key="val3" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val3 !== null ? bodyProps.row.val3 : '-' }}
        </q-td>

        <!-- ค่าเฉลี่ย -->
        <q-td key="average" :props="bodyProps" class="text-center text-weight-bold">
          {{ bodyProps.row.average !== null ? bodyProps.row.average : '-' }}
        </q-td>

        <!-- ค่าความคาดเคลื่อน -->
        <q-td key="error" :props="bodyProps" class="text-center text-weight-bold">
          <span :class="errorClass(bodyProps.row.error)">{{
            formatError(bodyProps.row.error)
          }}</span>
        </q-td>

        <!-- ผลการทดสอบ -->
        <q-td key="status" :props="bodyProps" class="text-center">
          <span v-if="bodyProps.row.status === 'pass'" class="status-badge status-badge--pass">
            <q-icon name="check_circle" size="14px" class="q-mr-xs" />ผ่าน
          </span>
          <span v-else-if="bodyProps.row.status === 'fail'" class="status-badge status-badge--fail">
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

<script setup lang="ts">
import { computed } from 'vue';
import type { QTableProps } from 'quasar';

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
  title: string;
  rows: TestRow[];
  showRange?: boolean;
  showUcb?: boolean;
  displayType?: string;
  resolution?: string;
  ucb1?: number | string | undefined;
  ucb2?: number | string | undefined;
  ucb3?: number | string | undefined;
}>();

const showRange = computed(() => props.showRange !== false);

const allColumns: QTableProps['columns'] = [
  { name: 'range', label: 'ช่วง', field: 'range', align: 'center' },
  { name: 'standard', label: 'STD', field: 'standard', align: 'center' },
  { name: 'val1', label: 'UUC-1', field: 'val1', align: 'center' },
  { name: 'val2', label: 'UUC-2', field: 'val2', align: 'center' },
  { name: 'val3', label: 'UUC-3', field: 'val3', align: 'center' },
  { name: 'average', label: 'Mean', field: 'average', align: 'center' },
  { name: 'error', label: 'Error', field: 'error', align: 'center' },
  { name: 'status', label: 'Result', field: 'status', align: 'center' },
];

const visibleColumns = computed(() =>
  showRange.value ? allColumns : allColumns.filter((c) => c.name !== 'range'),
);

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
