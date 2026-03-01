<template>
  <q-page class="flex flex-center login-page">
    <div class="background-icons">
      <q-icon name="medication" size="100px" class="bg-icon icon-1" />
      <q-icon name="science" size="80px" class="bg-icon icon-2" />
      <q-icon name="biotech" size="120px" class="bg-icon icon-3" />
      <q-icon name="computer" size="90px" class="bg-icon icon-4" />
      <q-icon name="monitor_heart" size="110px" class="bg-icon icon-5" />
      <q-icon name="build" size="70px" class="bg-icon icon-6" />
    </div>

    <q-card class="login-card q-pa-lg shadow-10">
      <q-card-section class="text-center q-pb-none">
        <div class="logo-container q-mb-md">
          <div class="logo-bg row flex-center">
            <q-icon name="app:settings_heart" color="white" size="32px" />
          </div>
        </div>
        <div class="text-h6 text-weight-bold text-grey-9">เข้าสู่ระบบ MECMS</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- User ID / Email Input -->
          <div class="input-section">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">User ID / Email</div>
            <q-input
              outlined
              v-model="email"
              dense
              placeholder="Enter your ID"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type your User ID / Email']"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="business_center" class="text-purple-3" />
              </template>
            </q-input>
          </div>

          <!-- Password Input -->
          <div class="input-section">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Password</div>
            <q-input
              outlined
              v-model="password"
              dense
              :type="isPwdVisible ? 'text' : 'password'"
              placeholder="••••••••"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" class="text-purple-3" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdVisible ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer text-grey-6"
                  @click="isPwdVisible = !isPwdVisible"
                />
              </template>
            </q-input>
          </div>

          <!-- Options -->
          <div class="row items-center justify-between no-wrap q-mt-sm">
            <q-checkbox
              v-model="rememberMe"
              label="Remember device"
              size="xs"
              color="purple-3"
              class="text-grey-7 text-caption"
            />
            <a
              href="#"
              class="text-purple-7 text-caption text-weight-medium"
              style="text-decoration: none"
              >Reset Password?</a
            >
          </div>

          <!-- Login Button -->
          <div class="q-mt-lg">
            <q-btn
              label="เข้าสู่ระบบ"
              type="submit"
              color="deep-purple-5"
              text-color="white"
              class="full-width q-py-sm text-weight-bold shadow-2"
              icon-right="login"
              :loading="loading"
              unelevated
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import { AppRole } from 'stores/roles';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isPwdVisible = ref(false);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    $q.notify({
      color: 'positive',
      message: 'Login Successful',
      icon: 'check_circle',
    });
    if (authStore.user?.role === AppRole.DIRECTOR) {
      await router.push('/director-dashboard');
    } else {
      await router.push('/dashboard');
    }
  } catch (error: unknown) {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Invalid User ID/Email or Password';
    $q.notify({
      color: 'negative',
      message: msg,
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #fdfbfd 0%, #f3e5f5 100%);
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 2;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo-bg {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(126, 34, 206, 0.3);
}

.text-purple-3 {
  color: #d8b4fe !important;
}

.bg-purple-1 {
  background-color: #f3e8ff !important;
}

/* Floating Background Icons */
.background-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.bg-icon {
  position: absolute;
  color: #e9d5ff; /* Very light purple */
  opacity: 0.4;
  transform: rotate(-15deg);
}

.icon-1 {
  top: 10%;
  left: 5%;
  transform: rotate(15deg);
}
.icon-2 {
  top: 20%;
  right: 15%;
  transform: rotate(-10deg);
}
.icon-3 {
  bottom: 15%;
  left: 10%;
  transform: rotate(25deg);
}
.icon-4 {
  top: 50%;
  left: -5%;
  transform: rotate(-5deg);
  opacity: 0.2;
}
.icon-5 {
  bottom: 20%;
  right: 5%;
  transform: rotate(10deg);
}
.icon-6 {
  top: 75%;
  left: 15%;
  transform: rotate(-20deg);
  opacity: 0.3;
}

:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
