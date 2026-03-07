<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">การจัดการผู้ใช้งาน</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลของผู้ใช้งานในระบบ</div>

    <!-- Filters -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="store.searchQuery" placeholder="ค้นหา..." />

      <q-select
        v-model="store.roleFilter"
        :options="roleOptions"
        outlined
        dense
        emit-value
        map-options
        clearable
        label="ตำแหน่ง"
        class="role-select"
        style="min-width: 220px"
      />

      <q-btn
        unelevated
        icon="add"
        label="เพิ่มผู้ใช้งาน"
        class="btn-manage q-ml-auto"
        @click="openAdd"
      />
    </div>

    <!-- Users Table -->
    <q-table
      :rows="store.filteredUsers"
      :columns="tableColumns"
      row-key="id"
      flat
      bordered
      :loading="store.loading"
      class="users-table"
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
          <q-td key="image" :props="props" class="text-center">
            <q-avatar size="38px" class="user-avatar">
              <img
                :src="getImageUrl(props.row.imageUrl)"
                :alt="props.row.name"
                @error="onImgError"
              />
            </q-avatar>
          </q-td>
          <q-td key="id" :props="props" class="text-center text-weight-medium">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props" class="text-center text-weight-bold">
            {{ props.row.name }}
          </q-td>
          <q-td key="role" :props="props" class="text-center">
            {{ props.row.role.description }}
          </q-td>
          <q-td key="email" :props="props" class="text-center">
            {{ props.row.email }}
          </q-td>
          <q-td key="tel" :props="props" class="text-center">
            {{ props.row.tel }}
          </q-td>
          <q-td key="actions" :props="props" class="text-center">
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
      <div style="width: 560px; max-width: 90vw">
        <UserFormDialog :user="editingUser" @close="formDialog = false" @saved="onSaved" />
      </div>
    </q-dialog>

    <!-- Delete Confirm Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteDialog"
      title="ยืนยันการลบผู้ใช้งาน"
      message="ต้องการลบผู้ใช้งานออกจากระบบหรือไม่?"
      :item-name="deletingUser?.name"
      :loading="deleting"
      @confirm="doDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar, type QTableProps } from 'quasar';
import SearchBar from 'src/components/SearchBar.vue';
import UserFormDialog from 'src/components/users/UserFormDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import { useUserStore, type User } from 'src/stores/user';

const $q = useQuasar();
const store = useUserStore();
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

onMounted(() => {
  void store.fetchUsers();
});

function getImageUrl(path: string | null) {
  if (!path) return '/image/default-avatar.png';
  if (path.startsWith('http')) return path;
  return `${apiBase}${path}`;
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = '/image/default-avatar.png';
}

const roleOptions = computed(() => [...store.availableRoles.map((r) => ({ label: r, value: r }))]);

const tableColumns: QTableProps['columns'] = [
  {
    name: 'image',
    label: 'รูปภาพ',
    field: 'imageUrl',
    align: 'center',
    style: 'width: 80px',
  },
  {
    name: 'id',
    label: 'รหัสพนักงาน',
    field: 'id',
    align: 'center',
    sortable: true,
    style: 'width: 12%',
  },
  {
    name: 'name',
    label: 'ชื่อ-นามสกุล',
    field: 'name',
    align: 'center',
    sortable: true,
    style: 'width: 18%; font-weight: 600',
  },
  {
    name: 'role',
    label: 'ตำแหน่ง',
    field: (row) => (row as User).role.description,
    align: 'center',
    sortable: true,
    style: 'width: 14%',
  },
  {
    name: 'email',
    label: 'อีเมล',
    field: 'email',
    align: 'center',
    sortable: true,
    style: 'width: 18%',
  },
  {
    name: 'tel',
    label: 'เบอร์โทรศัพท์',
    field: 'tel',
    align: 'center',
    style: 'width: 12%',
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    align: 'center',
    style: 'width: 100px',
  },
];

/* ── Form ──────────────── */
const formDialog = ref(false);
const editingUser = ref<User | null>(null);

function openAdd() {
  editingUser.value = null;
  formDialog.value = true;
}

function openEdit(user: User) {
  editingUser.value = { ...user };
  formDialog.value = true;
}

function onSaved() {
  formDialog.value = false;
  void store.fetchUsers();
}

/* ── Delete ─────────────── */
const deleteDialog = ref(false);
const deletingUser = ref<User | null>(null);
const deleting = ref(false);

function confirmDelete(user: User) {
  deletingUser.value = user;
  deleteDialog.value = true;
}

async function doDelete() {
  if (!deletingUser.value) return;
  deleting.value = true;
  try {
    await store.deleteUser(deletingUser.value.id);
    $q.notify({ color: 'positive', message: 'ลบผู้ใช้งานสำเร็จ', icon: 'check_circle' });
  } catch {
    $q.notify({ color: 'negative', message: 'ไม่สามารถลบผู้ใช้งานได้', icon: 'error' });
  } finally {
    deleting.value = false;
    deleteDialog.value = false;
    deletingUser.value = null;
  }
}
</script>

<style scoped lang="scss">
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.role-select {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.btn-manage {
  background: $secondary !important;
  color: #fff !important;
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 16px;
}

.user-avatar {
  border: 2px solid rgba($secondary, 0.3);
}

.users-table {
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
