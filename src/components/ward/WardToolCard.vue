<template>
  <q-card class="tool-card shadow-1" flat bordered>
    <q-card-section class="q-pa-md">
      <div class="row justify-between items-start">
        <div class="text-subtitle1 text-grey-9">{{ tool.name }}</div>
        <div class="text-subtitle2" :class="tool.isDanger ? 'text-red' : 'text-primary'">
          {{ tool.statusLabel }}
        </div>
      </div>

      <div class="row justify-between items-end q-mt-sm">
        <div class="text-caption text-grey-6">{{ tool.id }}</div>
        <div class="text-caption text-grey-6">
          ครบกำหนด : <span class="text-grey-8">{{ tool.dueDate }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { WardTool } from 'src/stores/wards';

defineProps<{
  tool: WardTool;
}>();
</script>

<style scoped lang="scss">
.tool-card {
  border-radius: 8px;
  border-color: #e0e0e0;
  background: white;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: $secondary;
  }
}
</style>
