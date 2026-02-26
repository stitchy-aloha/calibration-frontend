<template>
  <q-card flat bordered class="ratio-card">
    <q-card-section>
      <div class="text-subtitle2 text-weight-bold q-mb-md">สัดส่วนสถานะการสอบเทียบ</div>
      <div class="row items-center justify-center">
        <div class="col-auto">
          <q-circular-progress
            show-value
            class="text-black q-ma-sm transition-all"
            :value="ratioDone"
            size="150px"
            :thickness="0.22"
            color="teal-13"
            track-color="grey-3"
          >
            <div class="column items-center transition-all">
              <span class="text-h4 text-weight-bold">{{ ratioDone }}%</span>
              <span class="text-caption text-grey-7">เสร็จสิ้น</span>
            </div>
          </q-circular-progress>
        </div>
        <div class="col q-pl-sm">
          <div class="ratio-legend q-mb-sm">
            <div class="legend-box bg-grey-3">
              <span class="text-weight-bold">ทั้งหมด</span>
              <span>100 %</span>
            </div>
          </div>
          <div class="ratio-legend q-mb-sm">
            <div class="legend-box bg-green-2 text-green-10">
              <span class="text-weight-bold">สอบเทียบแล้ว</span>
              <span class="transition-all">{{ ratioDone }} %</span>
            </div>
          </div>
          <div class="ratio-legend">
            <div class="legend-box bg-red-2 text-red-10">
              <span class="text-weight-bold">ใกล้ครบกำหนด</span>
              <span class="transition-all">{{ ratioPending }} %</span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  ratioDone: number;
  ratioPending: number;
}>();
</script>

<style scoped lang="scss">
.ratio-card {
  border-radius: 12px;
}

.legend-box {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  background: #f0f0f0;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
