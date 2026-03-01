<template>
  <div class="cal-card">
    <!-- Card Header -->
    <div class="cal-card__header">
      <div class="cal-card__header-left">
        <div class="cal-card__device-name">{{ record.deviceName }}</div>
        <div class="cal-card__device-code text-grey-6">{{ record.deviceCode }}</div>
      </div>
      <div class="cal-card__location-badge">{{ record.location }}</div>
    </div>

    <!-- Card Body -->
    <div class="cal-card__body">
      <div class="cal-card__row">
        <span class="cal-card__label">ประเภท:</span>
        <span class="cal-card__value">{{ record.type }}</span>
      </div>
      <div class="cal-card__row">
        <span class="cal-card__label">ครบกำหนด:</span>
        <span class="cal-card__value">{{ record.dueDate }}</span>
      </div>
      <div class="cal-card__row">
        <span class="cal-card__label">ผู้รับผิดชอบ:</span>
        <span class="cal-card__value">{{ record.responsible }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <q-btn
      unelevated
      :class="['cal-card__btn', isOwner ? 'cal-card__btn--active' : 'cal-card__btn--disabled']"
      :disable="!isOwner"
      label="เริ่มการสอบเทียบ"
      @click="goToInspection"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { CalibrationRecord } from 'src/stores/calibration';

const props = defineProps<{ record: CalibrationRecord; isOwner: boolean }>();
const router = useRouter();

function goToInspection() {
  void router.push('/calibration/inspection/' + props.record.id);
}
</script>

<style scoped lang="scss">
.cal-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  /* Header */
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__device-name {
    font-weight: 700;
    font-size: 15px;
    color: #1a1a2e;
  }

  &__device-code {
    font-size: 12px;
    margin-top: 2px;
  }

  &__location-badge {
    font-size: 13px;
    font-weight: 600;
    color: #555;
    padding: 2px 8px;
    background: #f4f4f8;
    border-radius: 8px;
    white-space: nowrap;
  }

  /* Body rows */
  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    color: #444;
  }

  &__label {
    color: #888;
    min-width: 96px;
  }

  &__value {
    font-weight: 500;
    text-align: right;
  }

  /* Button */
  &__btn {
    border-radius: 999px;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 0;
    letter-spacing: 0.2px;
  }

  &__btn--active {
    background: $secondary !important;
    color: #fff !important;

    &:hover {
      opacity: 0.88;
    }
  }

  &__btn--disabled {
    background: #d9d9d9 !important;
    color: #888 !important;
    cursor: not-allowed;
  }
}
</style>
