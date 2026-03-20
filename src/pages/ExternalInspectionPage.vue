<template>
  <q-page padding>
    <!-- Loading overlay -->
    <q-inner-loading :showing="store.isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <!-- Page Header -->
    <div class="text-h6 q-mb-xs text-weight-bold">การตรวจสอบสภาพภายนอก</div>
    <div class="text-caption text-grey-6 q-mb-sm">การตรวจสอบเครื่องมือแพทย์</div>

    <!-- PM No -->
    <div class="pm-no-row q-mb-md">
      <span class="pm-no-label">PM No :</span>
      <q-input v-model="store.pmNo" outlined dense class="pm-no-input" bg-color="white" readonly />
    </div>

    <!-- Error banner -->
    <q-banner v-if="store.error" class="bg-red-1 text-red q-mb-md" rounded>
      {{ store.error }}
    </q-banner>

    <!-- Device Info -->
    <EquipmentDetailsCard :details="store.deviceInfo" class="q-mb-md" />

    <!-- Inspection Sections (2-column layout) -->
    <div class="inspection-grid">
      <!-- Left Column: ตรวจสภาพทั่วไป -->
      <div class="inspection-col-left">
        <InspectionSection
          title="ตรวจสภาพทั่วไป"
          :items="store.generalItems"
          :remarks="store.generalRemarks"
          @update="(idx: number, val: InspectionValue) => store.setItemValue(0, idx, val)"
          @update:remarks="store.generalRemarks = $event"
        />
      </div>

      <!-- Right Column: ความปลอดภัย + การบำรุงรักษา + PM Result -->
      <div class="inspection-col-right">
        <InspectionSection
          title="ความปลอดภัย"
          :items="store.safetyItems"
          :remarks="store.safetyRemarks"
          @update="(idx: number, val: InspectionValue) => store.setItemValue(1, idx, val)"
          @update:remarks="store.safetyRemarks = $event"
        />

        <InspectionSection
          title="การบำรุงรักษา"
          :items="store.maintenanceItems"
          :remarks="store.maintenanceRemarks"
          @update="(idx: number, val: InspectionValue) => store.setItemValue(2, idx, val)"
          @update:remarks="store.maintenanceRemarks = $event"
          class="q-mt-md"
        />

        <PmResultCard
          :result="store.pmResult"
          :pm-by="store.pmBy"
          :position="store.pmPosition"
          class="q-mt-md"
        />

        <!-- Submit Button -->
        <q-btn
          unelevated
          no-caps
          class="submit-btn q-mt-md"
          label="ส่งสอบเทียบ/ส่งซ่อม"
          :loading="isSubmitting"
          @click="onSubmit"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import EquipmentDetailsCard from 'src/components/calibration/record/EquipmentDetailsCard.vue';
import InspectionSection from 'src/components/inspection/InspectionSection.vue';
import PmResultCard from 'src/components/inspection/PmResultCard.vue';
import { useInspectionStore, type InspectionValue } from 'src/stores/inspection';

const store = useInspectionStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const isSubmitting = ref(false);

onMounted(async () => {
  const taskId = Number(route.params.id);
  if (taskId) {
    await store.loadFromTask(taskId);
  }
});

async function onSubmit() {
  isSubmitting.value = true;
  const res = await store.submitPmForm();
  isSubmitting.value = false;

  if (res.success) {
    $q.notify({
      type: store.pmResult === 'ไม่ผ่าน' ? 'warning' : 'positive',
      message: `บันทึกผล PM สำเร็จ — ผลลัพธ์: ${store.pmResult}`,
      position: 'bottom',
      timeout: 3000,
    });
    void router.push(`/calibration/record/${route.params.id as string}`);
  } else {
    $q.notify({
      type: 'negative',
      message: res.error ?? 'บันทึกไม่สำเร็จ กรุณาลองใหม่',
      position: 'top',
      timeout: 4000,
    });
  }
}
</script>

<style scoped lang="scss">
.pm-no-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pm-no-label {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
}

.pm-no-input {
  max-width: 200px;
}

.inspection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.inspection-col-left,
.inspection-col-right {
  display: flex;
  flex-direction: column;
}

.submit-btn {
  width: 100%;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  background: $primary !important;
  color: #fff !important;
  letter-spacing: 0.3px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.88;
  }
}
</style>
