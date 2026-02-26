<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">บันทึกการสอบเทียบ</div>
    <div class="text-caption text-grey-6 q-mb-md">บันทึกผลการตรวจสอบและสอบเทียบเครื่องมือแพทย์</div>

    <!-- Filters + View Toggle -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="store.searchQuery" placeholder="ค้นหาเครื่องมือแพทย์" />

      <q-select
        v-model="store.selectedType"
        :options="store.typeOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        outlined
        dense
        label="ประเภท"
        class="type-select"
        bg-color="white"
      />

      <!-- View Toggle Buttons -->
      <div class="view-toggle q-ml-auto">
        <q-btn
          flat
          dense
          :icon="'format_list_bulleted'"
          :class="['toggle-btn', viewMode === 'table' ? 'toggle-btn--active' : '']"
          @click="viewMode = 'table'"
        />
        <q-btn
          flat
          dense
          icon="grid_view"
          :class="['toggle-btn', viewMode === 'card' ? 'toggle-btn--active' : '']"
          @click="viewMode = 'card'"
        />
      </div>
    </div>

    <!-- ── Table View ─────────────────────────────── -->
    <template v-if="viewMode === 'table'">
      <q-table
        :rows="store.filteredRecords"
        :columns="columns"
        row-key="id"
        flat
        bordered
        class="cal-table"
        :rows-per-page-options="[10, 20, 50]"
        no-data-label="ไม่พบข้อมูล"
      >
        <!-- Custom header -->
        <template #header="props">
          <q-tr :props="props" class="table-header-row">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-th">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom body -->
        <template #body="props">
          <q-tr :props="props" class="table-body-row">
            <q-td key="id" :props="props" class="col-id">{{ props.row.id }}</q-td>
            <q-td key="deviceName" :props="props">{{ props.row.deviceName }}</q-td>
            <q-td key="deviceCode" :props="props">{{ props.row.deviceCode }}</q-td>
            <q-td key="location" :props="props" class="text-center">{{ props.row.location }}</q-td>
            <q-td key="type" :props="props" class="text-center">{{ props.row.type }}</q-td>
            <q-td key="dueDate" :props="props" class="text-center">{{ props.row.dueDate }}</q-td>
            <q-td key="responsible" :props="props">{{ props.row.responsible }}</q-td>
            <q-td key="action" :props="props" class="text-center">
              <q-btn
                unelevated
                size="sm"
                :class="[
                  'action-btn',
                  isOwner(props.row.responsible) ? 'action-btn--active' : 'action-btn--disabled',
                ]"
                label="เริ่มการสอบเทียบ"
                :disable="!isOwner(props.row.responsible)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>

    <!-- ── Card View ──────────────────────────────── -->
    <template v-else>
      <div class="card-grid">
        <CalibrationCard
          v-for="record in store.filteredRecords"
          :key="record.id"
          :record="record"
          :is-owner="isOwner(record.responsible)"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableProps } from 'quasar';
import SearchBar from 'src/components/SearchBar.vue';
import CalibrationCard from 'src/components/calibration/CalibrationCard.vue';
import { useCalibrationStore } from 'src/stores/calibration';
import { useAuthStore } from 'src/stores/auth';

const store = useCalibrationStore();
const auth = useAuthStore();
const viewMode = ref<'table' | 'card'>('table');

/** Returns true when the logged-in user is the responsible person for a record */
function isOwner(responsible: string): boolean {
  return auth.user?.fullName === responsible;
}

const columns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'รหัสสอบเทียบ',
    field: 'id',
    align: 'left',
    sortable: true,
    style: 'width: 120px',
  },
  {
    name: 'deviceName',
    label: 'ชื่อเครื่องมือ',
    field: 'deviceName',
    align: 'left',
    sortable: true,
  },
  { name: 'deviceCode', label: 'รหัสเครื่อง', field: 'deviceCode', align: 'left', sortable: true },
  {
    name: 'location',
    label: 'ที่ตั้ง',
    field: 'location',
    align: 'center',
    sortable: true,
    style: 'width: 90px',
  },
  {
    name: 'type',
    label: 'ประเภท',
    field: 'type',
    align: 'center',
    sortable: true,
    style: 'width: 100px',
  },
  {
    name: 'dueDate',
    label: 'ครบกำหนด',
    field: 'dueDate',
    align: 'center',
    sortable: true,
    style: 'width: 120px',
  },
  { name: 'responsible', label: 'ผู้รับผิดชอบ', field: 'responsible', align: 'left' },
  { name: 'action', label: '', field: 'id', align: 'center', style: 'width: 160px' },
];
</script>

<style scoped lang="scss">
/* ── Filters row ──────────────────────────── */
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.type-select {
  width: 180px;
}

/* ── View toggle buttons ──────────────────── */
.view-toggle {
  display: flex;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.toggle-btn {
  padding: 6px 14px;
  border-radius: 0;
  color: #aaa;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &--active {
    background: $primary !important;
    color: #fff !important;
  }

  &:hover:not(.toggle-btn--active) {
    background: #f4f4f8 !important;
    color: #555 !important;
  }
}

/* ── Table ───────────────────────────────── */
.cal-table {
  border-radius: 16px !important;
  overflow: hidden;

  :deep(.table-header-row) {
    background: $secondary;
  }

  :deep(.table-th) {
    color: #fff !important;
    font-weight: 600;
    font-size: 14px;
    padding: 13px 16px;
    white-space: nowrap;
  }

  :deep(.table-body-row) {
    transition: background 0.12s ease;

    td {
      padding: 12px 16px;
      font-size: 13.5px;
    }

    &:hover td {
      background: #fafbff !important;
    }
  }
}

.col-id {
  font-weight: 600;
  color: #1a1a2e;
}

/* ── Action button in table ───────────────── */
.action-btn {
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
}

.action-btn--active {
  background: $primary !important;
  color: #fff !important;
}

.action-btn--disabled {
  background: #d9d9d9 !important;
  color: #888 !important;
}

/* ── Card grid ────────────────────────────── */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}
</style>
