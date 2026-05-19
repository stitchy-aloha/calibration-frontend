<template>
  <q-layout view="hHh Lpr lFf">
    <AppHeader @toggle-drawer="leftDrawerOpen = !leftDrawerOpen" />

    <AppDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from 'src/components/layout/AppHeader.vue';
import AppDrawer from 'src/components/layout/AppDrawer.vue';

const leftDrawerOpen = ref(false);
</script>
