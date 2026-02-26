<template>
  <q-card flat bordered class="chart-card full-height column">
    <q-card-section class="q-pb-none">
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center q-gutter-md">
          <q-radio
            :model-value="compareMode"
            @update:model-value="$emit('update:compareMode', $event)"
            val="single"
            label="ปีเดียว"
            color="primary"
          />
          <q-radio
            :model-value="compareMode"
            @update:model-value="$emit('update:compareMode', $event)"
            val="compare"
            label="เปรียบเทียบระหว่างปี"
            color="primary"
          />
        </div>
        <div class="row items-center q-gutter-sm">
          <q-select
            :model-value="chartYear1"
            @update:model-value="$emit('update:chartYear1', $event)"
            :options="years"
            outlined
            dense
            bg-color="white"
            class="filter-select"
            style="min-width: 90px"
          />
          <q-select
            v-if="compareMode === 'compare'"
            :model-value="chartYear2"
            @update:model-value="$emit('update:chartYear2', $event)"
            :options="years"
            outlined
            dense
            bg-color="white"
            class="filter-select"
            style="min-width: 90px"
          />
          <q-btn
            unelevated
            color="primary"
            icon="file_download"
            label="ส่งออกรายงาน"
            class="shadow-1 q-ml-sm"
          />
        </div>
      </div>
      <div class="text-subtitle2 text-weight-bold q-mb-md">
        ค่าใช้จ่ายจากการสอบเทียบ (ปี {{ chartYear1 }}
        {{ compareMode === 'compare' ? 'และ ' + chartYear2 : '' }})
      </div>

      <!-- Line Chart SVG Approximation -->
      <div class="chart-container q-mt-md relative-position">
        <svg viewBox="0 0 800 350" class="full-width" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line x1="50" y1="20" x2="780" y2="20" stroke="#f0f0f0" stroke-width="1" />
          <line x1="50" y1="80" x2="780" y2="80" stroke="#f0f0f0" stroke-width="1" />
          <line x1="50" y1="140" x2="780" y2="140" stroke="#f0f0f0" stroke-width="1" />
          <line x1="50" y1="200" x2="780" y2="200" stroke="#f0f0f0" stroke-width="1" />
          <line x1="50" y1="260" x2="780" y2="260" stroke="#f0f0f0" stroke-width="1" />
          <line x1="50" y1="320" x2="780" y2="320" stroke="#e0e0e0" stroke-width="1.5" />

          <!-- Vertical Dashed Line for November -->
          <line
            x1="700"
            y1="20"
            x2="700"
            y2="320"
            stroke="#cfcfcf"
            stroke-width="1"
            stroke-dasharray="4,4"
          />

          <!-- Year 2025 (Green Line) -->
          <path
            d="M100,280 L160,250 L220,230 L280,210 L340,195 L400,180 L460,170 L520,160 L580,145 L640,135 L700,120 L760,110"
            fill="none"
            stroke="#4cb69f"
            stroke-width="3"
          />
          <!-- Points for 2025 -->
          <circle cx="100" cy="280" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="160" cy="250" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="220" cy="230" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="280" cy="210" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="340" cy="195" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="400" cy="180" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="460" cy="170" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="520" cy="160" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="580" cy="145" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="640" cy="135" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="700" cy="120" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />
          <circle cx="760" cy="110" r="4" fill="#fff" stroke="#4cb69f" stroke-width="2" />

          <!-- Year 2026 (Purple Line) -->
          <path
            d="M100,240 L160,210 L220,190 L280,170 L340,150 L400,130 L460,115 L520,95 L580,75 L640,60 L700,40 L760,30"
            fill="none"
            stroke="#8f5cc4"
            stroke-width="3"
          />
          <!-- Area Under Purple Line -->
          <path
            d="M100,240 L160,210 L220,190 L280,170 L340,150 L400,130 L460,115 L520,95 L580,75 L640,60 L700,40 L760,30 L760,320 L100,320 Z"
            fill="url(#gradPurple)"
            stroke="none"
          />

          <defs>
            <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(143, 92, 196, 0.15)" />
              <stop offset="100%" stop-color="rgba(143, 92, 196, 0)" />
            </linearGradient>
          </defs>

          <!-- Points for 2026 -->
          <circle cx="100" cy="240" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="160" cy="210" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="220" cy="190" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="280" cy="170" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="340" cy="150" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="400" cy="130" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="460" cy="115" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="520" cy="95" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="580" cy="75" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="640" cy="60" r="4" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="700" cy="40" r="5" fill="#fff" stroke="#8f5cc4" stroke-width="2" />
          <circle cx="760" cy="30" r="5" fill="#fff" stroke="#8f5cc4" stroke-width="2" />

          <!-- Y-Axis Labels SVG Native -->
          <text x="40" y="24" fill="#757575" font-size="12" text-anchor="end">100,000</text>
          <text x="40" y="84" fill="#757575" font-size="12" text-anchor="end">80,000</text>
          <text x="40" y="144" fill="#757575" font-size="12" text-anchor="end">60,000</text>
          <text x="40" y="204" fill="#757575" font-size="12" text-anchor="end">40,000</text>
          <text x="40" y="264" fill="#757575" font-size="12" text-anchor="end">20,000</text>
          <text x="40" y="324" fill="#757575" font-size="12" text-anchor="end">0</text>

          <!-- X-Axis Labels SVG Native -->
          <text x="100" y="340" fill="#757575" font-size="12" text-anchor="middle">ม.ค.</text>
          <text x="160" y="340" fill="#757575" font-size="12" text-anchor="middle">ก.พ.</text>
          <text x="220" y="340" fill="#757575" font-size="12" text-anchor="middle">มี.ค.</text>
          <text x="280" y="340" fill="#757575" font-size="12" text-anchor="middle">เม.ย.</text>
          <text x="340" y="340" fill="#757575" font-size="12" text-anchor="middle">พ.ค.</text>
          <text x="400" y="340" fill="#757575" font-size="12" text-anchor="middle">มิ.ย.</text>
          <text x="460" y="340" fill="#757575" font-size="12" text-anchor="middle">ก.ค.</text>
          <text x="520" y="340" fill="#757575" font-size="12" text-anchor="middle">ส.ค.</text>
          <text x="580" y="340" fill="#757575" font-size="12" text-anchor="middle">ก.ย.</text>
          <text x="640" y="340" fill="#757575" font-size="12" text-anchor="middle">ต.ค.</text>
          <text x="700" y="340" fill="#757575" font-size="12" text-anchor="middle">พ.ย.</text>
          <text x="760" y="340" fill="#757575" font-size="12" text-anchor="middle">ธ.ค.</text>
        </svg>

        <!-- Chart Legends & Details -->
        <div class="chart-badges">
          <div class="row items-center q-gutter-md">
            <span class="row items-center q-gutter-sm text-grey-8">
              <q-icon name="circle" color="primary" size="10px" />
              <span>ปี {{ chartYear1 }}</span>
            </span>
            <span v-if="compareMode === 'compare'" class="row items-center q-gutter-sm text-grey-8">
              <q-icon
                name="circle"
                color="secondary"
                size="10px"
                style="color: #4cb69f !important"
              />
              <span>ปี {{ chartYear2 }}</span>
            </span>
          </div>
        </div>

        <!-- Value Popups (Static for mockup) -->
        <div
          class="chart-popup transition-all bg-primary text-white"
          style="top: 14px; left: 715px"
        >
          {{ expense1 }}
        </div>
        <div
          v-if="compareMode === 'compare'"
          class="chart-popup transition-all bg-teal text-white"
          style="top: 108px; left: 715px; background: #4cb69f !important"
        >
          {{ expense2 }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  compareMode: string;
  chartYear1: string;
  chartYear2: string;
  years: string[];
  expense1: string;
  expense2: string;
}>();

defineEmits(['update:compareMode', 'update:chartYear1', 'update:chartYear2']);
</script>

<style scoped lang="scss">
.chart-card {
  border-radius: 12px;
}

.filter-select {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.chart-badges {
  position: absolute;
  top: 60px;
  right: 20px;
  background: transparent;
}

.chart-popup {
  position: absolute;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transform: translateY(-50%);
  z-index: 10;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
