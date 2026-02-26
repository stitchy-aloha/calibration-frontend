<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">เครื่องมือแพทย์</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลเครื่องมือแพทย์ทั้งหมดในระบบ</div>

    <!-- Filters -->
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
    </div>

    <!-- q-table -->
    <q-table
      :rows="store.filteredTools"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="tools-table"
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

      <!-- Custom body rows -->
      <template #body="props">
        <q-tr :props="props" class="table-body-row">
          <q-td key="id" :props="props" class="col-id">{{ props.row.id }}</q-td>
          <q-td key="name" :props="props" class="col-name">{{ props.row.name }}</q-td>
          <q-td key="model" :props="props">{{ props.row.model }}</q-td>
          <q-td key="type" :props="props">{{ props.row.type }}</q-td>
          <q-td key="calibrationCycle" :props="props" class="text-center">{{
            props.row.calibrationCycle
          }}</q-td>
          <q-td key="dueDate" :props="props" class="text-center">{{ props.row.dueDate }}</q-td>
          <q-td key="location" :props="props" class="text-center">{{ props.row.location }}</q-td>
          <q-td key="status" :props="props" class="text-center">
            <span class="status-badge" :class="statusClass(props.row.status)">
              {{ props.row.status }}
            </span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import SearchBar from 'src/components/SearchBar.vue';
import type { QTableProps } from 'quasar';
import { useToolsStore, type ToolStatus } from 'src/stores/tools';

const store = useToolsStore();

const columns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'รหัสเครื่องมือ',
    field: 'id',
    align: 'left',
    sortable: true,
    style: 'width: 120px; min-width: 120px',
  },
  {
    name: 'name',
    label: 'ชื่อเครื่องมือ',
    field: 'name',
    align: 'left',
    sortable: true,
    style: 'width: 200px; min-width: 160px',
  },
  {
    name: 'model',
    label: 'ชื่อรุ่น',
    field: 'model',
    align: 'left',
    sortable: true,
    style: 'width: 130px; min-width: 100px',
  },
  {
    name: 'type',
    label: 'ประเภท',
    field: 'type',
    align: 'left',
    sortable: true,
    style: 'width: 100px; min-width: 90px',
  },
  {
    name: 'calibrationCycle',
    label: 'รอบสอบเทียบ',
    field: 'calibrationCycle',
    align: 'center',
    sortable: false,
    style: 'width: 110px; min-width: 90px',
  },
  {
    name: 'dueDate',
    label: 'ครบกำหนด',
    field: 'dueDate',
    align: 'center',
    sortable: true,
    style: 'width: 120px; min-width: 100px',
  },
  {
    name: 'location',
    label: 'สถานที่',
    field: 'location',
    align: 'center',
    sortable: true,
    style: 'width: 80px;  min-width: 70px',
  },
  {
    name: 'status',
    label: 'สถานะ',
    field: 'status',
    align: 'center',
    sortable: true,
    style: 'width: 130px; min-width: 110px',
  },
];

function statusClass(status: ToolStatus): string {
  const map: Record<ToolStatus, string> = {
    พร้อมใช้งาน: 'status--ready',
    รอดำเนินการ: 'status--pending',
    ใกล้ครบกำหนด: 'status--warning',
    จำหน่ายแล้ว: 'status--sold',
    ซ่อมรุด: 'status--repair',
  };
  return map[status] ?? '';
}
</script>

<style scoped lang="scss">
/* ── Filters ─────────────────────────────────── */
.filters-row {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 260px;
}

.type-select {
  width: 180px;
}

/* ── Table ───────────────────────────────────── */
.tools-table {
  border-radius: 16px !important;
  overflow: hidden;

  /* Header */
  :deep(.table-header-row) {
    background: $secondary;
  }

  :deep(.table-th) {
    color: #fff !important;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
    white-space: nowrap;
    padding: 13px 16px;
  }

  /* Body rows */
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
  white-space: nowrap;
}

.col-name {
  font-weight: 500;
}

/* ── Status badges ───────────────────────────── */
.status-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  width: 70%;
}

.status--ready {
  background: rgba(20, 160, 1, 0.12);
  color: #14a001;
}

.status--pending {
  background: rgba($secondary, 0.15);
  color: $primary;
}

.status--warning {
  background: rgba(255, 152, 0, 0.14);
  color: #e65100;
}

.status--sold {
  background: rgba(0, 0, 0, 0.07);
  color: #6b7280;
}

.status--repair {
  background: rgba(255, 1, 1, 0.1);
  color: #ff0101;
}
</style>
