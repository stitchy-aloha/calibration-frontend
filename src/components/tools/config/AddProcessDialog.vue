<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToolsStore } from 'src/stores/tools';
import type { CalibrationProcess } from 'src/types/tool.types';

const emit = defineEmits(['close', 'select']);
const store = useToolsStore();

const search = ref('');

onMounted(async () => {
  if (store.calibrationProcesses.length === 0) {
    await store.fetchCalibrationProcesses();
  }
});

const filteredProcesses = computed(() => {
  const q = search.value.toLowerCase();
  return store.calibrationProcesses.filter(
    (p) =>
      p.parameter_name.toLowerCase().includes(q) ||
      p.unit.toLowerCase().includes(q) ||
      (p.standardTool?.name || '').toLowerCase().includes(q),
  );
});

function selectProcess(p: CalibrationProcess) {
  emit('select', p);
  emit('close');
}
</script>

<template>
  <q-dialog :model-value="true" @hide="emit('close')">
    <q-card style="width: 500px; max-width: 90vw; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold color-teal">เลือกกระบวนการสอบเทียบ</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="ค้นหาพารามิเตอร์..."
          class="q-mb-md search-input"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary-teal" />
          </template>
        </q-input>

        <q-list bordered separator class="rounded-borders overflow-hidden">
          <q-item
            v-for="p in filteredProcesses"
            :key="p.id"
            clickable
            v-ripple
            @click="selectProcess(p)"
            class="process-item"
          >
            <q-item-section>
              <q-item-label class="text-weight-bold text-primary-teal">{{
                p.parameter_name
              }}</q-item-label>
              <q-item-label caption class="text-grey-7"
                >{{ p.unit }} | {{ p.standardTool?.name || 'No Standard' }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-icon name="add_circle" color="primary-teal" size="sm" />
            </q-item-section>
          </q-item>
          <q-item v-if="filteredProcesses.length === 0">
            <q-item-section class="text-center text-grey-6 q-pa-md"
              >ไม่พบข้อมูลกระบวนการ</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.color-teal {
  color: #006080;
}
.text-primary-teal {
  color: #006080;
}
.search-input :deep(.q-field__control) {
  border-radius: 8px;
}
.process-item:hover {
  background: #f0f7f7;
}
</style>
