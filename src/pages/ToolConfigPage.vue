<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStandardToolCategoryStore } from '../stores/standardToolCategory';
import { useCalibrationSettingStore } from '../stores/calibrationSetting';
import type { StandardToolCategory } from '../stores/standardToolCategory';
import type {
  CalibrationSetting,
  CalibrationTestValue,
} from '../services/calibration-setting.service';
import ConfigStandardToolCard from '../components/tools/config/ConfigStandardToolCard.vue';
import ConfigQualitativeBlock from '../components/tools/config/ConfigQualitativeBlock.vue';
import ConfigQuantitativeBlock from '../components/tools/config/ConfigQuantitativeBlock.vue';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const categoryStore = useStandardToolCategoryStore();
const settingStore = useCalibrationSettingStore();
const toolName = computed(() => decodeURIComponent(String(route.params.name ?? '')));
const isInfusionPump = computed(() => {
  const name = toolName.value.toLowerCase();
  // Include common variations and Thai keywords for Infusion/Syringe Pumps
  return (
    name.includes('infusion') ||
    name.includes('syringe') ||
    name.includes('pump') ||
    name.includes('เครื่องให้สารระลาย') ||
    name.includes('เครื่องให้ยา')
  );
});

/* ── Types ── */
interface QuantitativeParam {
  parameter: string;
  unit: string;
  tolerance: string;
  stdType: string;
  display: string;
  uncertainty: string;
  ucb1: string;
  ucb2: string;
  ucb3: string;
  testValues: { label: string; value: number }[];
  categoryId?: number | undefined;
}

/* ── State ── */
const selectedCategories = ref<StandardToolCategory[]>([]);
const qualitativeParams = ref<
  {
    name: string;
    testItems: { name: string; result: 'pass' | 'fail' | null }[];
    categoryId?: number | undefined;
  }[]
>([]);
const quantitativeParams = ref<QuantitativeParam[]>([]);

// No longer using showAddProcessDialog
const showAddCategoryDialog = ref(false);
const selectedCategoryToAdd = ref<StandardToolCategory | null>(null);

onMounted(async () => {
  await categoryStore.fetchCategories();
  if (toolName.value) {
    const existing = await settingStore.fetchSettings(toolName.value);
    if (existing && existing.length > 0) {
      // Map backend to frontend
      qualitativeParams.value = existing
        .filter((s) => s.type === 'qualitative')
        .map((s) => ({
          name: s.parameter_name,
          testItems: s.test_values
            ? s.test_values.map((v: CalibrationTestValue) => ({
                name: v.label,
                result: null,
              }))
            : [],
          categoryId: s.categories?.[0]?.id,
        }));

      quantitativeParams.value = existing
        .filter((s) => s.type === 'quantitative')
        .map((s) => ({
          parameter: s.parameter_name,
          unit: s.unit || '',
          tolerance: s.tolerance || '1.0',
          stdType: s.std_type || '1 - แบบอ้างอิงเครื่องมือมาตรฐาน',
          display: s.display_type || 'Digital',
          uncertainty: s.resolution || '0', // mapped resolution to uncertainty in UI
          ucb1: s.ucb1 || '0',
          ucb2: s.ucb2 || '0',
          ucb3: s.ucb3 || '0',
          testValues: s.test_values || [],
          categoryId: s.categories?.[0]?.id,
        }));

      // Collect unique categories from ALL parameters
      const allCats = new Map<number, StandardToolCategory>();
      existing.forEach((s) => {
        if (s.categories) {
          s.categories.forEach((c) => {
            if (c.id) allCats.set(c.id, c);
          });
        }
      });
      selectedCategories.value = Array.from(allCats.values());
    }
  }
});

function confirmAddCategory() {
  if (selectedCategoryToAdd.value) {
    if (!selectedCategories.value.find(c => c.id === selectedCategoryToAdd.value?.id)) {
      selectedCategories.value.push(selectedCategoryToAdd.value);
    }
    selectedCategoryToAdd.value = null;
    showAddCategoryDialog.value = false;
  }
}

