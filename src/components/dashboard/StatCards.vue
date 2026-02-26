<template>
  <!-- Total Devices -->
  <div class="col-12 col-md-4">
    <q-card flat bordered class="stat-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-sm">
          จำนวนเครื่องมือแพทย์ทั้งหมด<br />ที่ใช้งานอยู่
        </div>
        <div class="text-h3 text-weight-bold text-right q-mt-sm">{{ totalDevices }}</div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Readiness -->
  <div class="col-12 col-md-4">
    <q-card flat bordered class="stat-card">
      <q-card-section>
        <div class="row justify-between items-start q-mb-sm">
          <div class="text-subtitle1 text-weight-bold">ความพร้อมใช้งาน</div>
          <div class="text-h3 text-weight-bold">{{ readinessPercent }} %</div>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-6">
            <q-chip
              color="green-1"
              text-color="green-8"
              class="text-weight-medium full-width justify-center"
              size="13px"
              icon="circle"
              style="font-size: 11px"
            >
              พร้อมใช้งาน {{ readyCount }} เครื่อง
            </q-chip>
          </div>
          <div class="col-6">
            <q-chip
              color="red-1"
              text-color="red-8"
              class="text-weight-medium full-width justify-center"
              size="13px"
              icon="circle"
              style="font-size: 11px"
            >
              กำลังซ่อม {{ repairingCount }} เครื่อง
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Pending Repairs -->
  <div class="col-12 col-md-4">
    <q-card flat bordered class="stat-card">
      <q-card-section>
        <div class="row justify-between items-start q-mb-sm">
          <div class="text-subtitle1 text-weight-bold">งานซ่อมรอดำเนินการ</div>
          <div class="text-h3 text-weight-bold">{{ pendingRepairs }}</div>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-4">
            <div class="repair-status-box bg-red-2 text-red-9">
              <div class="text-weight-bold">วิกฤต</div>
              <div>{{ criticalRepairs }} เครื่อง</div>
            </div>
          </div>
          <div class="col-4">
            <div class="repair-status-box bg-warning text-orange-9">
              <div class="text-weight-bold">สูง</div>
              <div>{{ highRepairs }} เครื่อง</div>
            </div>
          </div>
          <div class="col-4">
            <div class="repair-status-box bg-blue-2 text-blue-9">
              <div class="text-weight-bold">ปกติ</div>
              <div>{{ normalRepairs }} เครื่อง</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalDevices: number;
  readinessPercent: number;
  readyCount: number;
  repairingCount: number;
  pendingRepairs: number;
  criticalRepairs: number;
  highRepairs: number;
  normalRepairs: number;
}>();
</script>

<style scoped lang="scss">
.stat-card {
  border-radius: 12px;
  height: 100%;
}

.repair-status-box {
  padding: 12px 8px;
  text-align: center;
  border-radius: 8px;
  div:first-child {
    font-size: 13px;
    margin-bottom: 4px;
  }
  div:last-child {
    font-size: 12px;
  }
}
</style>
