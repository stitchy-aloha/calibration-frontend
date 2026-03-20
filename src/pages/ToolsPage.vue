<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">เครื่องมือแพทย์</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลเครื่องมือแพทย์ทั้งหมดในระบบ</div>

    <!-- Filters -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="searchQuery" placeholder="ค้นหาเครื่องมือแพทย์" />

      <q-select
        v-model="selectedType"
        :options="typeOptions"
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

      <!-- Admin: add button -->
      <q-btn
        v-if="isAdmin"
        unelevated
        label="เพิ่มเครื่องมือ"
        icon="add"
        class="btn-add q-ml-auto"
        @click="openAdd"
      />
    </div>

    <!-- q-table -->
    <q-table
      :rows="filteredTools"
      :columns="tableColumns"
      row-key="id"
      flat
      bordered
      wrap-cells
      class="tools-table"
      :rows-per-page-options="[10, 20, 50]"
      no-data-label="ไม่พบข้อมูล"
      :loading="loading"
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
          <q-td key="riskLevel" :props="props" class="text-center">
            <div :class="['risk-badge', `risk--${props.row.riskLevel}`]">
              {{
                props.row.riskLevel === 'high'
                  ? 'สูง'
                  : props.row.riskLevel === 'medium'
                    ? 'กลาง'
                    : props.row.riskLevel === 'low'
                      ? 'ต่ำ'
                      : '-'
              }}
            </div>
          </q-td>
          <q-td key="calibrationCycle" :props="props" class="text-center">{{
            props.row.calibrationCycle
          }}</q-td>
          <q-td key="dueDate" :props="props" class="text-center">{{ props.row.dueDate }}</q-td>
          <q-td key="department" :props="props" class="text-center">{{ props.row.department }}</q-td>
          <q-td key="status" :props="props" class="text-center">
            <span class="status-badge" :class="statusClass(props.row.status)">
              {{ props.row.status }}
            </span>
          </q-td>
          <!-- Admin actions column -->
          <q-td v-if="isAdmin" key="actions" :props="props" class="text-center">
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="grey-7"
              @click="openEdit(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="red-5"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <ToolFormDialog
        :tool="editingTool"
        mode="dialog"
        @close="editDialog = false"
        @saved="editDialog = false"
      />
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteDialog"
      title="ยืนยันการลบเครื่องมือ"
      :message="`ต้องการลบเครื่องมือแพทย์หรือไม่?`"
      :item-name="deletingTool?.name"
      @confirm="doDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import SearchBar from 'src/components/SearchBar.vue';
import ToolFormDialog from 'src/components/tools/ToolFormDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import type { QTableProps } from 'quasar';
import { useToolsStore } from 'src/stores/tools';
import type { ToolStatus, MedicalTool } from 'src/types';

import { useAuthStore } from 'src/stores/auth';

const store = useToolsStore();
const { filteredTools, searchQuery, selectedType, typeOptions, loading } = storeToRefs(store);
const { fetchTools, deleteTool } = store;
const auth = useAuthStore();
const $q = useQuasar();

onMounted(() => {
  void fetchTools();
});

const isAdmin = computed(() => auth.permissions?.canManageTools ?? false);

/* ── Add / Edit ──────────────── */
const editDialog = ref(false);
const editingTool = ref<MedicalTool | null>(null);

function openAdd() {
  editingTool.value = null;
  editDialog.value = true;
}

function openEdit(tool: MedicalTool) {
  editingTool.value = { ...tool };
  editDialog.value = true;
}

/* ── Delete ─────────────── */
const deleteDialog = ref(false);
const deletingTool = ref<MedicalTool | null>(null);

function confirmDelete(tool: MedicalTool) {
  deletingTool.value = tool;
  deleteDialog.value = true;
}

async function doDelete() {
  if (deletingTool.value) {
    try {
      await deleteTool(deletingTool.value.id);
      $q.notify({ type: 'positive', message: 'ลบเครื่องมือสำเร็จ' });
    } catch {
      $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาดในการลบ' });
    }
  }
  deleteDialog.value = false;
  deletingTool.value = null;
}

/* ── Columns ────────────── */
const baseColumns: QTableProps['columns'] = [
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
    name: 'riskLevel',
    label: 'ความเสี่ยง',
    field: 'riskLevel',
    align: 'center',
    sortable: true,
    style: 'width: 90px; min-width: 80px',
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
    name: 'department',
    label: 'แผนก/หน่วยงาน',
    field: 'department',
    align: 'center',
    sortable: true,
    style: 'width: 100px;  min-width: 90px',
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

const tableColumns = computed<QTableProps['columns']>(() => {
  if (!isAdmin.value) return baseColumns;
  return [
    ...baseColumns,
    { name: 'actions', label: '', field: 'id', align: 'center', style: 'width: 90px' },
  ];
});

function statusClass(status: ToolStatus): string {
  const map: Record<ToolStatus, string> = {
    พร้อมใช้งาน: 'status--ready',
    กำลังสอบเทียบ: 'status--calibrating',
    รอดำเนินการ: 'status--pending',
    จำหน่ายแล้ว: 'status--sold',
    กำลังใช้งาน: 'status--active',
    ส่งซ่อม: 'status--repair',
    ปิดใช้งาน: 'status--disabled',
  };
  return map[status] ?? '';
}
</script>

<style scoped lang="scss">
/* ── Filters ─────────────────────────────────── */
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.type-select {
  width: 180px;
}

.btn-add {
  background: $primary !important;
  color: #fff !important;
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 24px;
}

/* ── Table ───────────────────────────────────── */
.tools-table {
  border-radius: 16px !important;
  overflow: hidden;

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
  width: 80%;
}

.status--ready {
  background: rgba(20, 160, 1, 0.12);
  color: #14a001;
}

.status--calibrating {
  background: rgba($primary, 0.15);
  color: $primary;
}

.status--pending {
  background: rgba(255, 152, 0, 0.14);
  color: #e65100;
}

.status--sold {
  background: rgba(0, 0, 0, 0.07);
  color: #6b7280;
}

.status--active {
  background: rgba(33, 150, 243, 0.15);
  color: #1976d2;
}

.status--repair {
  background: rgba(255, 1, 1, 0.1);
  color: #ff0101;
}

.status--disabled {
  background: #f5f5f5;
  color: #9e9e9e;
}
/* ── Risk badges ────────────────────────────── */
.risk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  min-width: 65px;
}

.risk-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.risk--high {
  background: #fef2f2;
  color: #991b1b;
  .risk-dot {
    background: #dc2626;
  }
}

.risk--medium {
  background: #fffbef;
  color: #92400e;
  .risk-dot {
    background: #d97706;
  }
}

.risk--low {
  background: #f0fdf4;
  color: #166534;
  .risk-dot {
    background: #16a34a;
  }
}

.risk--- {
  background: #f9fafb;
  color: #6b7280;
  .risk-dot {
    background: #9ca3af;
  }
}
</style>