function removeCategory(i: number) {
  selectedCategories.value.splice(i, 1);
}

function addQuantitative() {
  quantitativeParams.value.push({
    parameter: '',
    unit: '',
    tolerance: '1.0',
    stdType: '1 - แบบอ้างอิงเครื่องมือมาตรฐาน',
    display: 'Digital',
    uncertainty: '0',
    ucb1: '0',
    ucb2: '0',
    ucb3: '0',
    testValues: [
      { label: 'ค่าทดสอบที่ 1', value: 0 },
      { label: 'ค่าทดสอบที่ 2', value: 0 },
      { label: 'ค่าทดสอบที่ 3', value: 0 },
    ],
  });
}

function addQualitative() {
  qualitativeParams.value.push({
    name: '',
    testItems: [
      { name: '', result: null },
      { name: '', result: null },
      { name: '', result: null },
    ],
  });
}

function removeQualitative(i: number) {
  qualitativeParams.value.splice(i, 1);
}

function removeQuantitative(i: number) {
  quantitativeParams.value.splice(i, 1);
}

async function saveConfig() {
  if (!toolName.value) return;

  try {
    const payload: CalibrationSetting[] = [];

    const globalCategoryIds = selectedCategories.value
      .map((c) => c.id)
      .filter((id): id is number => id !== undefined);

    // Map quantitative
    quantitativeParams.value.forEach((qp) => {
      const catIdsSet = new Set<number>();
      if (qp.categoryId) catIdsSet.add(qp.categoryId);
      globalCategoryIds.forEach(id => catIdsSet.add(id));
      
      payload.push({
        equipment_name: toolName.value,
        type: 'quantitative',
        parameter_name: qp.parameter,
        unit: qp.unit,
        tolerance: qp.tolerance,
        std_type: qp.stdType,
        display_type: qp.display,
        resolution: qp.uncertainty,
        ucb1: qp.ucb1,
        ucb2: qp.ucb2,
        ucb3: qp.ucb3,
        test_values: qp.testValues,
        category_ids: Array.from(catIdsSet),
      });
    });

    // Map qualitative
    qualitativeParams.value.forEach((qp) => {
      const catIdsSet = new Set<number>();
      if (qp.categoryId) catIdsSet.add(qp.categoryId);
      globalCategoryIds.forEach(id => catIdsSet.add(id));

      payload.push({
        equipment_name: toolName.value,
        type: 'qualitative',
        parameter_name: qp.name,
        test_values: qp.testItems.map((item) => ({ label: item.name, value: 0 })),
        category_ids: Array.from(catIdsSet),
      });
    });

    console.log('Final Payload to save:', JSON.stringify(payload, null, 2));
    await settingStore.saveSettings(toolName.value, payload);

    $q.notify({
      type: 'positive',
      message: 'บันทึกการตั้งค่าสำเร็จ',
      position: 'top-right',
    });

    void router.push('/tools/manage?tab=settings');
  } catch (error) {
    console.error('Save error:', error);
    $q.notify({
      type: 'negative',
      message: 'ไม่สามารถบันทึกการตั้งค่าได้',
      position: 'top-right',
    });
  }
}
</script>

