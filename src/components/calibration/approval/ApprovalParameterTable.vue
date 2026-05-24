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


        <!-- ค่ามาตรฐาน -->
        <q-td v-if="!isMode4" key="standard" :bodyProps="bodyProps" class="text-center text-grey-8">
          {{ bodyProps.row.standard !== null ? bodyProps.row.standard : '-' }}
        </q-td>

        <!-- ครั้งที่ 1 -->
        <q-td key="val1" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val1 !== null ? bodyProps.row.val1 : '-' }}
        </q-td>

        <!-- STD 1 (Only in Mode 4) -->
        <q-td v-if="isMode4" key="stdVal1" :props="bodyProps" class="text-center">
          {{ bodyProps.row.stdVal1 !== null && bodyProps.row.stdVal1 !== undefined ? bodyProps.row.stdVal1 : '-' }}
        </q-td>

        <!-- ครั้งที่ 2 -->
        <q-td key="val2" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val2 !== null ? bodyProps.row.val2 : '-' }}
        </q-td>

        <!-- STD 2 (Only in Mode 4) -->
        <q-td v-if="isMode4" key="stdVal2" :props="bodyProps" class="text-center">
          {{ bodyProps.row.stdVal2 !== null && bodyProps.row.stdVal2 !== undefined ? bodyProps.row.stdVal2 : '-' }}
        </q-td>

        <!-- ครั้งที่ 3 -->
        <q-td key="val3" :props="bodyProps" class="text-center">
          {{ bodyProps.row.val3 !== null ? bodyProps.row.val3 : '-' }}
        </q-td>

        <!-- STD 3 (Only in Mode 4) -->
        <q-td v-if="isMode4" key="stdVal3" :props="bodyProps" class="text-center">
          {{ bodyProps.row.stdVal3 !== null && bodyProps.row.stdVal3 !== undefined ? bodyProps.row.stdVal3 : '-' }}
        </q-td>

        <!-- ค่าเฉลี่ย -->
        <q-td key="average" :props="bodyProps" class="text-center text-weight-bold">
          {{ bodyProps.row.average !== null ? bodyProps.row.average : '-' }}
        </q-td>

        <!-- ค่าเฉลี่ยมาตรฐาน (Mean-S) (Only in Mode 4) -->
        <q-td v-if="isMode4" key="averageStd" :props="bodyProps" class="text-center text-weight-bold">
          {{ bodyProps.row.averageStd !== null && bodyProps.row.averageStd !== undefined ? bodyProps.row.averageStd : '-' }}
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
import { computed, watch } from 'vue';
import type { QTableProps } from 'quasar';

interface TestRow {
  range: string;
  standard: number | null;
  val1: number | null;
  val2: number | null;
  val3: number | null;
  stdVal1?: number | null;
  stdVal2?: number | null;
  stdVal3?: number | null;
  average: number | null;
  averageStd?: number | null;
  error: number | null;
  status: 'pass' | 'fail' | null;
  std_type?: string | undefined;
}

const props = defineProps<{
  title: string;
  rows: TestRow[];
  showRange?: boolean;
  displayType?: string;
  resolution?: string;
  stdType?: string | undefined;
}>();

watch(
  () => props.stdType,
  (newVal) => {
    console.log(`[ApprovalParameterTable] stdType prop changed:`, newVal);
  },
  { immediate: true },
);


const isMode4 = computed(() => {
  return (
    props.stdType?.includes('4') ||
    props.stdType?.includes('3 UUC') ||
    props.stdType?.includes('3 UUC : 3 STD')
  );
});

const allColumns = computed<QTableProps['columns']>(() => {
  const isMode2 =
    props.stdType?.includes('2') &&
    (props.stdType?.includes('UUC') || props.stdType?.includes('STD'));

  const cols: QTableProps['columns'] = [];

  if (isMode4.value) {
    cols.push(
      { name: 'val1', label: 'UUC-1', field: 'val1', align: 'center' },
      { name: 'stdVal1', label: 'STD-1', field: 'stdVal1', align: 'center' },
      { name: 'val2', label: 'UUC-2', field: 'val2', align: 'center' },
      { name: 'stdVal2', label: 'STD-2', field: 'stdVal2', align: 'center' },
      { name: 'val3', label: 'UUC-3', field: 'val3', align: 'center' },
      { name: 'stdVal3', label: 'STD-3', field: 'stdVal3', align: 'center' },
      { name: 'average', label: 'Mean-U', field: 'average', align: 'center' },
      { name: 'averageStd', label: 'Mean-S', field: 'averageStd', align: 'center' },
      { name: 'error', label: 'Error', field: 'error', align: 'center' },
      { name: 'status', label: 'Result', field: 'status', align: 'center' },
    );
  } else {
    cols.push(
      {
        name: 'standard',
        label: isMode2 ? 'UUC Setting' : 'STD Setting',
        field: 'standard',
        align: 'center',
      },
      {
        name: 'val1',
        label: isMode2 ? 'STD-1' : 'UUC-1',
        field: 'val1',
        align: 'center',
      },
      {
        name: 'val2',
        label: isMode2 ? 'STD-2' : 'UUC-2',
        field: 'val2',
        align: 'center',
      },
      {
        name: 'val3',
        label: isMode2 ? 'STD-3' : 'UUC-3',
        field: 'val3',
        align: 'center',
      },
      { name: 'average', label: 'Mean', field: 'average', align: 'center' },
      { name: 'error', label: 'Error', field: 'error', align: 'center' },
      { name: 'status', label: 'Result', field: 'status', align: 'center' },
    );
  }

  return cols;
});

const visibleColumns = computed(() => allColumns.value);

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
