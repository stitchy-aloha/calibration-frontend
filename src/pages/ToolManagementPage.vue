<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">จัดการเครื่องมือแพทย์</div>
    <div class="text-caption text-grey-6 q-mb-md">เพิ่มและตั้งค่าเครื่องมือทั้งหมดในระบบ</div>

    <!-- Two-column layout -->
    <div class="manage-layout">
      <!-- Left Sidebar -->
      <div class="manage-sidebar">
        <q-btn
          :unelevated="activeTab === 'calibration'"
          :outline="activeTab !== 'calibration'"
          icon="app:container"
          label="กระบวนการสอบเทียบ"
          :class="[
            'sidebar-btn',
            activeTab === 'calibration' ? 'sidebar-btn--primary' : 'sidebar-btn--outline',
          ]"
          @click="activeTab = 'calibration'"
        />

        <q-btn
          :unelevated="activeTab === 'settings'"
          :outline="activeTab !== 'settings'"
          icon="settings"
          label="ตั้งค่าเครื่องมือแพทย์"
          :class="[
            'sidebar-btn',
            activeTab === 'settings' ? 'sidebar-btn--primary' : 'sidebar-btn--outline',
          ]"
          @click="activeTab = 'settings'"
        />

        <q-btn
          :unelevated="activeTab === 'cost'"
          :outline="activeTab !== 'cost'"
          icon="app:expense"
          label="ค่าใช้จ่ายในการสอบเทียบ"
          :class="[
            'sidebar-btn',
            activeTab === 'cost' ? 'sidebar-btn--primary' : 'sidebar-btn--outline',
          ]"
          @click="activeTab = 'cost'"
        />
      </div>

      <!-- Right: Content Area -->
      <div class="manage-content-area">
        <!-- ── Tab: กระบวนการสอบเทียบ ── -->
        <template v-if="activeTab === 'calibration'">
          <div class="content-top-bar q-mb-md">
            <SearchBar v-model="processSearch" placeholder="ค้นหา..." />
            <q-space />
            <q-btn unelevated round icon="add" class="btn-add" @click="showAddProcess = true" />
          </div>

          <q-table
            :rows="filteredProcesses"
            :columns="processColumns"
            row-key="id"
            flat
            bordered
            class="data-table"
            :rows-per-page-options="[0]"
            hide-pagination
            no-data-label="ไม่พบข้อมูล"
          >
            <template #header="props">
              <q-tr :props="props" class="table-header-row">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-th">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template #body="props">
              <q-tr :props="props" class="table-body-row">
                <q-td key="index" :props="props" class="text-center">{{ props.rowIndex + 1 }}</q-td>
                <td key="parameter" :props="props">{{ props.row.parameter_name }}</td>
                <td key="procedure" :props="props" class="text-truncate-cell">{{
                  props.row.procedure
                }}</td >
                <td key="unit" :props="props" class="text-center">{{ props.row.unit }}</td>
                <td key="standardEquipment" :props="props">
                  {{ props.row.standardTool ? `${props.row.standardTool.name}-${props.row.standardTool.manufacturer}` : '' }}
                </td>
                <q-td key="actions" :props="props" class="text-center">
                  <q-btn
                    flat
                    round
                    icon="edit"
                    size="sm"
                    color="secondary"
                    @click="openEditProcess(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="confirmDeleteProcess(props.row.id, props.row.parameter_name)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </template>

        <!-- ── Tab: ตั้งค่าเครื่องมือแพทย์ (unchanged) ── -->
        <template v-else-if="activeTab === 'settings'">
          <div class="settings-content">
            <div class="filters-row q-mb-md">
              <SearchBar v-model="searchQuery" placeholder="ค้นหา..." />
              <q-select
                v-model="selectedType"
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

            <q-table
              :rows="filteredUniqueTools"
              :columns="settingsColumns"
              row-key="name"
              flat
              bordered
              wrap-cells
              class="data-table"
              :rows-per-page-options="[0]"
              hide-pagination
              no-data-label="ไม่พบข้อมูล"
            >
              <template #header="props">
                <q-tr :props="props" class="table-header-row">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-th">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template #body="props">
                <q-tr :props="props" class="table-body-row">
                  <q-td key="name" :props="props" class="col-name">{{ props.row.name }}</q-td>
                  <q-td key="type" :props="props" class="text-center">{{ props.row.type }}</q-td>
                  <q-td key="department" :props="props">{{ props.row.department }}</q-td>
                  <q-td key="action" :props="props" class="text-center">
                    <q-btn
                      unelevated
                      size="sm"
                      label="ตั้งค่า"
                      class="btn-config"
                      @click="router.push(`/tools/config/${encodeURIComponent(props.row.name)}`)"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </template>

        <!-- ── Tab: ค่าใช้จ่ายในการสอบเทียบ ── -->
        <template v-else>
          <div class="content-top-bar q-mb-md">
            <SearchBar v-model="costSearch" placeholder="ค้นหา..." />
            <q-space />
            <q-btn unelevated round icon="add" class="btn-add" @click="showAddCost = true" />
          </div>

          <q-table
            :rows="filteredCosts"
            :columns="costColumns"
            row-key="id"
            flat
            bordered
            class="data-table"
            :rows-per-page-options="[0]"
            hide-pagination
            no-data-label="ไม่พบข้อมูล"
          >
            <template #header="props">
              <q-tr :props="props" class="table-header-row">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-th">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template #body="props">
              <q-tr :props="props" class="table-body-row">
                <q-td key="index" :props="props" class="text-center">{{ props.rowIndex + 1 }}</q-td>
                <td key="toolName" :props="props">{{ props.row.tool_name }}</td>
                <q-td key="description" :props="props">{{ props.row.description }}</q-td>
                <q-td key="price" :props="props" class="text-center">
                  {{ props.row.price.toLocaleString() }} บาท
                </q-td>
                <q-td key="actions" :props="props" class="text-center">
                  <q-btn
                    flat
                    round
                    icon="edit"
                    size="sm"
                    color="secondary"
                    @click="openEditCost(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    icon="delete"
                    size="sm"
                    color="negative"
                    @click="confirmDeleteCost(props.row.id, props.row.tool_name)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </template>
      </div>
    </div>

    <!-- Dialogs -->
    <CalibrationProcessDialog
      v-if="showAddProcess"
      :process="editingProcess"
      @saved="handleProcessSaved"
      @close="closeProcessDialog"
    />

    <CalibrationCostDialog
      v-if="showAddCost"
      :cost="editingCost"
      @saved="handleCostSaved"
      @close="closeCostDialog"
    />

    <ConfirmDeleteDialog
      v-model="deleteProcessDialog"
      message="ต้องการลบกระบวนการนี้ใช่หรือไม่?"
      :item-name="pendingDeleteProcessName"
      @confirm="handleDeleteProcess"
      @cancel="deleteProcessDialog = false"
    />

    <ConfirmDeleteDialog
      v-model="deleteCostDialog"
      message="ต้องการลบค่าใช้จ่ายนี้ใช่หรือไม่?"
      :item-name="pendingDeleteCostName"
      @confirm="handleDeleteCost"
      @cancel="deleteCostDialog = false"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from 'src/components/SearchBar.vue';
