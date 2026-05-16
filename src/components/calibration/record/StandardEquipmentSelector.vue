<template>
  <q-card flat bordered class="q-mb-md overflow-hidden">
    <!-- Full-width secondary color title bar at top of card -->
    <div class="selector-header">เครื่องมือมาตรฐาน</div>

    <div class="q-pa-md">
      <div
        v-if="standardToolStore.loading || settingStore.loading"
        class="flex flex-center q-pa-lg"
      >
        <q-spinner color="primary" size="3em" />
        <div class="q-ml-md text-grey-7">กำลังโหลดข้อมูลเครื่องมือ...</div>
      </div>
      <div v-else-if="settingStore.settings.length === 0" class="q-pa-lg text-center text-grey-7">
        <q-icon name="warning" size="md" color="warning" />
        <div class="q-mt-sm">ไม่พบการตั้งค่าเครื่องมือสำหรับอุปกรณ์นี้ (Settings Empty)</div>
      </div>
      <div v-else class="row q-col-gutter-lg">
        <!-- We allow selecting up to 2 tools as per current design -->
        <div v-for="(_, index) in totalSlots" :key="index" class="col-12 col-md-6">
          <!-- Category Title (Hidden if selected to keep it clean) -->
          <div
            v-if="!selectedTools[index]"
            class="text-subtitle2 text-primary q-mb-xs q-ml-sm text-weight-bold"
          ></div>
          <!-- Dropdown ABOVE the inner card, aligned right -->
          <div v-if="!readonly" class="row justify-end q-mb-sm">
            <q-select
              v-model="selectedTools[index]"
              :options="getFilteredToolsForSlot(index)"
              outlined
              dense
              bg-color="white"
              style="min-width: 150px"
              :label="getCategoryName(allowedCategoryIds[index])"
              @update:model-value="updateSelectedIds"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.model }} | S/N: {{ scope.opt.serialNumber }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="text-truncate" style="max-width: 140px">
                  {{ scope.opt.name }}
                </div>
              </template>
            </q-select>
          </div>

          <!-- Info card -->
          <q-card flat bordered class="bg-white equip-card">
            <q-card-section class="q-pa-md">
              <!-- Icon + type name centered -->
              <div class="column items-center q-mb-sm">
                <q-icon name="app:med" size="42px" color="secondary" class="q-mb-xs" />
                <div class="text-weight-bold text-subtitle1 text-center text-primary">
                  {{
                    selectedTools[index]
                      ? selectedTools[index]?.name
                      : getCategoryName(allowedCategoryIds[index])
                  }}
                </div>
                <div v-if="selectedTools[index]" class="text-caption text-grey-6">
                  {{ selectedTools[index]?.model }} (S/N: {{ selectedTools[index]?.serialNumber }})
                </div>
                <div v-else class="text-caption text-grey-5 italic">(ยังไม่ได้เลือกอุปกรณ์)</div>
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
import { useStandardToolCategoryStore } from 'stores/standardToolCategory';
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
const categoryStore = useStandardToolCategoryStore();

function getCategoryName(catId: number | undefined) {
  if (!catId) return 'เครื่องมือทั่วไป';
  const cat = categoryStore.categories.find((c) => Number(c.id) === Number(catId));
  return cat ? cat.name : 'เลือกเครื่องมือ';
}

// Compute allowed category IDs from current equipment settings
const allowedCategoryIds = computed(() => {
  console.log('[StandardEquipmentSelector] Raw Settings:', settingStore.settings);
  const ids = settingStore.settings
    .flatMap((s) => {
      const fromIds = s.category_ids || [];
      const fromCats = s.categories?.map((c) => c.id) || [];
      return [...fromIds, ...fromCats];
    })
    .filter((id) => id !== null && id !== undefined && String(id) !== '')
    .map((id) => Number(id)); // Ensure it's a number
  const uniqueIds = [...new Set(ids)];
  console.log('[StandardEquipmentSelector] Allowed Category IDs:', uniqueIds);
  return uniqueIds;
});

const totalSlots = computed(() => Math.max(2, allowedCategoryIds.value.length));

const selectedTools = ref<(StandardTool | null)[]>([]);

// Ensure selectedTools has enough slots
watch(
  totalSlots,
  (count) => {
    while (selectedTools.value.length < count) {
      selectedTools.value.push(null);
    }
  },
  { immediate: true },
);

// Get tools filtered for a specific slot index
function getFilteredToolsForSlot(index: number) {
  const catId = allowedCategoryIds.value[index];
  if (!catId) return standardToolStore.tools; // Fallback

  return standardToolStore.tools.filter((t) => Number(t.category_id) === Number(catId));
}

// Sync from store on initial load or if store updates
watch(
  () => store.standardToolIds,
  (newIds) => {
    if (newIds && newIds.length > 0 && selectedTools.value.every((t) => t === null)) {
      console.log('[StandardEquipmentSelector] Populating from store:', newIds);
      newIds.forEach((id, index) => {
        const tool = standardToolStore.tools.find((t) => Number(t.id) === Number(id));
        if (tool) selectedTools.value[index] = tool;
      });
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await Promise.all([standardToolStore.fetchTools(), categoryStore.fetchCategories()]);

  if (props.readonly && props.selectedIds && props.selectedIds.length > 0) {
    // Fill selectedTools based on selectedIds (Read-only view)
    props.selectedIds.forEach((id, index) => {
      const tool = standardToolStore.tools.find((t) => t.id === id);
      if (tool) {
        selectedTools.value[index] = tool;
      }
    });
  } else if (!props.readonly) {
    autoSelectFromConfig();
  }
});

// Watch for changes in allowedCategoryIds (when settings are loaded)
watch(
  allowedCategoryIds,
  (newIds) => {
    if (newIds.length > 0) {
      console.log(`[Lock] พบการตั้งค่าประเภทเครื่องมือมาตรฐาน IDs: ${JSON.stringify(newIds)}`);
    } else {
      console.warn('[StandardEquipmentSelector] No allowed categories found for this equipment.');
    }
  },
  { immediate: true },
);

watch(
  [allowedCategoryIds, () => standardToolStore.tools],
  () => {
    // ONLY auto-select if we aren't in read-only mode
    if (!props.readonly) {
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
  if (allowedCategoryIds.value.length > 0) {
    // Pick one unit for each category required
    allowedCategoryIds.value.forEach((catId, index) => {
      if (!selectedTools.value[index]) {
        const firstInCat = standardToolStore.tools.find(
          (t) => Number(t.category_id) === Number(catId),
        );
        if (firstInCat) {
          selectedTools.value[index] = firstInCat;
        }
      }
    });
  }
}

function updateSelectedIds() {
  const ids = selectedTools.value.filter((t): t is StandardTool => t !== null).map((t) => t.id);
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
