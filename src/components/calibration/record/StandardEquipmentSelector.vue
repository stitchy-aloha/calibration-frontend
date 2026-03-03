<template>
  <q-card flat bordered class="q-mb-md overflow-hidden">
    <!-- Full-width secondary color title bar at top of card -->
    <div class="selector-header">เครื่องมือมาตรฐาน</div>

    <div class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <div v-for="equip in store.standardEquipments" :key="equip.id" class="col-12 col-md-6">
          <!-- Dropdown ABOVE the inner card, aligned right -->
          <div class="row justify-end q-mb-sm">
            <q-select
              v-model="equip.name"
              :options="['ProSim4', 'SPOT Light', 'Other']"
              outlined
              dense
              bg-color="white"
              style="min-width: 150px"
            />
          </div>

          <!-- Info card -->
          <q-card flat bordered class="bg-white equip-card">
            <q-card-section class="q-pa-md">
              <!-- Icon + type name centered -->
              <div class="column items-center q-mb-md">
                <q-icon name="app:med" size="42px" color="secondary" class="q-mb-xs" />
                <div class="text-weight-bold text-subtitle1">{{ equip.type }}</div>
              </div>

              <!-- Info rows -->
              <div class="info-grid">
                <span class="label-text">รุ่น</span>
                <span class="value-text">{{ equip.name }}</span>

                <span class="label-text">บริษัท</span>
                <span class="value-text">{{ equip.company }}</span>

                <span class="label-text">หมายเลขประจำเครื่อง</span>
                <span class="value-text">{{ equip.serialNumber }}</span>

                <span class="label-text">หน่วยวัด</span>
                <span class="value-text">{{ equip.unit }}</span>

                <span class="label-text">วันที่สอบเทียบ</span>
                <span class="value-text">{{ equip.lastCalibrationDate }}</span>

                <span class="label-text">หมายเลขใบรับรอง</span>
                <span class="value-text">{{ equip.certificateNumber }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useCalibrationRecordStore } from 'stores/calibrationRecord';

const store = useCalibrationRecordStore();
</script>

<style scoped lang="scss">
.selector-header {
  background-color: $secondary;
  color: white;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
}

.equip-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 16px;
}

.label-text {
  color: #666;
  font-weight: 500;
  font-size: 13px;
}

.value-text {
  text-align: right;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 13px;
}
</style>
