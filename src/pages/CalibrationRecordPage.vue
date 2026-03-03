<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header Page Title -->
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold text-black">บันทึกการสอบเทียบเครื่องมือ</div>
    </div>

    <!-- Main Container Card -->
    <q-card flat bordered class="bg-white overflow-hidden" style="border-radius: 8px">
      <!-- Top Section (Equipment Header + Tabs) -->
      <div
        class="row justify-between items-center q-px-lg q-py-md"
        style="border-bottom: 1px solid #e0e0e0"
      >
        <div class="col-12 col-md-6">
          <div class="text-h6 text-weight-bold">
            {{ store.equipmentDetails.name || 'Patient Monitor' }}
          </div>
          <div class="text-caption text-grey-8 row q-gutter-x-lg q-mt-xs">
            <div>
              <span class="text-grey-6">บริษัท : </span> {{ store.equipmentDetails.company }}
            </div>
            <div><span class="text-grey-6">รุ่น : </span> {{ store.equipmentDetails.model }}</div>
            <div>
              <span class="text-grey-6">หมายเลขเครื่อง : </span>
              {{ store.equipmentDetails.serialNumber }}
            </div>
          </div>
        </div>

        <!-- Custom Styled Tabs -->
        <div class="col-12 col-md-6 row justify-end items-end q-mt-sm q-mt-md-none">
          <q-btn
            unelevated
            :class="
              store.activeTab === 'general'
                ? 'tab-btn tab-btn--active'
                : 'tab-btn tab-btn--inactive'
            "
            label="ข้อมูลทั่วไป"
            @click="store.activeTab = 'general'"
            no-caps
          />
          <q-btn
            unelevated
            :class="
              store.activeTab === 'test_results'
                ? 'tab-btn tab-btn--active'
                : 'tab-btn tab-btn--inactive'
            "
            label="บันทึกผลทดสอบ"
            @click="store.activeTab = 'test_results'"
            no-caps
          />
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content-border">
        <q-tab-panels v-model="store.activeTab" animated class="bg-white" keep-alive>
          <q-tab-panel name="general" class="q-pa-lg">
            <TabGeneralInfo />
          </q-tab-panel>

          <q-tab-panel name="test_results" class="q-pa-lg">
            <TabTestResults />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card>

    <!-- Floating Footer Actions -->
    <div class="row justify-between q-mt-lg q-pb-xl px-md">
      <q-btn
        outline
        color="primary"
        label="ย้อนกลับ"
        class="bg-white"
        style="width: 150px"
        @click="goBack"
      />
      <div class="row q-gutter-x-md">
        <q-btn
          outline
          color="primary"
          label="บันทึกแบบร่าง"
          class="bg-white"
          style="width: 150px"
        />
        <q-btn
          unelevated
          color="primary"
          :label="store.activeTab === 'general' ? 'ถัดไป' : 'บันทึก'"
          style="width: 150px"
          @click="handleNext"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';
import TabGeneralInfo from 'components/calibration/record/TabGeneralInfo.vue';
import TabTestResults from 'components/calibration/record/TabTestResults.vue';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const store = useCalibrationRecordStore();
const $q = useQuasar();

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    void store.fetchCalibrationRecord(id);
  }
});

const goBack = () => {
  router.back();
};

const handleNext = () => {
  if (store.activeTab === 'general') {
    store.activeTab = 'test_results';
  } else {
    // Implement save logic here
    $q.notify({
      type: 'positive',
      message: 'บันทึกผลการสอบเทียบสำเร็จ!',
      position: 'top-right',
    });
    // Route to somewhere else after
    setTimeout(() => {
      void router.push('/dashboard');
    }, 1500);
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
</style>
