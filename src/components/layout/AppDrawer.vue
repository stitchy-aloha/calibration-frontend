<template>
  <q-drawer
    :model-value="modelValue"
    show-if-above
    elevated
    side="left"
    :width="$q.screen.lt.md || isExpanded ? 240 : 56"
    class="app-drawer"
    :style="!$q.screen.lt.md ? { top: '50px', height: 'calc(100vh - 50px)' } : {}"
    @update:model-value="emit('update:modelValue', $event)"
    @mouseenter="isExpanded = true"
    @mouseleave="isExpanded = false"
  >
    <div class="drawer-inner">
      <q-list class="drawer-list">
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          :compact="!isExpanded && !$q.screen.lt.md"
        />
      </q-list>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { ALL_NAV_LINKS } from 'src/constants/navLinks.constants';

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const auth = useAuthStore();
const $q = useQuasar();

const isExpanded = ref(false);

const linksList = computed<EssentialLinkProps[]>(() => {
  const allowed = auth.permissions?.allowedMenus || [];
  return ALL_NAV_LINKS.map((link) => {
    if (link.children) {
      const filteredChildren = link.children.filter((child) => {
        const basePath = child.link?.split('?')[0];
        return allowed.includes(basePath || '');
      });
      if (filteredChildren.length > 0 || allowed.includes(link.link || '')) {
        return { ...link, children: filteredChildren };
      }
      return null;
    }
    return allowed.includes(link.link || '') ? link : null;
  }).filter(Boolean) as EssentialLinkProps[];
});
</script>

<style scoped lang="scss">
.app-drawer {
  background: linear-gradient(180deg, #f5f7fb 0%, #ffffff 40%, #f5f7fb 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  transition: width 0.28s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
}

.drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px 4px;
}

.drawer-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;

  // Force-remove Quasar's default bottom spacing on expansion items
  :deep(.q-expansion-item) {
    margin-bottom: 0 !important;
  }

  :deep(.q-expansion-item__container) {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }
}

.drawer-list::-webkit-scrollbar {
  width: 6px;
}

.drawer-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}
</style>
