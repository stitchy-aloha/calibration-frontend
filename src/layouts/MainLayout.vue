<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm lt-md"
        />
        <q-toolbar-title>
          <div class="header-app-title">
            <q-icon
              name="medical_services"
              size="28px"
              class="q-mr-sm gt-xs"
              style="margin-right: 25px"
            />
            <div class="column">
              <span
                class="text-subtitle1 text-weight-bold"
                style="font-size: clamp(14px, 4vw, 16px)"
              >
                ระบบบริหารจัดการสอบเทียบเครื่องมือแพทย์
              </span>
              <span class="text-caption text-weight-regular opacity-70 gt-xs">
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
          class="q-separator-vertical q-my-sm bg-white opacity-20 q-mr-md gt-xs"
          style="width: 1px"
        ></div>

        <ProfileCard :name="auth.user?.fullName ?? ''" :role="auth.user?.role ?? ''">
          <div class="row items-center">
            <div class="column text-right q-mr-sm gt-xs">
              <span class="text-weight-bold text-caption">{{ auth.user?.fullName }}</span>
              <span class="text-caption" style="font-size: 10px; opacity: 0.8">{{
                auth.user?.role
              }}</span>
            </div>
            <q-avatar size="36px" class="header-avatar">
              <img :src="profileImage" alt="User Avatar" />
            </q-avatar>
          </div>
        </ProfileCard>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      side="left"
      :width="$q.screen.lt.md || expandedDrawer ? 240 : 60"
      @mouseenter="expandedDrawer = true"
      @mouseleave="expandedDrawer = false"
      class="app-drawer"
      :style="!$q.screen.lt.md ? { top: '50px', height: 'calc(100vh - 50px)' } : {}"
    >
      <div class="drawer-inner">
        <q-list class="drawer-list">
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
            :compact="!expandedDrawer && !$q.screen.lt.md"
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
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const auth = useAuthStore();
const $q = useQuasar();
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

const profileImage = computed(() => {
  const img = auth.user?.imageUrl;
  if (!img) return '/image/profile.png';
  if (img.startsWith('http')) return img;
  return `${apiBase}${img}`;
});

const allLinks: EssentialLinkProps[] = [
  { title: 'หน้าหลัก', caption: 'Home Page', icon: 'app:home', link: '/dashboard' },
  {
    title: 'แดชบอร์ดผู้บริหาร',
    caption: 'Executive Dashboard',
    icon: 'app:home',
    link: '/director-dashboard',
  },
  {
    title: 'แผนการสอบเทียบ',
    caption: 'Calibration Schedule',
    icon: 'calendar_month',
    link: '/schedule',
  },
  { title: 'จัดการวอร์ด', caption: 'Ward Management', icon: 'location_on', link: '/ward' },
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
  { title: 'เครื่องมือแพทย์', caption: 'Medical Tools', icon: 'vaccines', link: '/tools' },
  { title: 'จัดการเครื่องมือ', caption: 'Config Tools', icon: 'app:config', link: '/tools/manage' },
  { title: 'หน่วยงาน', caption: 'Departments', icon: 'business', link: '/departments' },
  { title: 'จัดการผู้ใช้งาน', caption: 'User Management', icon: 'group', link: '/users' },
  { title: 'ข้อมูลโรงพยาบาล', caption: 'Hospital Info', icon: 'local_hospital', link: '/hospitals' },
  {
    title: 'ประวัติการสอบเทียบ',
    caption: 'Calibration History',
    icon: 'app:save',
    link: '/history',
  },
];

const linksList = computed<EssentialLinkProps[]>(() => {
  const allowed = auth.permissions?.allowedMenus || [];
  return allLinks.filter((link) => allowed.includes(link.link || ''));
});

const leftDrawerOpen = ref(false);
const expandedDrawer = ref(false);
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
