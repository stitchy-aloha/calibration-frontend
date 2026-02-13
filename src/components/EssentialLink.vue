<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="link"
    :title="compact ? title : ''"
    class="link-item"
    :class="{ 'compact-item': compact, 'expanded-item': !compact }"
  >
    <q-item-section v-if="icon" avatar class="icon-section">
      <q-icon :name="icon" size="28px" />
    </q-item-section>

    <template v-if="!compact">
      <q-item-section>
        <q-item-label class="text-body2 text-weight-medium">
          {{ title }}
        </q-item-label>
        <q-item-label caption class="text-caption text-grey-6">
          {{ caption }}
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="link && link.startsWith('http')">
        <q-icon name="open_in_new" size="16px" class="text-grey-5" />
      </q-item-section>
    </template>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  compact?: boolean;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  compact: false,
});
</script>

<style scoped>
.link-item {
  border-radius: 999px;
  margin: 4px 4px;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.link-item:hover {
  background-color: rgba(25, 118, 210, 0.08);
  transform: translateX(1px);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.12);
}

.icon-section {
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.compact-item {
  justify-content: center;
}

.compact-item.link-item {
  width: 40px;
  height: 40px;
  margin: 4px 0 4px 8px;
  justify-content: center;
}

.expanded-item {
  padding: 6px 10px 6px 10px;
}
</style>
