<template>
  <q-card flat bordered class="q-mb-md overflow-hidden">
    <!-- Full-width secondary color title bar at top of card -->
    <div class="selector-header">เครื่องมือมาตรฐาน</div>

    <div class="q-pa-md">
      <div v-if="standardToolStore.loading || settingStore.loading" class="flex flex-center q-pa-lg">
        <q-spinner color="primary" size="3em" />
        <div class="q-ml-md text-grey-7">กำลังโหลดข้อมูลเครื่องมือ...</div>
      </div>
      <div v-else-if="settingStore.settings.length === 0" class="q-pa-lg text-center text-grey-7">
        <q-icon name="warning" size="md" color="warning" />
        <div class="q-mt-sm">ไม่พบการตั้งค่าเครื่องมือสำหรับอุปกรณ์นี้ (Settings Empty)</div>
      </div>
      <div v-else class="row q-col-gutter-lg">
        <!-- We allow selecting up to 2 tools as per current design -->
        <div v-for="index in [0, 1]" :key="index" class="col-12 col-md-6">
          <!-- Dropdown ABOVE the inner card, aligned right -->
          <div v-if="!readonly" class="row justify-end q-mb-sm">
            <q-select
              v-model="selectedTools[index]"
              :options="filteredTools"
              option-label="name"
              outlined
              dense
              bg-color="white"
              style="min-width: 150px"
              :label="allowedToolIds.length > 0 ? 'เครื่องมือที่กำหนด' : 'เลือกเครื่องมือ'"
              @update:model-value="updateSelectedIds"
              :readonly="allowedToolIds.length > 0 && filteredTools.length <= index + 1 && !!selectedTools[index]"
            >
              <template v-if="allowedToolIds.length > 0" v-slot:before>
                <q-icon name="lock" color="primary" size="xs" />
              </template>
            </q-select>
          </div>

          <!-- Info card -->
          <q-card flat bordered class="bg-white equip-card">
            <q-card-section class="q-pa-md">
              <!-- Icon + type name centered -->
              <div class="column items-center q-mb-sm">
                <q-icon name="app:med" size="42px" color="secondary" class="q-mb-xs" />
                <div class="text-weight-bold text-subtitle1">
                  {{ selectedTools[index]?.name || 'ยังไม่ได้เลือก' }}
                </div>
              </div>

              <!-- Info rows -->
              <div class="info-grid">
                <span class="label-text">รุ่น</span>
                <span class="value-text">{{ selectedTools[index]?.model || '-' }}</span>

                <span class="label-text">บริษัท</span>
                <span class="value-text">{{ selectedTools[index]?.manufacturer || '-' }}</span>

                <span class="label-text">หมายเลขประจำเครื่อง</span>
                <span class="value-text">{{ selectedTools[index]?.serialNumber || '-' }}</span>

                <span class="label-text">หน่วยวัด</span>
                <span class="value-text">{{ selectedTools[index]?.unit || '-' }}</span>

                <span class="label-text">วันที่สอบเทียบ</span>
                <span class="value-text">{{
                  selectedTools[index]?.lastCalibrationDate || '-'
                }}</span>

                <span class="label-text">หมายเลขใบรับรอง</span>
                <span class="value-text">{{ selectedTools[index]?.certificateNumber || '-' }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';
import { useStandardToolStore } from 'stores/standardTools';
import { useCalibrationSettingStore } from 'stores/calibrationSetting';
import type { StandardTool } from 'stores/standardTools';

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    selectedIds?: number[];
  }>(),
  { readonly: false },
);

const store = useCalibrationRecordStore();
const standardToolStore = useStandardToolStore();
const settingStore = useCalibrationSettingStore();

const selectedTools = ref<(StandardTool | null)[]>([null, null]);

// Compute allowed tool IDs from current equipment settings
const allowedToolIds = computed(() => {
  console.log('[StandardEquipmentSelector] Raw Settings:', settingStore.settings);
  const ids = settingStore.settings
    .flatMap((s) => s.standard_tool_ids || [])
    .filter((id) => id !== null && id !== undefined && String(id) !== '')
    .map((id) => Number(id)); // Ensure it's a number
  const uniqueIds = [...new Set(ids)];
  console.log('[StandardEquipmentSelector] Allowed Tool IDs:', uniqueIds);
  return uniqueIds;
});

// Filtered tools list for the dropdown
const filteredTools = computed(() => {
  if (allowedToolIds.value.length === 0) {
    return standardToolStore.tools; // Fallback if no specific tools are locked
  }
  return standardToolStore.tools.filter((t) => allowedToolIds.value.includes(Number(t.id)));
});

// Sync from store on initial load or if store updates
watch(
  () => store.standardToolIds,
  (newIds) => {
    if (newIds && newIds.length > 0 && selectedTools.value.every((t) => t === null)) {
      console.log('[StandardEquipmentSelector] Populating from store:', newIds);
      newIds.forEach((id, index) => {
        if (index < 2) {
          const tool = standardToolStore.tools.find((t) => Number(t.id) === Number(id));
          if (tool) selectedTools.value[index] = tool;
        }
      });
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await standardToolStore.fetchTools();
  
  if (props.readonly && props.selectedIds && props.selectedIds.length > 0) {
    // Fill selectedTools based on selectedIds (Read-only view)
    props.selectedIds.forEach((id, index) => {
      if (index < 2) {
        const tool = standardToolStore.tools.find((t) => t.id === id);
        if (tool) {
          selectedTools.value[index] = tool;
        }
      }
    });
  } else if (!props.readonly) {
    autoSelectFromConfig();
  }
});

// Watch for changes in filteredTools (when settings are loaded)
watch(
  allowedToolIds,
  (newIds) => {
    if (newIds.length > 0) {
      window.alert(`[Lock] พบการตั้งค่าเครื่องมือมาตรฐาน IDs: ${JSON.stringify(newIds)}`);
    } else {
      console.warn('[StandardEquipmentSelector] No allowed tools found for this equipment.');
    }
  },
  { immediate: true },
);

watch(
  filteredTools,
  () => {
    // ONLY auto-select if we aren't in read-only mode AND the selection is currently empty
    // This prevents wiping out previously saved tools when reloading the page
    if (!props.readonly && selectedTools.value.every((t) => t === null)) {
      autoSelectFromConfig();
    }
  },
  { immediate: true },
);

// Watch for selection changes and sync to store
watch(
  selectedTools,
  () => {
    updateSelectedIds();
  },
  { deep: true },
);

function autoSelectFromConfig() {
  if (allowedToolIds.value.length > 0) {
    allowedToolIds.value.forEach((id, index) => {
      if (index < 2 && !selectedTools.value[index]) {
        const tool = standardToolStore.tools.find((t) => Number(t.id) === Number(id));
        if (tool) {
          selectedTools.value[index] = tool;
        }
      }
    });
    // No need to call updateSelectedIds here as the watcher will handle it
  }
}

function updateSelectedIds() {
  const ids = selectedTools.value
    .filter((t): t is StandardTool => t !== null)
    .map((t) => t.id);
  console.log('[StandardEquipmentSelector] Syncing standardToolIds to store:', ids);
  store.standardToolIds = ids;
}
</script>

<style scoped lang="scss">
.selector-header {
  background-color: $secondary;
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}

.equip-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
}

.label-text {
  color: #666;
  font-weight: 500;
  font-size: 13px;
}

.value-text {
  text-align: right;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 13px;
}
</style>
