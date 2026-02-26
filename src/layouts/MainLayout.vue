<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="header-app-title">
            <q-icon
              name="medical_services"
              size="28px"
              class="q-mr-sm"
              style="margin-right: 25px"
            />
            <div class="column">
              <span class="text-subtitle1 text-weight-bold">
                ระบบบริหารจัดการสอบเทียบเครื่องมือแพทย์
              </span>
              <span class="text-caption text-weight-regular opacity-70">
                Medical Calibration Management System
              </span>
            </div>
          </div>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="notifications" class="q-mr-sm">
          <q-badge floating color="red" rounded />
        </q-btn>

        <div
          class="q-separator-vertical q-my-sm bg-white opacity-20 q-mr-md"
          style="width: 1px"
        ></div>

        <ProfileCard :name="auth.user?.fullName ?? ''" :role="auth.user?.role ?? ''">
          <div class="row items-center">
            <div class="column text-right q-mr-sm">
              <span class="text-weight-bold text-caption">{{ auth.user?.fullName }}</span>
              <span class="text-caption" style="font-size: 10px; opacity: 0.8">{{
                auth.user?.role
              }}</span>
            </div>
            <q-avatar size="36px" class="header-avatar">
              <img src="/image/profile.png" alt="User Avatar" />
            </q-avatar>
          </div>
        </ProfileCard>
      </q-toolbar>
    </q-header>

    <q-drawer
      :model-value="true"
      show-if-above
      elevated
      side="left"
      :width="leftDrawerOpen ? 240 : 60"
      @mouseenter="leftDrawerOpen = true"
      @mouseleave="leftDrawerOpen = false"
      class="app-drawer"
      :style="{ top: '50px', height: 'calc(100vh - 50px)' }"
    >
      <div class="drawer-inner">
        <q-list class="drawer-list">
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
            :compact="!leftDrawerOpen"
          />
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import ProfileCard from 'components/ProfileCard.vue';
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';

const auth = useAuthStore();

const linksList: EssentialLinkProps[] = [
  {
    title: 'หน้าหลัก',
    caption: 'Home Page',
    icon: 'app:home',
    link: '/dashboard',
  },
  {
    title: 'แผนการสอบเทียบ',
    caption: 'Calibration Schedule',
    icon: 'calendar_month',
    link: '/schedule',
  },
  {
    title: 'จัดการวอร์ด',
    caption: 'Ward Management',
    icon: 'location_on',
    link: '/ward',
  },
  {
    title: 'บันทึกการสอบเทียบ',
    caption: 'Calibration Records',
    icon: 'app:note',
    link: '/calibration',
  },
  {
    title: 'รับรองการสอบเทียบ',
    caption: 'Calibration Approval',
    icon: 'app:appr',
    link: '/approval',
  },
  {
    title: 'ข้อมูลเครื่องมือ',
    caption: 'Tool Management',
    icon: 'app:syringe',
    link: '/tools',
  },
  {
    title: 'ซ่อมบำรุง',
    caption: 'Maintenance',
    icon: 'app:repair',
    link: '/maintenance',
  },
  {
    title: 'ประวัติการสอบเทียบ',
    caption: 'Calibration History',
    icon: 'app:save',
    link: '/history',
  },
  {
    title: 'การทำงานในระบบ',
    caption: 'Audit Log',
    icon: 'shield',
    link: '/audit',
  },
];

const leftDrawerOpen = ref(false);
</script>

<style scoped lang="scss">
.header-app-title {
  display: flex;
  align-items: center;
}

.header-app-title .opacity-70 {
  opacity: 0.7;
}

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
  padding: 12px 8px;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 4px;
}

.drawer-header-text {
  display: flex;
  flex-direction: column;
}

.drawer-list {
  flex: 1;
  overflow-y: auto;
}

.drawer-list::-webkit-scrollbar {
  width: 6px;
}

.drawer-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.header-avatar {
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
  border: 2px solid rgba(255, 255, 255, 0.5);

  &:hover {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
    transform: scale(1.06);
  }
}
</style>
