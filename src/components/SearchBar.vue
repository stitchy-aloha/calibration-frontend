<template>
  <q-input
    :model-value="modelValue"
    outlined
    dense
    :placeholder="placeholder"
    bg-color="white"
    class="search-bar"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  >
    <template #prepend>
      <q-icon name="search" color="grey-5" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
  }>(),
  {
    placeholder: 'ค้นหา...',
  },
);

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.search-bar {
  width: 260px;
}
</style>
