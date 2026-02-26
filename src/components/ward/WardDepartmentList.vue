<template>
  <div class="ward-list-wrapper">
    <div class="search-box q-mb-md">
      <q-input
        outlined
        dense
        v-model="searchQuery"
        placeholder="แผนก"
        bg-color="white"
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="ward-list">
      <q-list class="q-gutter-y-sm">
        <q-item
          v-for="ward in store.wards"
          :key="ward.id"
          clickable
          v-ripple
          class="ward-item"
          :active="store.selectedWardId === ward.id"
          active-class="ward-item--active"
          @click="store.selectWard(ward.id)"
        >
          <q-item-section avatar class="ward-icon">
            <q-icon
              name="location_on"
              size="24px"
              :color="store.selectedWardId === ward.id ? 'white' : 'grey-7'"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label
              class="text-weight-bold"
              :class="store.selectedWardId === ward.id ? 'text-white' : 'text-grey-9'"
            >
              {{ ward.name }}
            </q-item-label>
            <q-item-label
              caption
              :class="store.selectedWardId === ward.id ? 'text-white opacity-80' : 'text-grey-6'"
            >
              {{ ward.description }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label
              class="text-weight-medium"
              :class="store.selectedWardId === ward.id ? 'text-white' : 'text-grey-8'"
            >
              {{ ward.toolCount }} เครื่องมือ
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWardsStore } from 'src/stores/wards';

const store = useWardsStore();
const searchQuery = ref('');
</script>

<style scoped lang="scss">
.ward-list-wrapper {
  display: flex;
  flex-direction: column;
}

.search-input {
  :deep(.q-field__control) {
    border-radius: 8px;
  }
}

.ward-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  padding: 12px 16px;
  transition: all 0.2s ease;
  min-height: 70px;

  &:hover:not(.ward-item--active) {
    border-color: $primary;
    background: #fdfcff;
  }
}

.ward-item--active {
  background: $primary !important;
  border-color: $primary !important;
  box-shadow: 0 4px 12px rgba($primary, 0.3);
}

.ward-icon {
  min-width: unset;
  padding-right: 16px;
}

.opacity-80 {
  opacity: 0.8;
}
</style>
