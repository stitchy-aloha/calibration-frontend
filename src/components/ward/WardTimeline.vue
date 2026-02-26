<template>
  <div class="timeline-container">
    <div class="text-subtitle1 text-weight-medium text-grey-9 q-mb-md">Timeline</div>

    <div class="timeline-list">
      <div v-for="event in store.timelineEvents" :key="event.id" class="timeline-item">
        <!-- Line connecting bubbles -->
        <div class="timeline-line"></div>

        <!-- Bubble -->
        <div class="timeline-bubble bg-secondary text-white shadow-2">
          {{ event.date }}
        </div>

        <!-- Event Card -->
        <div class="timeline-content">
          <div class="content-box">
            <div class="text-weight-medium text-grey-9" style="font-size: 14px">
              {{ event.toolName }}
            </div>
            <div class="text-caption text-grey-6">{{ event.toolCode }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWardsStore } from 'src/stores/wards';

const store = useWardsStore();
</script>

<style scoped lang="scss">
.timeline-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 8px;
  /* Add padding-left to make room for absolute line */
  padding-left: 20px;
}

/* The vertical connecting line for the whole timeline */
.timeline-list::before {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 20px;
  width: 2px;
  background-color: $secondary;
  opacity: 0.6;
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  min-height: 48px;
}

.timeline-bubble {
  position: absolute;
  left: -20px; /* pull back over the line */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  z-index: 2;
  border: 2px solid white;
}

.timeline-content {
  flex: 1;
  margin-left: 32px;
}

.content-box {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 52px;
}
</style>
