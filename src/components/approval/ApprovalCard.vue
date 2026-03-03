<template>
  <div class="cal-card">
    <!-- Card Header -->
    <div class="cal-card__header">
      <div class="cal-card__header-left">
        <div class="cal-card__device-name">{{ item.toolName }}</div>
        <div class="cal-card__device-code text-grey-6">{{ item.toolCode }}</div>
      </div>
      <div class="cal-card__location-badge">{{ item.location }}</div>
    </div>

    <!-- Card Body -->
    <div class="cal-card__body">
      <div class="cal-card__row">
        <span class="cal-card__label">รหัสการสอบเทียบ:</span>
        <span class="cal-card__value">{{ item.id }}</span>
      </div>
      <div class="cal-card__row">
        <span class="cal-card__label">วันที่สอบเทียบ:</span>
        <span class="cal-card__value">{{ item.calDate }}</span>
      </div>
      <div class="cal-card__row flex justify-between items-center q-mt-xs">
        <span class="cal-card__label">ผลการสอบเทียบ:</span>
        <div class="text-positive text-weight-medium flex flex-center gap-xs">
          <q-icon name="check_circle_outline" size="18px" />
          {{ item.result }}
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <q-btn
      unelevated
      class="cal-card__btn cal-card__btn--active q-mt-md"
      label="รับรองการสอบเทียบ"
      @click="emit('approve', item.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApprovalEvent } from 'src/types';

defineProps<{ item: ApprovalEvent }>();
const emit = defineEmits<{ (e: 'approve', id: string): void }>();
</script>

<style scoped lang="scss">
.cal-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
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
    flex: 1;
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
}

.gap-xs {
  gap: 4px;
}
</style>
