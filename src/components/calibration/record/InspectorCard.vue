<template>
  <q-card flat bordered class="inspector-card">
    <!-- Avatar centered -->
    <q-card-section class="text-center q-pb-xs q-pt-lg">
      <q-avatar size="44px" class="inspector-avatar">
        <q-icon name="person" size="26px" color="white" />
      </q-avatar>
      <div class="inspector-title q-mt-sm">ผู้ทำการสอบเทียบ</div>
    </q-card-section>

    <!-- Name & Role rows -->
    <q-card-section class="q-pt-sm q-pb-lg">
      <div class="info-row">
        <span class="info-key">ชื่อ</span>
        <span class="info-val">{{ displayName }}</span>
      </div>
      <div class="info-row q-mt-xs">
        <span class="info-key">ตำแหน่ง</span>
        <span class="info-val">{{ displayRole }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from 'stores/auth';
import { AppRole } from 'stores/roles';

const props = defineProps<{
  inspectorName?: string;
  inspectorRole?: string;
}>();

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const roleLabelMap: Record<string, string> = {
  [AppRole.ADMIN]: 'ผู้ดูแลระบบ',
  [AppRole.TECHNICIAN]: 'ช่างเทคนิค',
  [AppRole.HEAD_OF_DEPT]: 'หัวหน้าแผนก',
  [AppRole.DIRECTOR]: 'ผู้อำนวยการ',
};

const displayName = computed(() => props.inspectorName ?? user.value?.name ?? '-');

const displayRole = computed(() => {
  const role = props.inspectorRole;
  if (role && role !== '-') return role;
  return user.value?.role ? (roleLabelMap[user.value.role] ?? user.value.role) : '-';
});
</script>

<style scoped lang="scss">
.inspector-card {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
}

.inspector-avatar {
  background: linear-gradient(135deg, $secondary 0%, $primary 100%);
  color: #fff;
}

.inspector-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 4px;
  font-size: 13px;
}

.info-key {
  color: #888;
  font-weight: 500;
}

.info-val {
  color: #1a1a2e;
  font-weight: 600;
}
</style>
