<template>
  <q-page padding class="bg-grey-1">
    <!-- Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">รับรองการสอบเทียบ</div>
    <div class="text-caption text-grey-6 q-mb-md">ตรวจสอบและรับรองผลการสอบเทียบเครื่องมือแพทย์</div>

    <!-- Toolbar -->
    <div class="filters-row q-mb-md">
      <SearchBar v-model="store.searchQuery" placeholder="ค้นหา..." />
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
        style="width: 250px"
      />
      <q-space />
      <div class="col-auto row q-gutter-sm">
        <q-btn
          flat
          round
          icon="list"
          :class="viewMode === 'list' ? 'bg-grey-3' : 'bg-white'"
          @click="viewMode = 'list'"
          class="border-grey"
        />
        <q-btn
          flat
          round
          icon="apps"
          :class="viewMode === 'grid' ? 'bg-grey-3' : 'bg-white'"
          @click="viewMode = 'grid'"
          class="border-grey"
        />
      </div>
    </div>
    <!-- Table View -->
    <q-card v-if="viewMode === 'list'" flat bordered class="rounded-borders approval-card bg-white">
      <q-table
        :rows="store.filteredApprovals"
        :columns="columns"
        row-key="id"
        flat
        class="cal-table"
        :rows-per-page-options="[15, 20, 50]"
        no-data-label="ไม่พบข้อมูล"
      >
        <!-- Custom header -->
        <template #header="props">
          <q-tr :props="props" class="bg-secondary text-white">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="font-weight-medium"
              style="font-size: 13px"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom body -->
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props" class="text-center">{{ props.row.id }}</q-td>
            <q-td key="toolName" :props="props" class="text-center">{{ props.row.toolName }}</q-td>
            <q-td key="toolCode" :props="props" class="text-center">{{ props.row.toolCode }}</q-td>
            <q-td key="location" :props="props" class="text-center">{{ props.row.location }}</q-td>
            <q-td key="calDate" :props="props" class="text-center">{{ props.row.calDate }}</q-td>
            <q-td key="result" :props="props">
              <div class="text-positive text-weight-medium flex flex-center gap-xs">
                <q-icon name="check_circle_outline" size="18px" />
                {{ props.row.result }}
              </div>
            </q-td>
            <q-td key="action" :props="props" class="text-right">
              <q-btn
                color="primary"
                label="รับรองการสอบเทียบ"
                unelevated
                class="q-px-md shadow-1 text-weight-medium"
                style="font-size: 14px"
                @click="handleOpenApproval(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <!-- Grid View -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="item in store.filteredApprovals"
        :key="'grid-' + item.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <ApprovalCard :item="item" @approve="store.approveEvent($event)" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { QTableProps } from 'quasar';
import type { ApprovalEvent } from 'src/types';
import { useApprovalsStore } from 'src/stores/approvals';
import { useCalibrationRecordStore } from 'src/stores/calibrationRecord';
import { useInspectionStore } from 'src/stores/inspection';
import SearchBar from 'src/components/SearchBar.vue';
import ApprovalCard from 'src/components/approval/ApprovalCard.vue';

const store = useApprovalsStore();
const calStore = useCalibrationRecordStore();
const inspectionStore = useInspectionStore();
const router = useRouter();
const viewMode = ref<'list' | 'grid'>('list');

/** Pre-populate stores with the clicked row's data BEFORE navigating */
function handleOpenApproval(row: ApprovalEvent) {
  calStore.equipmentDetails.name = row.toolName;
  calStore.equipmentDetails.code = row.toolCode;
  calStore.locationDetails.hospital = row.location;

  inspectionStore.deviceInfo = {
    ...inspectionStore.deviceInfo,
    deviceName: row.toolName,
    assetCode: row.toolCode,
    location: row.location,
  };

  void router.push('/approval/' + row.id);
}

const columns: QTableProps['columns'] = [
  { name: 'id', label: 'รหัสสอบเทียบ', field: 'id', align: 'left', sortable: true },
  { name: 'toolName', label: 'ชื่อเครื่องมือ', field: 'toolName', align: 'left', sortable: true },
  { name: 'toolCode', label: 'รหัสเครื่อง', field: 'toolCode', align: 'left', sortable: true },
  { name: 'location', label: 'ที่ตั้ง', field: 'location', align: 'left', sortable: true },
  { name: 'calDate', label: 'วันที่สอบเทียบ', field: 'calDate', align: 'left', sortable: true },
  { name: 'result', label: 'ผลการสอบเทียบ', field: 'result', align: 'center', sortable: true },
  { name: 'action', label: '', field: 'action', align: 'right' },
];
</script>

<style scoped lang="scss">
.border-grey {
  border: 1px solid #e0e0e0;
}
.gap-xs {
  gap: 4px;
}
.approval-card {
  border-color: #e0e0e0;
  overflow: hidden;
}
.filters-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
