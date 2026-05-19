<template>
  <!-- Group item with children (sub-menu) -->
  <template v-if="children && children.length > 0">
    <!-- COMPACT mode: show icon-only item with tooltip, no expansion -->
    <q-item
      v-if="compact"
      clickable
      class="link-item compact-item"
      :class="{ 'link-item--active': isChildActive }"
      :title="title"
    >
      <q-item-section avatar class="icon-section">
        <q-icon :name="icon" size="24px" />
      </q-item-section>
      <!-- Tooltip showing sub-menu items on hover -->
      <q-tooltip anchor="center right" self="center left" :offset="[8, 0]" class="compact-tooltip">
        <div class="tooltip-title">{{ title }}</div>
        <q-separator dark class="q-my-xs" />
        <div
          v-for="child in children"
          :key="child.title"
          class="tooltip-child"
          @click.stop="navigateTo(child.link)"
        >
          <q-icon :name="child.icon" size="16px" class="q-mr-sm" />
          {{ child.title }}
        </div>
      </q-tooltip>
    </q-item>

    <!-- EXPANDED mode: custom expandable item (no q-expansion-item to avoid Quasar internal spacing) -->
    <div v-else class="custom-expansion link-item" :class="{ 'link-item--active': isChildActive && !isOpen }">
      <!-- Header row -->
      <q-item
        clickable
        class="expansion-header-item"
        :class="{ 'link-item--active': isChildActive }"
        @click="isOpen = !isOpen"
      >
        <q-item-section avatar class="icon-section">
          <q-icon :name="icon" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-body2 text-weight-medium">{{ title }}</q-item-label>
          <q-item-label caption class="text-caption text-grey-6">{{ caption }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
            name="expand_more"
            size="18px"
            class="text-grey-5 chevron-icon"
            :class="{ 'chevron-open': isOpen }"
          />
        </q-item-section>
      </q-item>

      <!-- Children (slide transition) -->
      <div class="expansion-children" :class="{ 'expansion-children--open': isOpen }">
        <EssentialLink
          v-for="child in children"
          :key="child.title"
          v-bind="child"
          :compact="false"
          class="child-link-item"
        />
      </div>
    </div>
  </template>

  <!-- Regular internal link -->
  <router-link v-else-if="link && !link.startsWith('http')" :to="link" custom v-slot="{ navigate }">
    <q-item
      clickable
      :title="compact ? title : ''"
      class="link-item"
      :class="{
        'compact-item': compact,
        'expanded-item': !compact,
        'link-item--active': isSelfActive,
      }"
      @click="() => navigate()"
    >
      <q-item-section v-if="icon" avatar class="icon-section">
        <q-icon :name="icon" :size="compact ? '24px' : '22px'" />
      </q-item-section>

      <template v-if="!compact">
        <q-item-section>
          <q-item-label class="text-body2 text-weight-medium">{{ title }}</q-item-label>
          <q-item-label caption class="text-caption text-grey-6">{{ caption }}</q-item-label>
        </q-item-section>
      </template>

      <q-tooltip v-if="compact" anchor="center right" self="center left" :offset="[8, 0]">
        {{ title }}
      </q-tooltip>
    </q-item>
  </router-link>

  <!-- External link fallback -->
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
      <q-icon :name="icon" :size="compact ? '24px' : '22px'" />
    </q-item-section>

    <template v-if="!compact">
      <q-item-section>
        <q-item-label class="text-body2 text-weight-medium">{{ title }}</q-item-label>
        <q-item-label caption class="text-caption text-grey-6">{{ caption }}</q-item-label>
      </q-item-section>
      <q-item-section side v-if="link && link.startsWith('http')">
        <q-icon name="open_in_new" size="16px" class="text-grey-5" />
      </q-item-section>
    </template>

    <q-tooltip v-if="compact" anchor="center right" self="center left" :offset="[8, 0]">
      {{ title }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  compact?: boolean;
  children?: EssentialLinkProps[];
}

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '',
  icon: '',
  compact: false,
});

const route = useRoute();
const router = useRouter();

// Expansion open state — default open if a child route is active
const isOpen = ref(false);

const navigateTo = (link?: string) => {
  if (!link) return;
  if (link.startsWith('http')) {
    window.open(link, '_blank');
  } else {
    const parts = link.split('?');
    const path = parts[0] ?? link;
    const rawQuery = parts[1];
    void router.push({
      path,
      ...(rawQuery ? { query: Object.fromEntries(new URLSearchParams(rawQuery)) as LocationQueryRaw } : {}),
    });
  }
};

