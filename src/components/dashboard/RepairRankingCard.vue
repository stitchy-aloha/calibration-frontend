<template>
  <q-card flat bordered class="q-mb-md brand-card">
    <q-card-section>
      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          unelevated
          color="primary"
          icon="file_download"
          class="download-btn shadow-1"
          padding="xs sm"
        />
        <q-select
          :model-value="selectedMonth"
          @update:model-value="$emit('update:selectedMonth', $event)"
          :options="months"
          outlined
          dense
          bg-color="white"
          class="filter-select"
          style="min-width: 110px"
        />
        <q-select
          :model-value="selectedYear"
          @update:model-value="$emit('update:selectedYear', $event)"
          :options="years"
          outlined
          dense
          bg-color="white"
          class="filter-select"
          style="min-width: 90px"
        />
      </div>

      <div class="text-subtitle2 text-weight-bold q-mb-xs">
        5 อันดับยี่ห้อ/รุ่นเครื่องมือแพทย์ที่ซ่อมบ่อยที่สุด
      </div>
      <div class="text-caption text-weight-bold q-mb-md">
        ({{ selectedMonth }} {{ selectedYear }})
      </div>

      <div class="brands-list">
        <div v-for="(brand, i) in topBrands" :key="i" class="brand-item q-mb-sm">
          <div class="row justify-between text-caption q-mb-xs">
            <span class="text-grey-8">{{ brand.name }}</span>
            <span class="text-grey-6">{{ brand.count }} เคส</span>
          </div>
          <!-- Custom Progress Bar -->
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{
                width: brand.percent + '%',
                background: brand.color || 'var(--q-primary)',
                opacity: brand.opacity || 1,
              }"
            ></div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
export interface BrandData {
  name: string;
  color: string;
  opacity?: number;
  colorCode?: boolean;
  count: number;
  percent: number;
}

defineProps<{
  selectedMonth: string;
  selectedYear: string;
  months: string[];
  years: string[];
  topBrands: BrandData[];
}>();

defineEmits(['update:selectedMonth', 'update:selectedYear']);
</script>

<style scoped lang="scss">
.brand-card {
  border-radius: 12px;
}

.filter-select {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.download-btn {
  border-radius: 8px;
  height: 40px;
}

.progress-track {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
