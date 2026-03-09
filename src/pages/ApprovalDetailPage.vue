<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header Page Title -->
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold text-black">รับรองการสอบเทียบเครื่องมือ</div>
    </div>

    <!-- Main Container Card -->
    <q-card flat bordered class="bg-white overflow-hidden" style="border-radius: 8px">
      <!-- Top Section (Equipment Header + Status + Tabs) -->
      <div
        class="row justify-between items-center q-px-lg q-py-md"
        style="border-bottom: 1px solid #e0e0e0"
      >
        <div class="col-12 col-md-6">
          <div class="text-h6 text-weight-bold">
            {{ calStore.equipmentDetails.name || 'Patient Monitor' }}
          </div>
          <div class="text-caption text-grey-8 row q-gutter-x-lg q-mt-xs">
            <div>
              <span class="text-grey-6">รหัสการสอบเทียบ : </span>
              <span class="text-weight-bold">{{ approvalId }}</span>
            </div>
            <div class="row items-center q-gutter-x-xs">
              <span class="text-grey-6">สถานะ :</span>
              <span class="text-positive text-weight-bold">ผ่าน</span>
              <q-icon name="check_circle" color="positive" size="16px" />
            </div>
          </div>
        </div>

        <!-- Custom Styled Tabs -->
        <div class="col-12 col-md-6 row justify-end items-end q-mt-sm q-mt-md-none">
          <q-btn
            unelevated
            :class="
              activeTab === 'general' ? 'tab-btn tab-btn--active' : 'tab-btn tab-btn--inactive'
            "
            label="ข้อมูลทั่วไป"
            @click="switchTab('general')"
            no-caps
          />
          <q-btn
            unelevated
            :class="
              activeTab === 'test_results' ? 'tab-btn tab-btn--active' : 'tab-btn tab-btn--inactive'
            "
            label="รับรองผลการสอบเทียบ"
            @click="switchTab('test_results')"
            no-caps
          />
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content-border">
        <q-tab-panels v-model="activeTab" animated class="bg-white" keep-alive>
          <!-- General Info Tab -->
          <q-tab-panel name="general" class="q-pa-lg">
            <ApprovalTabGeneralInfo />
          </q-tab-panel>

          <!-- Test Results Tab (read-only) -->
          <q-tab-panel name="test_results" class="q-pa-lg">
            <ApprovalTabTestResults
              :ekg-items="ekgItems"
              :systolic-data="systolicData"
              :diastolic-data="diastolicData"
              :temp-data="tempData"
              :heart-rate-data="heartRateData"
              :spo2-data="spo2Data"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <!-- Inline remark field — appears when ไม่อนุมัติ is clicked -->
    <transition name="slide-down">
      <q-card
        v-if="showRemarkField"
        flat
        bordered
        class="bg-white q-mt-md"
        style="border-radius: 8px; border-left: 4px solid var(--q-negative)"
      >
        <q-card-section>
          <div class="row items-center q-mb-sm">
            <q-icon name="warning" color="negative" size="20px" class="q-mr-sm" />
            <span class="text-weight-bold text-negative">หมายเหตุและเหตุผลที่ไม่อนุมัติ</span>
            <span class="text-negative q-ml-xs">*</span>
          </div>
          <q-input
            v-model="rejectRemark"
            type="textarea"
            outlined
            autogrow
            :rows="3"
            placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."
            :rules="[(val) => !!val?.trim() || 'กรุณากรอกหมายเหตุ']"
            lazy-rules
            ref="remarkInputRef"
            bg-color="white"
          />
        </q-card-section>
      </q-card>
    </transition>

    <!-- Footer Actions -->
    <div class="row justify-between q-mt-lg q-pb-xl">
      <q-btn
        outline
        color="primary"
        :label="showRemarkField ? 'ยกเลิก' : 'ย้อนกลับ'"
        class="bg-white"
        style="width: 150px"
        @click="showRemarkField ? cancelReject() : goBack()"
      />

      <!-- General tab: ถัดไป -->
      <q-btn
        v-if="activeTab === 'general'"
        unelevated
        color="primary"
        label="ถัดไป"
        style="width: 150px"
        @click="switchTab('test_results')"
      />

      <!-- Test results tab: action buttons -->
      <div v-else class="row q-gutter-x-md">
        <template v-if="!showRemarkField">
          <q-btn
            unelevated
            color="negative"
            label="ไม่อนุมัติ"
            style="width: 150px"
            @click="handleReject"
          />
          <q-btn
            unelevated
            color="positive"
            label="อนุมัติ"
            style="width: 150px"
            @click="handleApprove"
          />
        </template>
        <q-btn
          v-else
          unelevated
          color="negative"
          label="ยืนยันไม่อนุมัติ"
          style="min-width: 180px"
          @click="confirmReject"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QInput } from 'quasar';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';
import { useInspectionStore } from 'stores/inspection';
import ApprovalTabGeneralInfo from 'components/calibration/approval/ApprovalTabGeneralInfo.vue';
import ApprovalTabTestResults from 'components/calibration/approval/ApprovalTabTestResults.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const calStore = useCalibrationRecordStore();
const inspectionStore = useInspectionStore();