const isSelfActive = computed(() => {
  if (!props.link || props.children?.length) return false;
  const path = props.link.split('?')[0];
  const query = props.link.includes('?') ? props.link.split('?')[1] : '';
  let isMatch = route.path === path;
  if (isMatch && query) {
    const searchParams = new URLSearchParams(query);
    for (const [key, value] of searchParams.entries()) {
      if (route.query[key] !== value) {
        isMatch = false;
        break;
      }
    }
  }
  return isMatch;
});

const isChildActive = computed(() => {
  if (!props.children) return false;
  return props.children.some((child) => {
    if (!child.link) return false;
    const path = child.link.split('?')[0];
    const query = child.link.includes('?') ? child.link.split('?')[1] : '';
    let isMatch = route.path === path;
    if (isMatch && query) {
      const searchParams = new URLSearchParams(query);
      for (const [key, value] of searchParams.entries()) {
        if (route.query[key] !== value) {
          isMatch = false;
          break;
        }
      }
    }
    return isMatch;
  });
});

// Sync open state when child route becomes active (e.g. direct URL navigation)
watch(isChildActive, (active) => { if (active) isOpen.value = true; }, { immediate: true });
</script>

<style scoped lang="scss">
/* ── Base item ── */
.link-item {
  border-radius: 10px;
  margin: 1px 6px;
  margin-bottom: 8px;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

/* Custom expansion wrapper — no extra margin, controls own spacing */
.custom-expansion {
  margin: 1px 6px;
  margin-bottom: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: transparent;
  padding: 0;
}

.expansion-header-item {
  border-radius: 10px;
  min-height: 48px;
  padding: 4px 8px;
  margin: 0;

  &:hover {
    background-color: rgba($secondary, 0.1);
  }

  &.link-item--active {
    background-color: rgba($secondary, 0.15) !important;

    :deep(.q-icon),
    :deep(.q-item__label) {
      color: $secondary !important;
    }

    :deep(.q-item__label--caption) {
      color: rgba($secondary, 0.7) !important;
    }
  }
}

.chevron-icon {
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

/* Children slide container */
.expansion-children {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.expansion-children--open {
  max-height: 300px; /* large enough for any sub-menu */
}

.link-item:hover {
  background-color: rgba($secondary, 0.1);
}

/* ── Active state ── */
.link-item--active {
  background-color: rgba($secondary, 0.15) !important;

  :deep(.q-icon),
  :deep(.q-item__label) {
    color: $secondary !important;
  }

  :deep(.q-item__label--caption) {
    color: rgba($secondary, 0.7) !important;
  }
}

.link-item--active:hover {
  background-color: rgba($secondary, 0.2) !important;
}

/* ── Icon section ── */
.icon-section {
  min-width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ── Compact (collapsed) mode ── */
.compact-item.link-item {
  height: 44px;
  margin: 2px 4px;
  padding: 0;
  justify-content: center;

  :deep(.q-item__section--avatar) {
    min-width: unset;
    padding: 0;
    justify-content: center;
  }
}

.compact-item.link-item--active {
  background-color: $secondary !important;

  :deep(.q-icon) {
    color: #fff !important;
  }
}

.compact-item.link-item--active:hover {
  background-color: $secondary !important;
  filter: brightness(1.06);
}

/* ── Expanded mode ── */
.expanded-item {
  padding: 4px 8px;
  min-height: 44px;
}

/* ── Expansion item ── */
.link-expansion-item {
  margin: 1px 6px;
  border-radius: 10px;
  overflow: hidden;

  // Remove Quasar's default bottom separator/padding
  :deep(.q-expansion-item__container) {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }

  :deep(.expansion-header) {
    padding: 4px 8px;
    min-height: 44px;
    border-radius: 10px;
  }

  :deep(.q-expansion-item__content) {
    padding: 0;
  }

  // Remove any separator that Quasar renders
  :deep(.q-separator) {
    display: none;
  }
}

/* ── Child items ── */
.child-link-item {
  margin-left: 20px !important;
  margin-right: 0 !important;
  margin-top: 1px;
  margin-bottom: 2px !important;

  :deep(.q-item__section--avatar) {
    min-width: 36px;
  }

  :deep(.q-icon) {
    font-size: 20px !important;
  }
}

/* ── Compact tooltip (sub-menu popup) ── */
.compact-tooltip {
  background: rgba(30, 41, 59, 0.96);
  border-radius: 10px;
  padding: 8px 12px;
  min-width: 160px;

  .tooltip-title {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }

  .tooltip-child {
    display: flex;
    align-items: center;
    padding: 6px 4px;
    border-radius: 6px;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.1s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
}
</style>
