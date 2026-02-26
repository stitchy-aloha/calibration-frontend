<template>
  <q-page padding class="bg-grey-1">
    <!-- Header -->
    <div class="q-mb-md">
      <div class="text-h6 text-weight-bold">รายงานและสรุปผลการสอบเทียบเครื่องมือแพทย์</div>
      <div class="text-caption text-grey-6">ภาพรวมและติดตามการสอบเทียบเครื่องมือแพทย์</div>
    </div>

    <!-- Top Stats Row -->
    <div class="row q-col-gutter-md q-mb-md">
      <StatCards
        :total-devices="totalDevices"
        :readiness-percent="readinessPercent"
        :ready-count="readyCount"
        :repairing-count="repairingCount"
        :pending-repairs="pendingRepairs"
        :critical-repairs="criticalRepairs"
        :high-repairs="highRepairs"
        :normal-repairs="normalRepairs"
      />
    </div>

    <!-- Main Content Area -->
    <div class="row q-col-gutter-md">
      <!-- Left Column -->
      <div class="col-12 col-md-4">
        <!-- Top 5 Repaired Brands -->
        <RepairRankingCard
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          :months="months"
          :years="years"
          :top-brands="topBrands"
        />

        <!-- Calibration Ratio -->
        <CalibrationRatioCard :ratio-done="ratioDone" :ratio-pending="ratioPending" />
      </div>

      <!-- Right Column -->
      <div class="col-12 col-md-8">
        <ExpenseChartCard
          v-model:compare-mode="compareMode"
          v-model:chart-year1="chartYear1"
          v-model:chart-year2="chartYear2"
          :years="years"
          :expense1="expense1"
          :expense2="expense2"
        />
      </div>
    </div>

    <!-- Bottom Stats Row for Chart -->
    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="footer-stat-card transition-all column">
          <q-card-section class="col column justify-between">
            <div class="text-caption text-weight-bold">
              ค่าใช้จ่ายปี {{ chartYear1 }}<br />(บาท)
            </div>
            <div class="text-h4 text-weight-bold text-right q-mt-sm">{{ expense1 }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="compareMode === 'compare'" class="col-12 col-sm-4">
        <q-card flat bordered class="footer-stat-card transition-all column">
          <q-card-section class="col column justify-between">
            <div class="text-caption text-weight-bold">
              ค่าใช้จ่ายปี {{ chartYear2 }}<br />(บาท)
            </div>
            <div class="text-h4 text-weight-bold text-right q-mt-sm">{{ expense2 }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="compareMode === 'compare'" class="col-12 col-sm-4">
        <q-card flat bordered class="footer-stat-card transition-all column">
          <q-card-section class="col column justify-center">
            <div class="row justify-between items-center">
              <div class="text-caption text-weight-bold">เปลี่ยนแปลง<br />(บาท)</div>
              <div class="text-right">
                <div
                  class="text-h4 text-weight-bold"
                  :class="expenseDiff.startsWith('+') ? 'text-black' : 'text-positive'"
                >
                  {{ expenseDiff }}
                </div>
                <div
                  class="text-caption text-weight-bold"
                  :class="expenseDiff.startsWith('+') ? 'text-black' : 'text-positive'"
                >
                  {{ expenseDiffPercent }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BrandData } from 'src/components/dashboard/RepairRankingCard.vue';
import StatCards from 'src/components/dashboard/StatCards.vue';
import RepairRankingCard from 'src/components/dashboard/RepairRankingCard.vue';
import CalibrationRatioCard from 'src/components/dashboard/CalibrationRatioCard.vue';
import ExpenseChartCard from 'src/components/dashboard/ExpenseChartCard.vue';

const selectedMonth = ref('ธันวาคม');
const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const selectedYear = ref('2026');
const chartYear1 = ref('2026');
const chartYear2 = ref('2025');
const years = ['2026', '2025', '2024', '2023'];

const compareMode = ref('compare');

// Mock Stateful Data
const totalDevices = ref(200);
const readinessPercent = ref(92);
const readyCount = ref(184);
const repairingCount = ref(16);

const pendingRepairs = ref(42);
const criticalRepairs = ref(5);
const highRepairs = ref(12);
const normalRepairs = ref(25);

const ratioDone = ref(75);
const ratioPending = ref(25);

const expense1 = ref('86,000');
const expense2 = ref('79,000');
const expenseDiff = ref('+7,000');
const expenseDiffPercent = ref('(+8.86%)');

const baseBrands = [
  { name: 'Philips', color: '#974ef5', opacity: 1 },
  { name: 'GE Healthcare', color: '#974ef5', opacity: 0.8 },
  { name: 'Siemens', color: '#974ef5', opacity: 0.6 },
  { name: 'Dräger', color: '#974ef5', opacity: 0.4 },
  { name: 'Mindray', color: '#f0f0f0', colorCode: true },
];

const topBrands = ref<BrandData[]>([
  { ...baseBrands[0], count: 45, percent: 85 } as BrandData,
  { ...baseBrands[1], count: 38, percent: 70 } as BrandData,
  { ...baseBrands[2], count: 24, percent: 50 } as BrandData,
  { ...baseBrands[3], count: 18, percent: 35 } as BrandData,
  { ...baseBrands[4], count: 12, percent: 25 } as BrandData,
]);

const randomizeData = () => {
  // some random variations
  totalDevices.value = 180 + Math.floor(Math.random() * 40);
  readinessPercent.value = 85 + Math.floor(Math.random() * 13);
  readyCount.value = Math.floor((totalDevices.value * readinessPercent.value) / 100);
  repairingCount.value = totalDevices.value - readyCount.value;

  pendingRepairs.value = 30 + Math.floor(Math.random() * 20);
  criticalRepairs.value = Math.floor(pendingRepairs.value * 0.15);
  highRepairs.value = Math.floor(pendingRepairs.value * 0.35);
  normalRepairs.value = pendingRepairs.value - criticalRepairs.value - highRepairs.value;

  ratioDone.value = 60 + Math.floor(Math.random() * 30);
  ratioPending.value = 100 - ratioDone.value;

  // Randomize Brands
  let previousCount = 50 + Math.floor(Math.random() * 15);
  topBrands.value = baseBrands.map((brand, idx) => {
    const count = previousCount - Math.floor(Math.random() * (7 - idx));
    previousCount = count;
    return {
      ...brand,
      count,
      percent: Math.max(10, Math.floor((count / 65) * 100)),
    };
  });

  const exp1 = 60000 + Math.floor(Math.random() * 40000);
  const exp2 = 50000 + Math.floor(Math.random() * 40000);

  expense1.value = exp1.toLocaleString();
  expense2.value = exp2.toLocaleString();

  const diff = exp1 - exp2;
  const diffPercent = ((diff / exp2) * 100).toFixed(2);

  expenseDiff.value = (diff > 0 ? '+' : '') + diff.toLocaleString();
  expenseDiffPercent.value = `(${diff > 0 ? '+' : ''}${diffPercent}%)`;
};

watch([selectedMonth, selectedYear, chartYear1, chartYear2, compareMode], () => {
  randomizeData();
});
</script>

<style scoped lang="scss">
.footer-stat-card {
  border-radius: 12px;
  height: 100%;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
