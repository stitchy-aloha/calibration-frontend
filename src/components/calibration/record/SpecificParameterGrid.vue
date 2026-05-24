<template>
  <div class="row q-col-gutter-md q-mb-lg">
    <div v-for="(param, index) in localParameters" :key="index" class="col-12 col-sm-6 col-md-3">
      <q-card flat bordered class="param-box">
        <div class="q-pa-sm">
          <div class="text-caption text-grey-7 q-mb-xs">{{ param.name }}</div>
          <q-input
            v-model="param.value"
            dense
            outlined
            bg-color="white"
            :suffix="param.unit || ''"
            @update:model-value="updateStore"
          />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useCalibrationRecordStore, type SpecificParameter } from 'src/stores/calibrationRecord';

const props = defineProps<{
  requiredParams: { name: string; unit?: string }[];
}>();

const store = useCalibrationRecordStore();
const localParameters = ref<SpecificParameter[]>([]);

const initParameters = () => {
  // Map required params to store data or defaults
  localParameters.value = props.requiredParams.map((req) => {
    const existing = store.specificParameters.find((p) => p.name === req.name);
    return {
      name: req.name,
      value: existing?.value || '',
      unit: req.unit || existing?.unit || '',
    };
  });
};

onMounted(() => {
  initParameters();
});

// Watch for store changes (e.g., when fetching new record)
watch(
  () => store.specificParameters,
  () => {
    initParameters();
  },
  { deep: true },
);

const updateStore = () => {
  // Sync local changes back to store
  store.specificParameters = [...localParameters.value];
};
</script>

<style scoped lang="scss">
.param-box {
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  &:hover {
    border-color: $primary;
    background-color: #fff;
  }
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}
</style>
