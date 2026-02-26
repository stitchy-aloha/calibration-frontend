<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">ตั้งค่าเครื่องมือแพทย์</div>
    <div class="text-h6 q-mb-none text-weight-bold">{{ toolName }}</div>
    <div class="text-caption text-grey-6 q-mb-md">ประเภท : {{ toolType }}</div>

    <!-- Tabs -->
    <div class="config-tabs q-mb-lg">
      <q-btn
        unelevated
        :class="['tab-btn', activeTab === 'params' ? 'tab-btn--active' : 'tab-btn--inactive']"
        label="พารามิเตอร์"
        @click="activeTab = 'params'"
      />
      <q-btn
        unelevated
        :class="['tab-btn', activeTab === 'standards' ? 'tab-btn--active' : 'tab-btn--inactive']"
        label="เครื่องมือมาตรฐาน"
        @click="activeTab = 'standards'"
      />
    </div>

    <!-- ── Parameters Tab ──────────────────────── -->
    <template v-if="activeTab === 'params'">
      <div class="section-card">
        <div class="section-card__header">
          <span>พารามิเตอร์การสอบเทียบ</span>
          <q-btn flat dense icon="add" label="เพิ่มพารามิเตอร์" class="add-btn" @click="addParam" />
        </div>

        <div v-for="(p, i) in params" :key="i" class="param-row">
          <div class="param-row__number">{{ i + 1 }}</div>
          <div class="param-row__fields">
            <q-input
              v-model="p.name"
              label="ชื่อพารามิเตอร์ *"
              outlined
              dense
              bg-color="white"
              class="param-field"
            />
            <q-input
              v-model="p.unit"
              label="หน่วย *"
              outlined
              dense
              bg-color="white"
              class="param-field"
            />
            <q-input
              v-model="p.tolerance"
              label="ค่าความคลาดเคลื่อน (+/-) *"
              outlined
              dense
              bg-color="white"
              class="param-field"
            />
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            color="grey-5"
            size="sm"
            @click="params.splice(i, 1)"
          />
        </div>
      </div>
    </template>

    <!-- ── Standard Equipment Tab ──────────────── -->
    <template v-if="activeTab === 'standards'">
      <div class="section-card">
        <div class="section-card__header">
          <span>เครื่องมือมาตรฐาน</span>
        </div>

        <div v-for="(s, i) in standards" :key="i" class="standard-card">
          <div class="standard-card__header">เครื่องมือมาตรฐานเครื่องที่ {{ i + 1 }}</div>
          <div class="standard-card__body">
            <div class="form-row">
              <q-select
                v-model="s.type"
                :options="['EKG', 'SPO2', 'NIBP', 'Temp', 'ECG']"
                label="ประเภทเครื่องมือ *"
                outlined
                dense
                bg-color="white"
                class="form-field"
              />
              <q-select
                v-model="s.brand"
                :options="['FLUKE', 'BIOTEK', 'RIGEL']"
                label="บริษัท *"
                outlined
                dense
                bg-color="white"
                class="form-field"
              />
              <q-select
                v-model="s.model"
                :options="['ProSim4', 'SPOT Light', 'SafeTest 60']"
                label="รุ่น *"
                outlined
                dense
                bg-color="white"
                class="form-field"
              />
            </div>
            <div class="serial-row">
              <span class="text-caption text-grey-7">หมายเลขประจำเครื่อง</span>
              <span class="text-caption text-weight-bold q-ml-sm">{{ s.serial || '—' }}</span>
            </div>
          </div>
        </div>

        <q-btn
          flat
          dense
          icon="add"
          label="เพิ่มเครื่องมือมาตรฐาน"
          class="add-btn q-mt-md"
          @click="addStandard"
        />
      </div>
    </template>

    <!-- Footer -->
    <div class="config-footer q-mt-lg">
      <q-btn
        flat
        label="ยกเลิก"
        class="btn-cancel"
        @click="router.push('/tools/manage?tab=settings')"
      />
      <q-btn
        v-if="activeTab === 'params'"
        unelevated
        label="ถัดไป"
        class="btn-save"
        @click="activeTab = 'standards'"
      />
      <q-btn v-else unelevated label="บันทึก" icon="save" class="btn-save" @click="onSave" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToolsStore } from 'src/stores/tools';

const route = useRoute();
const router = useRouter();
const store = useToolsStore();

const toolName = computed(() => decodeURIComponent(String(route.params.name ?? '')));
const toolType = computed(() => {
  const found = store.tools.find((t) => t.name === toolName.value);
  return found?.type ?? 'Medical';
});

const activeTab = ref<'params' | 'standards'>('params');

/* ── Parameters ────────── */
interface Param {
  name: string;
  unit: string;
  tolerance: string;
}

const params = ref<Param[]>([
  { name: 'Systolic Pressure', unit: 'mmHg', tolerance: '1' },
  { name: 'Diastolic Pressure', unit: 'mmHg', tolerance: '1' },
  { name: 'Temp', unit: 'C', tolerance: '1' },
]);

function addParam() {
  params.value.push({ name: '', unit: '', tolerance: '' });
}

/* ── Standard Equipment ── */
interface StandardEquip {
  type: string;
  brand: string;
  model: string;
  serial: string;
}

const standards = ref<StandardEquip[]>([
  { type: 'EKG', brand: 'FLUKE', model: 'ProSim4', serial: '535684' },
  { type: 'SPO2', brand: 'FLUKE', model: 'SPOT Light', serial: '535684' },
  { type: '', brand: '', model: '', serial: '' },
]);

function addStandard() {
  standards.value.push({ type: '', brand: '', model: '', serial: '' });
}

async function onSave() {
  await router.push('/tools/manage?tab=settings');
}
</script>

<style scoped lang="scss">
/* Tabs */
.config-tabs {
  display: flex;
  justify-content: flex-end;
  gap: 0;
}

.tab-btn {
  border-radius: 0 !important;
  padding: 10px 28px;
  font-weight: 600;
  font-size: 14px;

  &:first-child {
    border-radius: 8px 0 0 8px !important;
  }

  &:last-child {
    border-radius: 0 8px 8px 0 !important;
  }
}

.tab-btn--active {
  background: $primary !important;
  color: #fff !important;
}

.tab-btn--inactive {
  background: #e8e0f0 !important;
  color: $primary !important;
}

/* Section Card */
.section-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  overflow: hidden;
}

.section-card__header {
  background: $secondary;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 15px;
}

.add-btn {
  color: #fff !important;
  font-weight: 600;
}

/* Parameter Row */
.param-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.param-row__number {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: $secondary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 6px;
}

.param-row__fields {
  flex: 1;
  display: flex;
  gap: 12px;
}

.param-field {
  flex: 1;
}

/* Standard Equipment Card */
.standard-card {
  margin: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.standard-card__header {
  background: $secondary;
  color: #fff;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
}

.standard-card__body {
  padding: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.form-field {
  flex: 1;
}

.serial-row {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

/* Footer */
.config-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
}

.btn-cancel {
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  color: #555;
  padding: 8px 32px;
}

.btn-save {
  background: $primary !important;
  color: #fff !important;
  border-radius: 10px;
  padding: 8px 32px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .param-row__fields {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>
