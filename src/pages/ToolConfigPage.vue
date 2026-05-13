<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStandardToolStore } from '../stores/standardTools';
import { useCalibrationSettingStore } from '../stores/calibrationSetting';
import type { StandardTool } from '../stores/standardTools';
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
const standardToolStore = useStandardToolStore();
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
  standardToolId?: number | undefined;
}

/* ── State ── */
const selectedStandardTools = ref<StandardTool[]>([]);
const qualitativeParams = ref<
  {
    name: string;
    testItems: { name: string; result: 'pass' | 'fail' | null }[];
    standardToolId?: number | undefined;
  }[]
>([]);
const quantitativeParams = ref<QuantitativeParam[]>([]);

// No longer using showAddProcessDialog
const showAddStandardDialog = ref(false);
const selectedToolToAdd = ref<StandardTool | null>(null);

onMounted(async () => {
  await standardToolStore.fetchTools();
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
          standardToolId: s.standardTools?.[0]?.id,
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
          standardToolId: s.standardTools?.[0]?.id,
        }));

      // Standard tools - Collect unique standard tools from ALL parameters
      const allTools = new Map<number, StandardTool>();
      existing.forEach((s) => {
        if (s.standardTools) {
          s.standardTools.forEach((t) => {
            if (t.id) allTools.set(t.id, t);
          });
        }
      });
      selectedStandardTools.value = Array.from(allTools.values());
    }
  }
});

function confirmAddStandard() {
  if (selectedToolToAdd.value) {
    selectedStandardTools.value.push(selectedToolToAdd.value);
    selectedToolToAdd.value = null;
    showAddStandardDialog.value = false;
  }
}

function removeStandard(i: number) {
  selectedStandardTools.value.splice(i, 1);
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

    const globalToolIds = selectedStandardTools.value
      .map((t) => t.id)
      .filter((id): id is number => id !== undefined);

    // Map quantitative
    quantitativeParams.value.forEach((qp) => {
      // Create a unique list of IDs for this parameter
      // The specifically selected tool comes first, then we append all other global tools
      const toolIdsSet = new Set<number>();
      if (qp.standardToolId) toolIdsSet.add(qp.standardToolId);
      globalToolIds.forEach(id => toolIdsSet.add(id));
      
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
        standard_tool_ids: Array.from(toolIdsSet),
      });
    });

    // Map qualitative
    qualitativeParams.value.forEach((qp) => {
      const toolIdsSet = new Set<number>();
      if (qp.standardToolId) toolIdsSet.add(qp.standardToolId);
      globalToolIds.forEach(id => toolIdsSet.add(id));

      payload.push({
        equipment_name: toolName.value,
        type: 'qualitative',
        parameter_name: qp.name,
        test_values: qp.testItems.map((item) => ({ label: item.name, value: 0 })),
        standard_tool_ids: Array.from(toolIdsSet),
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
      <div class="section-header">เครื่องมือมาตรฐาน</div>
      <div class="q-pa-md row q-col-gutter-md items-stretch">
        <!-- Always render 3 slots -->
        <div v-for="slot in 3" :key="slot" class="col-4">
          <!-- Filled slot: show tool card -->
          <template v-if="selectedStandardTools[slot - 1]">
            <ConfigStandardToolCard
              :tool="selectedStandardTools[slot - 1]!"
              @remove="removeStandard(slot - 1)"
            />
          </template>

          <!-- First empty slot only: show add card -->
          <template v-else-if="slot - 1 === selectedStandardTools.length">
            <div
              class="add-tool-card flex flex-center cursor-pointer"
              @click="showAddStandardDialog = true"
            >
              <div class="column items-center">
                <div class="add-icon-circle q-mb-sm">
                  <q-icon name="add" size="32px" color="white" />
                </div>
                <span class="text-caption text-weight-bold text-grey-6"
                  >เพิ่มเครื่องมือมาตรฐาน</span
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
            v-model:standardToolId="param.standardToolId"
            :tool-options="selectedStandardTools"
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
            :tool-options="selectedStandardTools"
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

    <!-- ── Dialog: Add Standard Tool ── -->
    <q-dialog v-model="showAddStandardDialog">
      <q-card style="width: 400px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6">เลือกเครื่องมือมาตรฐาน</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedToolToAdd"
            :options="standardToolStore.tools"
            option-label="name"
            label="เลือกเครื่องมือ"
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
            :disable="!selectedToolToAdd"
            @click="confirmAddStandard"
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
  min-height: 280px;
  border: 2px dashed #c0c0c0;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.2s ease;

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
</style>