<template>
  <q-page padding class="bg-white">
    <!-- Page Header -->
    <div class="q-mb-md">
      <div class="text-subtitle2 text-grey-6">ตั้งค่าเครื่องมือแพทย์</div>
      <div class="text-h6 text-weight-bold">{{ toolName }}</div>
      <div class="text-caption text-grey-6">ประเภท : Medical</div>
    </div>

    <!-- ── Section: เครื่องมือมาตรฐาน ──────────────── -->
    <div class="section-container q-mb-lg">
      <div class="section-header">ประเภทเครื่องมือมาตรฐานที่ต้องใช้</div>
      <div class="q-pa-md row q-col-gutter-md items-stretch">
        <!-- Always render 3 slots -->
        <div v-for="slot in 3" :key="slot" class="col-4 column items-stretch">
          <!-- Filled slot: show category card -->
          <template v-if="selectedCategories[slot - 1]">
            <ConfigStandardToolCard
              :tool="{ name: selectedCategories[slot - 1]!.name } as any"
              @remove="removeCategory(slot - 1)"
            />
          </template>

          <!-- First empty slot only: show add card -->
          <template v-else-if="slot - 1 === selectedCategories.length">
            <div
              class="add-tool-card cursor-pointer"
              @click="showAddCategoryDialog = true"
            >
              <div class="column items-center">
                <div class="add-icon-circle q-mb-sm">
                  <q-icon name="add" size="32px" color="white" />
                </div>
                <span class="text-caption text-weight-bold text-grey-6"
                  >เพิ่มประเภทเครื่องมือ</span
                >
              </div>
            </div>
          </template>

          <!-- Other empty slots: blank placeholder -->
          <template v-else>
            <div class="blank-slot" />
          </template>
        </div>
      </div>
    </div>

    <!-- ── Section: พารามิเตอร์การสอบเทียบเชิงคุณภาพ ──────────────── -->
    <div class="section-container q-mb-lg">
      <div class="section-header row items-center justify-between">
        <span>พารามิเตอร์การสอบเทียบเชิงคุณภาพ</span>
        <q-btn
          unelevated
          dense
          icon="add"
          label="เพิ่มพารามิเตอร์"
          class="btn-add q-px-md text-capitalize"
          @click="addQualitative"
        />
      </div>
      <div class="q-pa-md">
        <div v-for="(param, i) in qualitativeParams" :key="i">
          <ConfigQualitativeBlock
            :index="i + 1"
            v-model:parameterName="param.name"
            v-model:testItems="param.testItems"
            v-model:categoryId="param.categoryId"
            :category-options="selectedCategories"
            @remove="removeQualitative(i)"
          />
        </div>
      </div>
    </div>

    <!-- ── Section: พารามิเตอร์การสอบเทียบเชิงปริมาณ ──────────────── -->
    <div class="section-container q-mb-lg">
      <div class="section-header row items-center justify-between">
        <span>พารามิเตอร์การสอบเทียบเชิงปริมาณ</span>
        <q-btn
          unelevated
          dense
          icon="add"
          label="เพิ่มพารามิเตอร์"
          class="btn-add q-px-md text-capitalize"
          @click="addQuantitative"
        />
      </div>
      <div class="q-pa-md">
        <div v-for="(_, i) in quantitativeParams" :key="i">
          <ConfigQuantitativeBlock
            v-if="quantitativeParams[i]"
            :index="i + 1"
            v-model:data="quantitativeParams[i]"
            :show-ucb="isInfusionPump"
            :category-options="selectedCategories"
            @remove="removeQuantitative(i)"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="row justify-between q-pt-lg border-top">
      <q-btn flat label="ยกเลิก" class="btn-cancel q-px-xl" @click="router.back()" />
      <q-btn unelevated label="บันทึก" color="secondary" class="q-px-xl" @click="saveConfig" />
    </div>

    <!-- ── Dialog: Add Category ── -->
    <q-dialog v-model="showAddCategoryDialog">
      <q-card style="width: 400px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6">เลือกประเภทเครื่องมือมาตรฐาน</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedCategoryToAdd"
            :options="categoryStore.categories"
            option-label="name"
            label="เลือกประเภท"
            outlined
            dense
            clearable
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ยกเลิก" v-close-popup />
          <q-btn
            flat
            label="เพิ่ม"
            color="secondary"
            :disable="!selectedCategoryToAdd"
            @click="confirmAddCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Add Standard Tool already here -->
  </q-page>
</template>

<style scoped lang="scss">
.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  background-color: $secondary;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-add {
  background: $primary !important;
  color: #fff !important;
  border-radius: 6px;
  font-size: 13px;
}

.add-tool-card {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px dashed #c0c0c0;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &:hover {
    border-color: $secondary;
    background: #f5f5ff;
  }
}

.add-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: $secondary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-top {
  border-top: 1px solid #eee;
}

.btn-cancel {
  color: $primary;
  border: 1px solid $primary;
  border-radius: 8px;
}

.blank-slot {
  height: 100%;
  min-height: 200px;
}
</style>
