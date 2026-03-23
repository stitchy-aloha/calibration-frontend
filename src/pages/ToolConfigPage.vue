<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStandardToolStore } from 'src/stores/standardTools';
import type { StandardTool } from 'src/stores/standardTools';
import ConfigStandardToolCard from 'src/components/tools/config/ConfigStandardToolCard.vue';
import ConfigQualitativeBlock from 'src/components/tools/config/ConfigQualitativeBlock.vue';
import ConfigQuantitativeBlock from 'src/components/tools/config/ConfigQuantitativeBlock.vue';

const route = useRoute();
const router = useRouter();
const standardToolStore = useStandardToolStore();

import { computed } from 'vue';
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
}

/* ── State ── */
const selectedStandardTools = ref<StandardTool[]>([]);
const qualitativeParams = ref<{ name: string }[]>([{ name: 'EKG' }]);
const quantitativeParams = ref<QuantitativeParam[]>([
  {
    parameter: 'Systolic Pressure',
    unit: 'mmHg',
    tolerance: '0.8',
    stdType: '1 - แบบอ้างอิงเครื่องมือมาตรฐาน',
    display: 'Digital',
    uncertainty: '1',
    ucb1: '0',
    ucb2: '0',
    ucb3: '0',
    testValues: [
      { label: 'ค่าทดสอบที่ 1', value: 80 },
      { label: 'ค่าทดสอบที่ 2', value: 120 },
      { label: 'ค่าทดสอบที่ 3', value: 140 },
    ],
  },
]);

// No longer using showAddProcessDialog
const showAddStandardDialog = ref(false);
const selectedToolToAdd = ref<StandardTool | null>(null);

onMounted(async () => {
  await standardToolStore.fetchTools();
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
  qualitativeParams.value.push({ name: '' });
}

function removeQualitative(i: number) {
  qualitativeParams.value.splice(i, 1);
}

function removeQuantitative(i: number) {
  quantitativeParams.value.splice(i, 1);
}

function saveConfig() {
  router.push('/tools/manage?tab=settings').catch(console.error);
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
