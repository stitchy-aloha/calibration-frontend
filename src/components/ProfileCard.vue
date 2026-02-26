<template>
  <!-- Trigger slot: wraps the avatar button -->
  <div class="profile-trigger-wrap" ref="triggerRef" @click="toggleCard">
    <slot />
  </div>

  <!-- Teleport card to body so it's not clipped by header overflow -->
  <Teleport to="body">
    <Transition name="profile-pop">
      <div v-if="open" class="profile-card-overlay" @click.self="closeCard">
        <div class="profile-card" :style="cardStyle">
          <!-- Decorative gradient band -->
          <div class="profile-card__banner" />

          <!-- Avatar -->
          <div class="profile-card__avatar-wrap">
            <q-avatar size="72px" class="profile-card__avatar">
              <img src="/image/profile.png" alt="User Avatar" />
            </q-avatar>
          </div>

          <!-- User info -->
          <div class="profile-card__info">
            <p class="profile-card__name">{{ authStore.user?.fullName }}</p>
            <p class="profile-card__role">{{ authStore.user?.role }}</p>
          </div>

          <q-separator class="q-my-md opacity-30" />

          <!-- Actions -->
          <div class="profile-card__actions">
            <button class="profile-card__btn" @click="onEditProfile">
              <q-icon name="manage_accounts" size="18px" class="btn-icon" />
              <span>แก้ไขโปรไฟล์</span>
              <q-icon name="chevron_right" size="16px" class="btn-arrow" />
            </button>

            <button class="profile-card__btn profile-card__btn--danger" @click="onLogout">
              <q-icon name="logout" size="18px" class="btn-icon" />
              <span>ออกจากระบบ</span>
              <q-icon name="chevron_right" size="16px" class="btn-arrow" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

withDefaults(
  defineProps<{
    name?: string;
    role?: string;
  }>(),
  {
    name: 'เฟอร์รารี่ ใจดี',
    role: 'ช่างเทคนิค',
  },
);

const emit = defineEmits<{
  (e: 'edit-profile'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);

// Position card below the trigger
const cardStyle = computed(() => {
  if (!triggerRef.value) return {};
  const rect = triggerRef.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + 10}px`,
    right: `${window.innerWidth - rect.right}px`,
  };
});

function toggleCard() {
  open.value = !open.value;
}

function closeCard() {
  open.value = false;
}

function onEditProfile() {
  open.value = false;
  emit('edit-profile');
}

async function onLogout() {
  open.value = false;
  authStore.logout();
  await router.push('/');
}
</script>

<style scoped lang="scss">
/* ── Trigger wrapper ─────────────────────────── */
.profile-trigger-wrap {
  cursor: pointer;
  user-select: none;
}

/* ── Overlay (transparent backdrop) ─────────── */
.profile-card-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  /* no backdrop so header stays visible */
}

/* ── Card shell ──────────────────────────────── */
.profile-card {
  position: fixed;
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10000;
}

/* ── Top gradient banner ─────────────────────── */
.profile-card__banner {
  height: 64px;
}

/* ── Avatar ──────────────────────────────────── */
.profile-card__avatar-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: -36px;
}

.profile-card__avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ── Info ────────────────────────────────────── */
.profile-card__info {
  padding: 12px 24px 0;
  text-align: center;
}

.profile-card__name {
  margin: 0 0 2px;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.2px;
}

.profile-card__role {
  margin: 0 0 8px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.profile-card__badge {
  font-size: 11px;
  padding: 2px 10px;
}

/* ── Actions ─────────────────────────────────── */
.profile-card__actions {
  padding: 0 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-card__btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: inherit;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.1s ease;
  text-align: left;
  gap: 10px;

  .btn-icon {
    color: #1976d2;
    flex-shrink: 0;
  }

  .btn-arrow {
    margin-left: auto;
    opacity: 0;
    transform: translateX(-4px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
    color: #9ca3af;
  }

  &:hover {
    background: #f0f6ff;
    color: #1976d2;
    transform: translateX(2px);

    .btn-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.profile-card__btn--danger {
  .btn-icon {
    color: #ef5350;
  }

  &:hover {
    background: #fff0f0;
    color: #ef5350;
  }
}

/* ── Pop transition ──────────────────────────── */
.profile-pop-enter-active {
  animation: popIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.profile-pop-leave-active {
  animation: popOut 0.16s ease-in forwards;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.88) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes popOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(-6px);
  }
}
</style>