type TabKey = 'general' | 'test_results';

const activeTab = ref<TabKey>('general');
const approvalId = route.params.id as string;
const showRemarkField = ref(false);
const rejectRemark = ref('');
const remarkInputRef = ref<InstanceType<typeof QInput> | null>(null);

/** Sync tab state to URL query param */
const switchTab = (tab: TabKey) => {
  activeTab.value = tab;
  void router.replace({ query: { ...route.query, tab } });
};

onMounted(async () => {
  const tabParam = route.query.tab as TabKey | undefined;
  if (tabParam === 'general' || tabParam === 'test_results') {
    activeTab.value = tabParam;
  }

  // Save the identity fields already set by ApprovalsPage before navigating
  const presetName = calStore.equipmentDetails.name;
  const presetCode = calStore.equipmentDetails.code;
  const presetHospital = calStore.locationDetails.hospital;
  const presetDeviceName = inspectionStore.deviceInfo.deviceName;
  const presetAssetCode = inspectionStore.deviceInfo.assetCode;
  const presetLocation = inspectionStore.deviceInfo.location;

  // Fetch mock to backfill supplementary fields (company, model, serialNumber, riskLevel, etc.)
  await calStore.fetchCalibrationRecord(approvalId);

  // Restore identity fields so the real approval row data is shown
  if (presetName) calStore.equipmentDetails.name = presetName;
  if (presetCode) calStore.equipmentDetails.code = presetCode;
  if (presetHospital) calStore.locationDetails.hospital = presetHospital;

  // Sync final state into inspectionStore
  const eq = calStore.equipmentDetails;
  const loc = calStore.locationDetails;
  inspectionStore.deviceInfo = {
    deviceName: presetDeviceName || eq.name,
    company: eq.company,
    manufacturer: eq.company,
    model: eq.model,
    serialNumber: eq.serialNumber,
    assetCode: presetAssetCode || eq.code,
    category: eq.type,
    department: loc.department,
    location: presetLocation || loc.district,
    calibrationInterval: eq.calibrationCycle,
    lastCalibrationDate: eq.lastCalibrationDate,
    dueDate: eq.nextCalibrationDate,
  };
});

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === 'general' || tab === 'test_results') {
      activeTab.value = tab;
    }
  },
);

// --- Mock read-only test data ---
const ekgItems = ref([
  { id: 'i', label: 'I', status: 'pass' as const },
  { id: 'ii', label: 'II', status: 'pass' as const },
  { id: 'iii', label: 'III', status: 'pass' as const },
  { id: 'alarm', label: 'Alarm', status: 'pass' as const },
  { id: 'avr', label: 'aVR', status: 'pass' as const },
  { id: 'avl', label: 'aVL', status: 'pass' as const },
  { id: 'avf', label: 'aVF', status: 'pass' as const },
  { id: '1mv', label: '1mV', status: 'pass' as const },
]);

const systolicData = ref([
  {
    range: 'ต่ำ',
    standard: 80,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: 'สูง',
    standard: 120,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: 'กลาง',
    standard: 160,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
]);

const diastolicData = ref([
  {
    range: 'ต่ำ',
    standard: 50,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: 'สูง',
    standard: 80,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: 'กลาง',
    standard: 100,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
]);

const tempData = ref([
  {
    range: '',
    standard: 35,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: '',
    standard: 40,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
]);

const heartRateData = ref([
  {
    range: '',
    standard: 60,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: '',
    standard: 80,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
]);

const spo2Data = ref([
  {
    range: '',
    standard: 85,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
  {
    range: '',
    standard: 100,
    val1: 141,
    val2: 140,
    val3: 142,
    average: 141,
    error: 1,
    status: 'pass' as const,
  },
]);

const goBack = () => router.back();

const handleApprove = () => {
  $q.notify({ type: 'positive', message: 'อนุมัติการสอบเทียบสำเร็จ!', position: 'top-right' });
  setTimeout(() => void router.push('/approval'), 1000);
};

const handleReject = () => {
  rejectRemark.value = '';
  showRemarkField.value = true;
};

const cancelReject = () => {
  showRemarkField.value = false;
  rejectRemark.value = '';
};

const confirmReject = async () => {
  await remarkInputRef.value?.validate();
  if (!rejectRemark.value?.trim()) return;

  $q.notify({ type: 'negative', message: 'ไม่อนุมัติการสอบเทียบ', position: 'top-right' });
  setTimeout(() => void router.push('/approval'), 1000);
};
</script>

<style scoped lang="scss">
.tab-btn {
  min-width: 150px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 12px 12px 0 0 !important;
  letter-spacing: 0.2px;

  &--active {
    background: $primary !important;
    color: #fff !important;
  }

  &--inactive {
    background: #ede7f6 !important;
    color: $primary !important;
  }
}

.tab-content-border {
  border-top: 4px solid $primary;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
