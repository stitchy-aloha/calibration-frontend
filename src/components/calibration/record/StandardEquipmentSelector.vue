<template>
  <q-card flat bordered class="q-mb-md overflow-hidden">
    <!-- Full-width secondary color title bar at top of card -->
    <div class="selector-header">เครื่องมือมาตรฐาน</div>

    <div class="q-pa-md">
      <div v-if="standardToolStore.loading" class="flex flex-center q-pa-lg">
        <q-spinner color="primary" size="3em" />
      </div>
      <div v-else class="row q-col-gutter-lg">
        <!-- We allow selecting up to 2 tools as per current design -->
        <div v-for="index in [0, 1]" :key="index" class="col-12 col-md-6">
          <!-- Dropdown ABOVE the inner card, aligned right -->
          <div v-if="!readonly" class="row justify-end q-mb-sm">
            <q-select
              v-model="selectedTools[index]"
              :options="standardToolStore.tools"
              option-label="name"
              outlined
              dense
              bg-color="white"
              style="min-width: 150px"
              label="เลือกเครื่องมือ"
              @update:model-value="updateSelectedIds"
            />
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
                <span class="value-text">{{ selectedTools[index]?.lastCalibrationDate || '-' }}</span>

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
import { onMounted, ref } from 'vue';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';
import { useStandardToolStore } from 'stores/standardTools';
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

const selectedTools = ref<(StandardTool | null)[]>([null, null]);

onMounted(async () => {
  await standardToolStore.fetchTools();
  if (props.readonly && props.selectedIds && props.selectedIds.length > 0) {
    // Fill selectedTools based on selectedIds
    props.selectedIds.forEach((id, index) => {
      if (index < 2) {
        const tool = standardToolStore.tools.find((t) => t.id === id);
        if (tool) {
          selectedTools.value[index] = tool;
        }
      }
    });
  }
});

function updateSelectedIds() {
  store.standardToolIds = selectedTools.value
    .filter((t): t is StandardTool => t !== null)
    .map((t) => t.id);
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
