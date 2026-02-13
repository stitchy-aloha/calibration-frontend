<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="text-white text-h6 header-title-hover">
          <div class="text-weight-bold text-subtitle2">ระบบบริหารจัดการสอบเทียบเครื่องมือแพทย์</div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Invisible trigger zone -->
    <div class="drawer-trigger-zone" @mouseenter="leftDrawerOpen = true"></div>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      :width="250"
      bordered
      @mouseleave="leftDrawerOpen = false"
      class="drawer-hover bg-grey-1"
      :style="{ top: '50px', height: 'calc(100vh - 50px)' }"
    >
      <q-list>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { ref } from 'vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);
</script>
<style scoped lang="scss">
.header-title-hover {
  transition: opacity 0.2s ease;
  user-select: none;
}
.drawer-hover {
  transition: width 0.2s;
  z-index: 1000;
}
.drawer-trigger-zone {
  position: fixed;
  left: 0;
  top: 0;
  width: 16px;
  height: 100vh;
  z-index: 999;
}
</style>
