<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">ข้อมูลโรงพยาบาล</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลโรงพยาบาลทั้งหมดในระบบ</div>

    <!-- Filters -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="hospitalsStore.searchQuery" placeholder="ค้นหา..." />

      <q-btn
        v-if="canManage"
        unelevated
        icon="add"
        label="เพิ่มโรงพยาบาล"
        class="btn-manage q-ml-auto"
        @click="openAdd"
      />
    </div>

    <!-- q-table -->
    <q-table
      :rows="hospitalsStore.filteredHospitals"
      :columns="tableColumns"
      row-key="id"
      flat
      bordered
      class="hosp-table"
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
          <q-td key="logo" :props="props" class="text-center">
            <q-avatar size="48px" color="grey-2">
              <img v-if="props.row.logoUrl" :src="getImageUrl(props.row.logoUrl)" />
              <q-icon v-else name="local_hospital" color="grey-5" />
            </q-avatar>
          </q-td>
          <q-td key="code" :props="props" class="text-center">{{
            props.row.code || props.row.id
          }}</q-td>
          <q-td key="name" :props="props" class="text-left text-weight-medium">
            {{ props.row.name }}
          </q-td>
          <q-td key="address" :props="props" class="text-left">
            <div class="ellipsis" style="max-width: 200px">
              {{ props.row.address }}
            </div>
          </q-td>
          <q-td key="district" :props="props" class="text-center">{{ props.row.district }}</q-td>
          <q-td key="province" :props="props" class="text-center">{{ props.row.province }}</q-td>
          <q-td key="zipCode" :props="props" class="text-center">{{ props.row.zipCode }}</q-td>
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
      <div style="width: 600px; max-width: 90vw">
        <HospitalFormDialog
          :hospital="editingHosp"
          @close="formDialog = false"
          @saved="formDialog = false"
        />
      </div>
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteDialog"
      title="ยืนยันการลบโรงพยาบาล"
      message="ต้องการลบโรงพยาบาลออกจากระบบหรือไม่? ข้อมูลหน่วยงานและผู้ใช้งานที่เกี่ยวข้องจะได้รับผลกระทบ"
      :item-name="deletingHosp?.name"
      @confirm="doDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SearchBar from 'src/components/SearchBar.vue';
import HospitalFormDialog from 'src/components/hospitals/HospitalFormDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import type { QTableProps } from 'quasar';
import { useHospitalsStore } from 'src/stores/hospitals';
import type { Hospital } from 'src/services/tool.service';
import { useAuthStore } from 'src/stores/auth';
import { AppRole } from 'src/stores/roles';

const hospitalsStore = useHospitalsStore();
const auth = useAuthStore();
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

onMounted(() => {
  void hospitalsStore.fetchHospitals();
});

function getImageUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${apiBase}${path}`;
}

const canManage = computed(() => {
  return auth.user?.role === AppRole.ADMIN;
});

const baseColumns: QTableProps['columns'] = [
  { name: 'logo', label: 'ตรา', field: 'logoUrl', align: 'center', style: 'width: 80px' },
  {
    name: 'code',
    label: 'รหัส',
    field: 'code',
    align: 'center',
    sortable: true,
    style: 'width: 100px',
  },
  { name: 'name', label: 'ชื่อโรงพยาบาล', field: 'name', align: 'left', sortable: true },
  { name: 'address', label: 'ที่อยู่', field: 'address', align: 'left' },
  { name: 'district', label: 'อำเภอ', field: 'district', align: 'center' },
  { name: 'province', label: 'จังหวัด', field: 'province', align: 'center' },
  { name: 'zipCode', label: 'รหัสไปรษณีย์', field: 'zipCode', align: 'center' },
];

const tableColumns = computed<QTableProps['columns']>(() => {
  if (!canManage.value) return baseColumns;
  return [
    ...baseColumns,
    { name: 'actions', label: '', field: 'id', align: 'center', style: 'width: 100px' },
  ];
});

/* ── Form ──────────────── */
const formDialog = ref(false);
const editingHosp = ref<Hospital | null>(null);

function openAdd() {
  editingHosp.value = null;
  formDialog.value = true;
}

function openEdit(hosp: Hospital) {
  editingHosp.value = { ...hosp };
  formDialog.value = true;
}

/* ── Delete ─────────────── */
const deleteDialog = ref(false);
const deletingHosp = ref<Hospital | null>(null);

function confirmDelete(hosp: Hospital) {
  deletingHosp.value = hosp;
  deleteDialog.value = true;
}

function doDelete() {
  if (deletingHosp.value) {
    void hospitalsStore.deleteHospital(deletingHosp.value.id);
  }
  deleteDialog.value = false;
  deletingHosp.value = null;
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

.hosp-table {
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
