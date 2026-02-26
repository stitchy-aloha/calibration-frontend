<template>
  <router-link
    v-if="link && !link.startsWith('http')"
    :to="link"
    custom
    v-slot="{ isActive, navigate }"
  >
    <q-item
      clickable
      :title="compact ? title : ''"
      class="link-item"
      :class="{
        'compact-item': compact,
        'expanded-item': !compact,
        'link-item--active': isActive,
      }"
      @click="() => navigate()"
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
      </template>
    </q-item>
  </router-link>

  <!-- Fallback for external links or no link -->
  <q-item
    v-else
    clickable
    tag="a"
    :href="link"
    target="_blank"
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

<style scoped lang="scss">
.link-item {
  border-radius: 12px;
  margin: 2px 8px;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.link-item:hover {
  background-color: rgba($secondary, 0.12);
  transform: translateX(1px);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.1);
}

/* Active state - expanded */
.link-item--active {
  background-color: $secondary !important;
  box-shadow: 0 2px 8px rgba($secondary, 0.2);

  :deep(.q-icon),
  :deep(.q-item__label) {
    color: #fff !important;
  }

  :deep(.q-item__label--caption) {
    color: #fff !important;
  }
}

.link-item--active:hover {
  background-color: rgba($secondary, 0.24) !important;
}

.icon-section {
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ── Compact (collapsed) mode ── */
.compact-item.link-item {
  width: 100%;
  height: 44px;
  margin: 2px 0;
  border-radius: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.q-item__section--avatar) {
    min-width: unset;
    padding: 0;
  }
}

/* Active compact: solid secondary fill */
.compact-item.link-item--active {
  background-color: $secondary !important;
  box-shadow: none;

  :deep(.q-icon) {
    color: #fff !important;
  }
}

.compact-item.link-item--active:hover {
  background-color: $secondary !important;
  filter: brightness(1.08);
}

.compact-item.link-item:hover:not(.link-item--active) {
  background-color: rgba($secondary, 0.12);
  transform: none;
}

.expanded-item {
  padding: 6px 10px;
}
</style>
