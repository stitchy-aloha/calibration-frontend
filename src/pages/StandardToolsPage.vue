<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">เครื่องมือมาตรฐาน</div>
    <div class="text-caption text-grey-6 q-mb-md">จัดการข้อมูลเครื่องมือมาตรฐานทั้งหมดในระบบ</div>

    <!-- Filters -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="searchQuery" placeholder="ค้นหาเครื่องมือมาตรฐาน..." />

      <q-btn
        unelevated
        icon="add"
        class="btn-add q-ml-auto"
        label="เพิ่มเครื่องมือมาตรฐาน"
        @click="openAddDialog"
      />
    </div>

    <!-- Data Table -->
    <q-table
      :rows="filteredTools"
      :columns="columns"
      row-key="id"
      flat
      bordered
      wrap-cells
      class="tools-table"
      :rows-per-page-options="[10, 20, 50]"
      no-data-label="ไม่พบข้อมูลเครื่องมือมาตรฐาน"
      :loading="store.loading"
    >
      <!-- Custom header -->
      <template #header="props">
        <q-tr :props="props" class="table-header-row">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="table-th text-weight-bold"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <!-- Custom body rows -->
      <template #body="props">
        <q-tr :props="props" class="table-body-row">
          <q-td key="asset_code" :props="props" class="col-id text-center">
            {{ props.row.asset_code || '-' }}
          </q-td>
          <q-td key="name" :props="props" class="col-name">
            {{ props.row.name }}
          </q-td>
          <q-td key="manufacturer" :props="props">
            {{ props.row.manufacturer || '-' }}
          </q-td>
          <q-td key="model" :props="props">
            {{ props.row.model || '-' }}
          </q-td>
          <q-td key="serial_number" :props="props" class="text-center">
            {{ props.row.serial_number || '-' }}
          </q-td>
          <q-td key="calibration_date_last" :props="props" class="text-center">
            {{
              props.row.calibration_date_last ? formatDate(props.row.calibration_date_last) : '-'
            }}
          </q-td>
          <q-td key="actions" :props="props" class="text-center">
            <!-- View Certificate PDF -->
            <q-btn
              flat
              round
              dense
              icon="description"
              size="sm"
              color="primary"
              class="q-mr-xs"
              :disable="!props.row.path_pdf"
              @click="viewCertificate(props.row.path_pdf)"
            >
              <q-tooltip v-if="props.row.path_pdf">เปิดดูใบรับรอง PDF</q-tooltip>
              <q-tooltip v-else>ไม่มีไฟล์ใบรับรอง</q-tooltip>
            </q-btn>

            <!-- Edit Tool -->
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="grey-7"
              class="q-mr-xs"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>แก้ไขข้อมูล</q-tooltip>
            </q-btn>

            <!-- Delete Tool -->
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="red-5"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>ลบข้อมูล</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Add/Edit Form Dialog -->
    <StandardToolDialog v-model="dialogOpen" :tool="selectedTool" @saved="onSaved" />

    <!-- Confirm Delete Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteDialogOpen"
      message="ต้องการลบข้อมูลเครื่องมือมาตรฐานนี้ใช่หรือไม่?"
      :item-name="toolToDelete ? `${toolToDelete.asset_code || ''} ${toolToDelete.name}` : ''"
      @confirm="onDeleteConfirm"
      @cancel="deleteDialogOpen = false"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToolsStore } from 'src/stores/tools';
import type { BackendStandardTool } from 'src/types/tool.types';
import StandardToolDialog from 'src/components/tools/StandardToolDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import SearchBar from 'src/components/SearchBar.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useToolsStore();

const searchQuery = ref('');
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const selectedTool = ref<BackendStandardTool | null>(null);
const toolToDelete = ref<BackendStandardTool | null>(null);

onMounted(async () => {
  await store.fetchStandardTools();
});

// Table columns setup
const columns = [
  {
    name: 'asset_code',
    label: 'รหัส',
    field: 'asset_code',
    align: 'center' as const,
    style: 'width: 100px',
  },
  { name: 'name', label: 'เครื่องมือมาตรฐาน', field: 'name', align: 'left' as const },
  { name: 'manufacturer', label: 'บริษัท', field: 'manufacturer', align: 'left' as const },
  { name: 'model', label: 'รุ่น', field: 'model', align: 'left' as const },
  {
    name: 'serial_number',
    label: 'หมายเลขเครื่อง',
    field: 'serial_number',
    align: 'center' as const,
    style: 'width: 120px',
  },
  {
    name: 'calibration_date_last',
    label: 'วันที่สอบเทียบ',
    field: 'calibration_date_last',
    align: 'center' as const,
    style: 'width: 120px',
  },
  { name: 'actions', label: '', field: 'id', align: 'center' as const, style: 'width: 120px' },
];

// Search logic
const filteredTools = computed(() => {
  const q = searchQuery.value?.toLowerCase() || '';
  if (!q) return store.standardTools;
  return store.standardTools.filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      (t.asset_code || '').toLowerCase().includes(q) ||
      (t.manufacturer || '').toLowerCase().includes(q) ||
      (t.model || '').toLowerCase().includes(q) ||
      (t.serial_number || '').toLowerCase().includes(q)
    );
  });
});

function openAddDialog() {
  selectedTool.value = null;
  dialogOpen.value = true;
}

function openEditDialog(tool: BackendStandardTool) {
  selectedTool.value = tool;
  dialogOpen.value = true;
}

function confirmDelete(tool: BackendStandardTool) {
  toolToDelete.value = tool;
  deleteDialogOpen.value = true;
}

async function onDeleteConfirm() {
  if (!toolToDelete.value) return;
  try {
    await store.deleteStandardTool(toolToDelete.value.id);
    $q.notify({
      type: 'positive',
      message: 'ลบเครื่องมือมาตรฐานสำเร็จ',
      position: 'top-right',
    });
  } catch (err: unknown) {
    const errorMsg =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
      'ลบข้อมูลล้มเหลว';
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top-right',
    });
  } finally {
    deleteDialogOpen.value = false;
    toolToDelete.value = null;
  }
}

function onSaved() {
  // Reload standard tools is handled inside store actions
}

// Convert backend date to Buddhist era date for Display if needed, or normal YYYY-MM-DD
// Let's match backend format or show Thai style.
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Convert standard YYYY-MM-DD to YYYY+543-MM-DD or standard YYYY-MM-DD depending on system context
  // Let's do simple Buddhist Era year replacement if it fits the screenshot e.g. "2566-12-23"
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  // Buddhist Era Year (BE) is AD + 543
  const beYear = y < 2400 ? y + 543 : y; // avoid double converting if already BE
  return `${beYear}-${m}-${d}`;
}

function viewCertificate(path: string | undefined | null) {
  if (!path) return;
  let fileUrl = path;
  if (!path.startsWith('http://') && !path.startsWith('https://')) {
    fileUrl = `${process.env.API_URL || 'http://localhost:3000'}${path}`;
  }
  window.open(fileUrl, '_blank');
}
</script>

<style scoped lang="scss">
/* ── Filters ─────────────────────────────────── */
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 599px) {
  .filters-row {
    flex-wrap: wrap;
  }
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
</style>