import CalibrationProcessDialog from 'src/components/tools/CalibrationProcessDialog.vue';
import CalibrationCostDialog from 'src/components/tools/CalibrationCostDialog.vue';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';
import { useToolsStore } from 'src/stores/tools';
import type { CalibrationProcess, CalibrationCost } from 'src/types/tool.types';

const router = useRouter();
const store = useToolsStore();

onMounted(async () => {
  await store.fetchCalibrationProcesses();
  await store.fetchCalibrationCosts();
});

/* ── Tab ── */
const activeTab = ref<'calibration' | 'settings' | 'cost'>('calibration');

/* ── Calibration Process ── */
const processSearch = ref('');
const showAddProcess = ref(false);
const editingProcess = ref<CalibrationProcess | null>(null);

const filteredProcesses = computed(() => {
  const q = processSearch.value.toLowerCase();
  if (!q) return store.calibrationProcesses;
  return store.calibrationProcesses.filter(
    (p) =>
      p.parameter_name.toLowerCase().includes(q) ||
      (p.standardTool
        ? `${p.standardTool.name}-${p.standardTool.manufacturer}`
        : ''
      )
        .toLowerCase()
        .includes(q) ||
      p.unit.toLowerCase().includes(q),
  );
});

function openEditProcess(process: CalibrationProcess) {
  editingProcess.value = process;
  showAddProcess.value = true;
}

async function handleProcessSaved(data: Omit<CalibrationProcess, 'id'>) {
  if (editingProcess.value) {
    await store.updateCalibrationProcess(editingProcess.value.id, data);
  } else {
    await store.addCalibrationProcess(data);
  }
  closeProcessDialog();
}

function closeProcessDialog() {
  showAddProcess.value = false;
  editingProcess.value = null;
}

/* ── Delete Process Confirm ── */
const deleteProcessDialog = ref(false);
const pendingDeleteProcessId = ref<number | null>(null);
const pendingDeleteProcessName = ref('');

function confirmDeleteProcess(id: number, name: string) {
  pendingDeleteProcessId.value = id;
  pendingDeleteProcessName.value = name;
  deleteProcessDialog.value = true;
}

async function handleDeleteProcess() {
  if (pendingDeleteProcessId.value !== null) {
    await store.deleteCalibrationProcess(pendingDeleteProcessId.value);
  }
  deleteProcessDialog.value = false;
}

/* ── Calibration Cost ── */
const costSearch = ref('');
const showAddCost = ref(false);
const editingCost = ref<CalibrationCost | null>(null);

const filteredCosts = computed(() => {
  const q = costSearch.value.toLowerCase();
  if (!q) return store.calibrationCosts;
  return store.calibrationCosts.filter(
    (c) => c.tool_name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  );
});

