<template>
  <q-card class="shadow-1 urgent-table-card å">
    <q-card-section class="row items-center justify-between q-pb-none">
      <div class="row items-center">
        <q-icon name="whatshot" color="red" size="sm" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold text-grey-9">งานด่วน / ลำดับความสำคัญสูง</div>
      </div>
      <q-btn
        flat
        class="text-grey-7 text-caption"
        icon-right="sort"
        label="เรียงลำดับ"
        dense
        no-caps
      />
    </q-card-section>

    <q-card-section class="q-px-none">
      <q-table
        :rows="items"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
        class="urgent-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-grey-6 text-weight-medium"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer hover-bg">
            <!-- ID -->
            <q-td key="id" :props="props" class="text-grey-8">
              {{ props.row.id }}
            </q-td>

            <!-- Device Name & Model -->
            <q-td key="name" :props="props">
              <div class="column">
                <span class="text-weight-bold text-grey-9">{{ props.row.name }}</span>
                <span class="text-caption text-grey-6">{{ props.row.model }}</span>
              </div>
            </q-td>

            <!-- Department -->
            <q-td key="dept" :props="props">
              <q-badge
                :style="`background: var(--q-${props.row.deptColor}); color: var(--q-${props.row.deptTextColor});`"
                class="q-px-sm q-py-xs text-weight-bold rounded-borders"
              >
                {{ props.row.dept }}
              </q-badge>
            </q-td>

            <!-- Status -->
            <q-td key="status" :props="props">
              <div class="row items-center">
                <div
                  :class="`text-caption text-weight-bold text-${props.row.statusColor}`"
                  style="position: relative; padding-left: 12px"
                >
                  <span
                    :class="`bg-${props.row.statusColor}`"
                    style="
                      position: absolute;
                      left: 0;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                    "
                  ></span>
                  {{ props.row.status }}
                </div>
              </div>
            </q-td>

            <!-- Due Date -->
            <q-td key="dueDate" :props="props" class="text-weight-bold text-grey-9">
              {{ props.row.dueDate }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  items: any[];
}>();

const columns = [
  { name: 'id', required: true, label: 'รหัสครุภัณฑ์', align: 'left', field: 'id' },
  { name: 'name', required: true, label: 'ชื่อเครื่องมือ', align: 'left', field: 'name' },
  { name: 'dept', required: true, label: 'แผนก', align: 'left', field: 'dept' },
  { name: 'status', required: true, label: 'สถานะ', align: 'left', field: 'status' },
  { name: 'dueDate', required: true, label: 'กำหนดส่ง', align: 'right', field: 'dueDate' },
] as any;
</script>

<style scoped>
.urgent-table-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.urgent-table :deep(th) {
  font-size: 0.85rem;
}

.urgent-table :deep(tbody tr:hover) {
  background: #fafafa;
}

.rounded-borders {
  border-radius: 6px;
}
</style>
