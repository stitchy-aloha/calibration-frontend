<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header Page Title -->
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold text-black">รับรองการสอบเทียบเครื่องมือ</div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <template v-else>
      <!-- Main Container Card -->
      <q-card flat bordered class="bg-white overflow-hidden" style="border-radius: 8px">
        <!-- Top Section (Equipment Header + Status + Tabs) -->
        <div
          class="row justify-between items-center q-px-lg q-py-md"
          style="border-bottom: 1px solid #e0e0e0"
        >
          <div class="col-12 col-md-6">
            <div class="text-h6 text-weight-bold">
              {{ task?.equipment?.name || 'ไม่ระบุชื่อเครื่อง' }}
            </div>
            <div class="text-caption text-grey-8 row q-gutter-x-lg q-mt-xs">
              <div>
                <span class="text-grey-6">รหัสการสอบเทียบ : </span>
                <span class="text-weight-bold">{{ task?.pm_no || approvalId }}</span>
              </div>
              <div class="row items-center q-gutter-x-xs">
                <span class="text-grey-6">สถานะ :</span>
                <span
                  :class="task?.overall_result === 'Pass' ? 'text-positive' : 'text-negative'"
                  class="text-weight-bold"
                >
                  {{
                    task?.overall_result === 'Pass'
                      ? 'ผ่าน'
                      : task?.overall_result === 'Fail'
                        ? 'ไม่ผ่าน'
                        : '-'
                  }}
                </span>
                <q-icon
                  :name="task?.overall_result === 'Pass' ? 'check_circle' : 'cancel'"
                  :color="task?.overall_result === 'Pass' ? 'positive' : 'negative'"
                  size="16px"
                />
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
                activeTab === 'test_results'
                  ? 'tab-btn tab-btn--active'
                  : 'tab-btn tab-btn--inactive'
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
              <ApprovalTabGeneralInfo :task="task" />
            </q-tab-panel>

            <!-- Test Results Tab (read-only, real data) -->
            <q-tab-panel name="test_results" class="q-pa-lg">
              <ApprovalTabTestResults :task="task" />
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
              color="red"
              label="ไม่อนุมัติ"
              style="width: 150px"
              @click="handleReject"
            />
            <q-btn
              unelevated
              color="green-8"
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
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QInput } from 'quasar';
import { useApprovalsStore } from 'stores/approvals';
import { pmService } from 'src/services/pm.service';
import type { TaskApi } from 'src/services/pm.service';
import ApprovalTabGeneralInfo from 'components/calibration/approval/ApprovalTabGeneralInfo.vue';
import ApprovalTabTestResults from 'components/calibration/approval/ApprovalTabTestResults.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const store = useApprovalsStore();

type TabKey = 'general' | 'test_results';

const activeTab = ref<TabKey>('general');
const approvalId = route.params.id as string;
const showRemarkField = ref(false);
const rejectRemark = ref('');
const remarkInputRef = ref<InstanceType<typeof QInput> | null>(null);
const loading = ref(true);
const task = ref<TaskApi | null>(null);

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

  // Find the task from the approvals store to get the real taskId
  // The route param is the pm_no (e.g. "PM-2024-0001"), not the numeric ID
  await store.fetchApprovals();
  const approval = store.approvals.find((a) => a.id === approvalId);

  if (approval) {
    try {
      const res = await pmService.getTaskById(approval.taskId);
      task.value = res.data;
    } catch (err) {
      console.error('Failed to fetch task detail:', err);
      $q.notify({ type: 'negative', message: 'ไม่สามารถโหลดข้อมูลได้', position: 'top-right' });
    }
  }

  loading.value = false;
});

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === 'general' || tab === 'test_results') {
      activeTab.value = tab;
    }
  },
);

const goBack = () => router.back();

const handleApprove = async () => {
  try {
    const approval = store.approvals.find((a) => a.id === approvalId);
    if (!approval) throw new Error('Task not found');

    await store.approveEvent(approval.taskId);
    $q.notify({ type: 'positive', message: 'อนุมัติการสอบเทียบสำเร็จ!', position: 'top-right' });
    setTimeout(() => void router.push('/history'), 1000);
  } catch (err) {
    console.error('Approve Error:', err);
    $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาดในการอนุมัติ', position: 'top-right' });
  }
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

  try {
    const approval = store.approvals.find((a) => a.id === approvalId);
    if (!approval) throw new Error('Task not found');

    await store.rejectEvent(approval.taskId, rejectRemark.value);
    $q.notify({ type: 'negative', message: 'ไม่อนุมัติการสอบเทียบ', position: 'top-right' });
    setTimeout(() => void router.push('/history'), 1000);
  } catch (err) {
    console.error('Reject Error:', err);
    $q.notify({
      type: 'negative',
      message: 'เกิดข้อผิดพลาดในการไม่อนุมัติ',
      position: 'top-right',
    });
  }
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
