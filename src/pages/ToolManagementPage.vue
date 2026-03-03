<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h7 q-mb-sm text-weight-bold">จัดการเครื่องมือแพทย์</div>
    <div class="text-caption text-grey-6 q-mb-md">เพิ่มและตั้งค่าเครื่องมือทั้งหมดในระบบ</div>

    <!-- Two-column layout -->
    <div class="manage-layout">
      <!-- Left Sidebar -->
      <div class="manage-sidebar">
        <q-btn
          :unelevated="activeTab === 'add'"
          :outline="activeTab !== 'add'"
          icon="add"
          label="เพิ่มเครื่องมือ"
          :class="[
            'sidebar-btn',
            activeTab === 'add' ? 'sidebar-btn--primary' : 'sidebar-btn--outline',
          ]"
          @click="resetForm"
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
      </div>

      <!-- Right: Content Area -->
      <div class="manage-form-area" :class="{ 'settings-area': activeTab === 'settings' }">
        <!-- Add/Edit Form -->
        <template v-if="activeTab === 'add'">
          <ToolFormDialog
            :key="formKey"
            :tool="editingTool"
            mode="inline"
            @close="goBack"
            @saved="goBack"
          />
        </template>

        <!-- Settings List -->
        <template v-else>
          <div class="settings-content">
            <!-- Filters -->
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

            <!-- Table -->
            <q-table
              :rows="filteredUniqueTools"
              :columns="columns"
              row-key="name"
              flat
              bordered
              class="settings-table"
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ToolFormDialog from 'src/components/tools/ToolFormDialog.vue';
import SearchBar from 'src/components/SearchBar.vue';
import { useToolsStore } from 'src/stores/tools';
import type { MedicalTool } from 'src/types';

const router = useRouter();
const route = useRoute();
const store = useToolsStore();

/* ── Tabs ── */
const activeTab = ref<'add' | 'settings'>((route.query.tab as 'add' | 'settings') || 'add');

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === 'settings' || newTab === 'add') {
      activeTab.value = newTab;
    }
  },
);

/* ── Add/Edit Mode ── */
const editingTool = ref<MedicalTool | null>(null);
const formKey = ref(0);

function resetForm() {
  activeTab.value = 'add';
  editingTool.value = null;
  formKey.value++;
}

async function goBack() {
  await router.push('/tools');
}

/* ── Settings Mode ── */
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
    .map((t) => ({ name: t.name, type: t.type }));
});

const filteredUniqueTools = computed(() =>
  uniqueTools.value.filter((t) => {
    const matchSearch =
      !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !selectedType.value || t.type === selectedType.value;
    return matchSearch && matchType;
  }),
);

const columns = [
  {
    name: 'name',
    label: 'ชื่อเครื่องมือ',
    field: 'name',
    align: 'left' as const,
    style: 'width: 50%',
  },
  { name: 'type', label: 'ประเภท', field: 'type', align: 'center' as const, style: 'width: 25%' },
  { name: 'action', label: '', field: 'name', align: 'center' as const, style: 'width: 25%' },
];
</script>

<style scoped lang="scss">
.manage-layout {
  display: flex;
  gap: 24px;
  align-items: stretch;
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
.manage-form-area {
  flex: 1;
  border-radius: 20px;
  border: 1px solid #ececec;
  overflow: hidden;
  background: #fff;
  min-height: calc(100vh - 200px);
}

.settings-area {
  padding: 24px;
  border: none;
  background: transparent;
  overflow: visible;
  min-height: unset;
}

.settings-content {
  width: 100%;
}

.filters-row {
  display: flex;
  gap: 12px;
}

.type-select {
  width: 180px;
}

/* Table */
.settings-table {
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
