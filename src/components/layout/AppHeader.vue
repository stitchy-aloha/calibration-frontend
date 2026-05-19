<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        class="q-mr-sm lt-md"
        @click="emit('toggleDrawer')"
      />

      <q-toolbar-title>
        <div class="header-app-title">
          <q-icon name="medical_services" size="28px" class="q-mr-sm gt-xs" style="margin-right: 25px" />
          <div class="column">
            <span class="text-subtitle1 text-weight-bold" style="font-size: clamp(14px, 4vw, 16px)">
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

      <div class="q-separator-vertical q-my-sm bg-white opacity-20 q-mr-md gt-xs" style="width: 1px" />

      <ProfileCard :name="auth.user?.fullName ?? ''" :role="auth.user?.role ?? ''">
        <div class="row items-center">
          <div class="column text-right q-mr-sm gt-xs">
            <span class="text-weight-bold text-caption">{{ auth.user?.fullName }}</span>
            <span class="text-caption" style="font-size: 10px; opacity: 0.8">{{ auth.user?.role }}</span>
          </div>
          <q-avatar size="36px" class="header-avatar">
            <img :src="profileImage" alt="User Avatar" />
          </q-avatar>
        </div>
      </ProfileCard>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import ProfileCard from 'components/ProfileCard.vue';
import { computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';

const emit = defineEmits<{ toggleDrawer: [] }>();

const auth = useAuthStore();
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

const profileImage = computed(() => {
  const img = auth.user?.imageUrl;
  if (!img) return '/image/profile.png';
  if (img.startsWith('http')) return img;
  return `${apiBase}${img}`;
});
</script>

<style scoped lang="scss">
.header-app-title {
  display: flex;
  align-items: center;
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
