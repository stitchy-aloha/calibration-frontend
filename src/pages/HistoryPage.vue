<template>
  <q-page padding class="bg-grey-1">
    <!-- Page Header -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">ประวัติการสอบเทียบ</div>
      <div class="text-caption text-grey-6 text-subtitle1">ดูรายงานการสอบเทียบเครื่องมือแพทย์</div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar-row q-mb-md">
      <SearchBar v-model="store.searchQuery" placeholder="ค้นหา..." class="search-input" />

      <q-select
        v-model="store.selectedDevice"
        :options="store.deviceOptions"
        outlined
        dense
        bg-color="white"
        style="min-width: 200px"
        emit-value
        map-options
      />

      <q-select
        v-model="store.selectedResult"
        :options="store.resultOptions"
        outlined
        dense
        bg-color="white"
        style="min-width: 200px"
        emit-value
        map-options
      />
      <q-space />

      <q-btn
        unelevated
        color="primary"
        icon="download"
        label="ส่งออกข้อมูล"
        class="q-px-md"
        @click="showExport = true"
      />
    </div>

    <!-- q-table -->
    <q-table
      :rows="store.filteredRecords"
      :columns="columns"
      row-key="id"
      flat
      bordered
      wrap-cells
      class="history-table"
      table-header-class="table-thead"
      :rows-per-page-options="[10, 20, 50, 0]"
      rows-per-page-label="แถวต่อหน้า"
      no-data-label="ไม่พบข้อมูลที่ค้นหา"
    >
      <!-- Result column custom slot -->
      <template #body-cell-result="{ value }">
        <q-td class="text-center">
          <div
            class="flex flex-center gap-xs text-weight-medium"
            :class="value === 'pass' ? 'text-positive' : 'text-negative'"
          >
            <q-icon :name="value === 'pass' ? 'check_circle_outline' : 'cancel'" size="18px" />
            {{ value === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน' }}
          </div>
        </q-td>
      </template>

      <!-- Actions column custom slot -->
      <template #body-cell-actions>
        <q-td class="text-center">
          <q-btn
            flat
            round
            dense
            icon="description"
            color="primary"
            size="md"
            @click="router.push('/cer-view')"
          >
            <q-tooltip>ดูใบรับรอง (CER)</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="qr_code_2" color="grey-6" size="md">
            <q-tooltip>QR Code</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- Empty state -->
      <template #no-data="{ message }">
        <div class="full-width text-center q-py-xl text-grey-5">
          <q-icon name="search_off" size="48px" class="q-mb-sm" /><br />
          {{ message }}
        </div>
      </template>
    </q-table>

    <!-- Export Dialog -->
    <ExportDialog
      v-model="showExport"
      :device-options="store.deviceOptions"
      :result-options="store.resultOptions"
    />

    <ExportDialog
      v-model="showExport"
      :device-options="store.deviceOptions"
      :result-options="store.resultOptions"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { QTableProps } from 'quasar';
import { useHistoryStore } from 'src/stores/history';
import ExportDialog from 'src/components/history/ExportDialog.vue';
import SearchBar from 'src/components/SearchBar.vue';

const router = useRouter();
const store = useHistoryStore();
const showExport = ref(false);

const columns: QTableProps['columns'] = [
  { name: 'date', label: 'วันที่', field: 'date', align: 'center', sortable: true },
  { name: 'deviceName', label: 'เครื่องมือ', field: 'deviceName', align: 'center', sortable: true },
  {
    name: 'deviceCode',
    label: 'เลขครุภัณฑ์',
    field: 'deviceCode',
    align: 'center',
    sortable: true,
  },
  { name: 'inspector', label: 'ผู้สอบเทียบ', field: 'inspector', align: 'center', sortable: true },
  { name: 'result', label: 'ผลลัพธ์', field: 'result', align: 'center', sortable: true },
  { name: 'actions', label: '', field: 'id', align: 'center', sortable: false },
];
</script>

<style scoped lang="scss">
.toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* q-table overrides */
.history-table {
  border-radius: 12px;
  overflow: hidden;

  :deep(.table-thead th) {
    background: $primary;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  :deep(tbody tr:hover td) {
    background: rgba($primary, 0.03);
  }

  :deep(tbody td) {
    font-size: 13px;
  }
}

/* Result chip */
.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;

  &--pass {
    background: rgba($positive, 0.12);
    color: darken(#61c6ab, 8%);
  }
  &--fail {
    background: rgba($negative, 0.12);
    color: darken(#fb7171, 12%);
  }
}
</style>
