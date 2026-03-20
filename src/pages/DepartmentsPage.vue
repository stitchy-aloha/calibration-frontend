<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">หน่วยงาน</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลหน่วยงานทั้งหมดในระบบ</div>

    <!-- Filters -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="departmentStore.searchQuery" placeholder="ค้นหา..." />

      <q-btn
        v-if="canManage"
        unelevated
        icon="add"
        label="เพิ่มหน่วยงาน"
        class="btn-manage q-ml-auto"
        @click="openAdd"
      />
    </div>

    <!-- q-table -->
    <q-table
      :rows="departmentStore.filteredDepartments"
      :columns="tableColumns"
      row-key="id"
      flat
      bordered
      class="dept-table"
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
          <q-td key="id" :props="props" class="text-center">{{ props.row.id }}</q-td>
          <q-td key="code" :props="props" class="text-center">{{ props.row.name }}</q-td>
          <q-td key="name" :props="props" class="text-center">{{ props.row.description }}</q-td>
          <q-td v-if="canManage" key="actions" :props="props" class="text-center">
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="grey-7"
              class="q-mr-sm"
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

    <!-- Form Dialog -->
    <q-dialog v-model="formDialog" persistent>
      <div style="width: 500px; max-width: 90vw">
        <DepartmentFormDialog
          :department="editingDept"
          @close="formDialog = false"
          @saved="formDialog = false"
        />
      </div>
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteDialog"
      title="ยืนยันการลบหน่วยงาน"
      message="ต้องการลบหน่วยงานออกจากระบบหรือไม่?"
      :item-name="deletingDept?.name"
      @confirm="doDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SearchBar from 'src/components/SearchBar.vue';
import DepartmentFormDialog from 'src/components/departments/DepartmentFormDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import type { QTableProps } from 'quasar';
import { useDepartmentsStore, type Department } from 'src/stores/departments';
import { useAuthStore } from 'src/stores/auth';
import { computed, onMounted } from 'vue';

const departmentStore = useDepartmentsStore();
const auth = useAuthStore();

onMounted(() => {
  void departmentStore.fetchDepartments();
});
const canManage = computed(() => auth.permissions?.canManageDepartments ?? false);

const baseColumns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'รหัสหน่วยงาน',
    field: 'id',
    align: 'center',
    sortable: true,
    style: 'width: 20%; font-weight: 600;',
  },
  {
    name: 'code',
    label: 'ชื่อย่อหน่วยงาน',
    field: 'name',
    align: 'center',
    sortable: true,
    style: 'width: 20%',
  },
  {
    name: 'name',
    label: 'ชื่อหน่วยงาน',
    field: 'description',
    align: 'center',
    sortable: true,
    style: 'width: 40%',
  },
];

const tableColumns = computed<QTableProps['columns']>(() => {
  if (!canManage.value) return baseColumns;
  return [
    ...baseColumns,
    { name: 'actions', label: '', field: 'id', align: 'center', style: 'width: 20%' },
  ];
});

/* ── Form ──────────────── */
const formDialog = ref(false);
const editingDept = ref<Department | null>(null);

function openAdd() {
  editingDept.value = null;
  formDialog.value = true;
}

function openEdit(dept: Department) {
  editingDept.value = { ...dept };
  formDialog.value = true;
}

/* ── Delete ─────────────── */
const deleteDialog = ref(false);
const deletingDept = ref<Department | null>(null);

function confirmDelete(dept: Department) {
  deletingDept.value = dept;
  deleteDialog.value = true;
}

function doDelete() {
  if (deletingDept.value) {
    void departmentStore.deleteDepartment(deletingDept.value.id);
  }
  deleteDialog.value = false;
  deletingDept.value = null;
}
</script>

<style scoped lang="scss">
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-manage {
  background: $secondary !important;
  color: #fff !important;
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 16px;
}

.dept-table {
  border-radius: 8px !important;
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
</style>
