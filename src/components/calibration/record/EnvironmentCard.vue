<template>
  <q-card flat bordered class="overflow-hidden q-mb-md">
    <!-- Secondary color title bar -->
    <div class="card-header">ข้อมูลสภาวะแวดล้อม</div>

    <div class="q-pa-md column q-gutter-md">
      <!-- Readonly: card-style display matching the reference image -->
      <template v-if="readonly">
        <!-- Temperature Card -->
        <q-card flat bordered class="env-card">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <q-icon name="thermostat" size="24px" color="blue-5" />
              <span class="status-tag">ปกติ</span>
            </div>
            <div class="env-value">{{ displayTemp ?? '-' }}°C</div>
            <div class="env-label">อุณหภูมิ</div>
          </q-card-section>
        </q-card>

        <!-- Humidity Card -->
        <q-card flat bordered class="env-card">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <q-icon name="water_drop" size="24px" color="blue-5" />
              <span class="status-tag">ปกติ</span>
            </div>
            <div class="env-value">{{ displayHumidity ?? '-' }} %Rh</div>
            <div class="env-label">ความชื้น</div>
          </q-card-section>
        </q-card>
      </template>

      <!-- Editable: original input fields -->
      <template v-else>
        <div>
          <div class="field-label q-mb-xs">อุณหภูมิ <span class="text-negative">*</span></div>
          <q-input
            v-model.number="store.environment.temperature"
            type="number"
            outlined
            bg-color="white"
          >
            <template #append>
              <span class="unit-text">°C</span>
            </template>
          </q-input>
        </div>
        <div>
          <div class="field-label q-mb-xs">ความชื้น <span class="text-negative">*</span></div>
          <q-input
            v-model.number="store.environment.humidity"
            type="number"
            outlined
            bg-color="white"
          >
            <template #append>
              <span class="unit-text">%Rh</span>
            </template>
          </q-input>
        </div>
      </template>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalibrationRecordStore } from 'stores/calibrationRecord';

interface EnvData {
  temperature?: number | undefined;
  humidity?: number | undefined;
}

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    envData?: EnvData;
  }>(),
  { readonly: false },
);

const store = useCalibrationRecordStore();

// Use prop data if provided (Approval mode), otherwise use store (Recording mode)
const displayTemp = computed(() => props.envData?.temperature ?? store.environment.temperature);
const displayHumidity = computed(() => props.envData?.humidity ?? store.environment.humidity);
</script>

<style scoped lang="scss">
.card-header {
  background-color: $secondary;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}

.env-card {
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  background: #fff;
}

.env-value {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 2px;
}

.env-label {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

.status-tag {
  font-size: 13px;
  font-weight: 600;
  color: $primary;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.unit-text {
  font-size: 13px;
  color: #888;
}
</style>
