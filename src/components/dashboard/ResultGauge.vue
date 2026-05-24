<template>
  <q-card class="shadow-1 result-gauge-card full-height flex flex-center">
    <div class="column flex-center">
      <div style="position: relative; width: 120px; height: 120px">
        <svg viewBox="0 0 36 36" class="circular-chart green">
          <path
            class="circle-bg"
            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            stroke-dasharray="92, 100"
            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="absolute-center text-center">
          <div class="text-h5 text-weight-bold text-grey-9">92%</div>
        </div>
      </div>

      <div class="text-center q-mt-md">
        <div class="text-subtitle2 text-weight-bold">ผลการทดสอบ</div>
        <div class="row items-center justify-center q-mt-xs">
          <div class="row items-center q-mr-md">
            <span class="dot bg-green q-mr-xs"></span>
            <span class="text-caption">ผ่าน (Pass)</span>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style scoped>
.result-gauge-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  min-height: 200px;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

.circular-chart.green .circle {
  stroke: #22c55e;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}
</style>