function openEditCost(cost: CalibrationCost) {
  editingCost.value = cost;
  showAddCost.value = true;
}

async function handleCostSaved(data: Omit<CalibrationCost, 'id'>) {
  if (editingCost.value) {
    await store.updateCalibrationCost(editingCost.value.id, data);
  } else {
    await store.addCalibrationCost(data);
  }
  closeCostDialog();
}

function closeCostDialog() {
  showAddCost.value = false;
  editingCost.value = null;
}

/* ── Delete Cost Confirm ── */
const deleteCostDialog = ref(false);
const pendingDeleteCostId = ref<number | null>(null);
const pendingDeleteCostName = ref('');

function confirmDeleteCost(id: number, toolName: string) {
  pendingDeleteCostId.value = id;
  pendingDeleteCostName.value = toolName;
  deleteCostDialog.value = true;
}

async function handleDeleteCost() {
  if (pendingDeleteCostId.value !== null) {
    await store.deleteCalibrationCost(pendingDeleteCostId.value);
  }
  deleteCostDialog.value = false;
}

/* ── Settings Tab (unchanged logic) ── */
const searchQuery = ref('');
const selectedType = ref('');

const uniqueTools = computed(() => {
  const seen = new Set<string>();
  return store.tools
    .filter((t) => {
      if (seen.has(t.name)) return false;
      seen.add(t.name);
      return true;
    })
    .map((t) => ({
      name: t.name,
      type: t.type,
      location: t.location,
      department: t.department,
    }));
});

const filteredUniqueTools = computed(() =>
  uniqueTools.value.filter((t) => {
    const matchSearch =
      !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !selectedType.value || t.type === selectedType.value;
    return matchSearch && matchType;
  }),
);

/* ── Column Definitions ── */
const processColumns = [
  { name: 'index', label: 'ลำดับ', field: 'id', align: 'center' as const, style: 'width: 70px' },
  { name: 'parameter', label: 'รายการ', field: 'parameter_name', align: 'left' as const },
  { name: 'procedure', label: 'กระบวนการสอบเทียบ', field: 'procedure', align: 'left' as const },
  {
    name: 'unit',
    label: 'หน่วยวัด',
    field: 'unit',
    align: 'center' as const,
    style: 'width: 100px',
  },
  {
    name: 'standardEquipment',
    label: 'เครื่องมือมาตรฐาน',
    field: (row: CalibrationProcess) =>
      row.standardTool ? `${row.standardTool.name}-${row.standardTool.manufacturer}` : '',
    align: 'left' as const,
  },
  { name: 'actions', label: '', field: 'id', align: 'center' as const, style: 'width: 90px' },
];

const settingsColumns = [
  {
    name: 'name',
    label: 'ชื่อเครื่องมือ',
    field: 'name',
    align: 'left' as const,
    style: 'width: 50%',
  },
  { name: 'type', label: 'ประเภท', field: 'type', align: 'center' as const, style: 'width: 25%' },
  { name: 'department', label: 'แผนก/หน่วยงาน', field: 'department', align: 'left' as const },
  { name: 'action', label: '', field: 'name', align: 'center' as const, style: 'width: 25%' },
];

const costColumns = [
  { name: 'index', label: 'ลำดับ', field: 'id', align: 'center' as const, style: 'width: 70px' },
  { name: 'toolName', label: 'ชื่อเครื่องมือ', field: 'tool_name', align: 'left' as const },
  { name: 'description', label: 'รายการ', field: 'description', align: 'left' as const },
  { name: 'price', label: 'ราคา', field: 'price', align: 'center' as const, style: 'width: 130px' },
  { name: 'actions', label: '', field: 'id', align: 'center' as const, style: 'width: 90px' },
];
</script>

<style scoped lang="scss">
.manage-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  min-height: calc(100vh - 200px);
}

/* Sidebar */
.manage-sidebar {
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  padding: 20px;
  align-self: flex-start;
}

.sidebar-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  padding: 14px 0;
  font-size: 14px;
}

.sidebar-btn--primary {
  background: $secondary !important;
  color: #fff !important;
}

.sidebar-btn--outline {
  border-color: #d0d5dd;
  color: #555;
}

/* Content Area */
.manage-content-area {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  padding: 24px;
  min-height: calc(100vh - 200px);
}

/* Top bar with search + add button */
.content-top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-add {
  background: $secondary !important;
  color: #fff !important;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
}

/* Settings */
.filters-row {
  display: flex;
  gap: 12px;
}

.type-select {
  width: 180px;
}

/* Table */
.data-table {
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

.text-truncate-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-name {
  font-weight: 500;
}

.btn-config {
  background: $primary !important;
  color: #fff !important;
  border-radius: 8px;
  padding: 4px 20px;
  font-weight: 600;
  font-size: 14px;
  width: 120px;
}

@media (max-width: 768px) {
  .manage-layout {
    flex-direction: column;
    min-height: unset;
  }

  .manage-sidebar {
    width: 100%;
    min-width: unset;
  }
}
</style>
