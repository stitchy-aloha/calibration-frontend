<template>
  <q-card class="dialog-card">
    <q-card-section class="dialog-header">
      <div class="text-h6 text-weight-bold">{{ isEdit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน' }}</div>
      <q-btn flat round dense icon="close" @click="$emit('close')" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-lg">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.username"
          outlined
          dense
          label="ชื่อผู้ใช้งาน (Username)"
          :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้']"
        />

        <q-input
          v-model="form.name"
          outlined
          dense
          label="ชื่อ-นามสกุล"
          :rules="[(v) => !!v || 'กรุณากรอกชื่อ-นามสกุล']"
        />

        <q-input
          v-model="form.email"
          outlined
          dense
          label="อีเมล"
          type="email"
          :rules="[(v) => !!v || 'กรุณากรอกอีเมล']"
        />

        <q-input v-model="form.tel" outlined dense label="เบอร์โทรศัพท์" mask="##########" />

        <q-select
          v-model="form.roleId"
          :options="roleOptions"
          outlined
          dense
          emit-value
          map-options
          label="ตำแหน่ง"
          :rules="[(v) => !!v || 'กรุณาเลือกตำแหน่ง']"
        />

        <q-input
          v-if="!isEdit"
          v-model="form.password"
          outlined
          dense
          label="รหัสผ่าน"
          :type="showPwd ? 'text' : 'password'"
          :rules="[(v) => isEdit || !!v || 'กรุณากรอกรหัสผ่าน']"
        >
          <template #append>
            <q-icon
              :name="showPwd ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat label="ยกเลิก" @click="$emit('close')" />
          <q-btn
            unelevated
            type="submit"
            :label="isEdit ? 'บันทึก' : 'เพิ่ม'"
            class="btn-save"
            :loading="saving"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore, type User } from 'src/stores/user';

const props = defineProps<{ user: User | null }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const $q = useQuasar();
const store = useUserStore();

const isEdit = computed(() => !!props.user);
const saving = ref(false);
const showPwd = ref(false);

const form = ref({
  username: '',
  name: '',
  email: '',
  tel: '',
  roleId: null as number | null,
  password: '',
});

// Prefill form when editing
watch(
  () => props.user,
  (u) => {
    if (u) {
      form.value = {
        username: u.username,
        name: u.name,
        email: u.email,
        tel: u.tel,
        roleId: u.roleId,
        password: '',
      };
    } else {
      form.value = { username: '', name: '', email: '', tel: '', roleId: null, password: '' };
    }
  },
  { immediate: true },
);

const roleOptions = [
  { label: 'ผู้ดูแลระบบ', value: 1 },
  { label: 'ช่างเทคนิค', value: 2 },
  { label: 'หัวหน้าแผนก', value: 3 },
  { label: 'ผู้อำนวยการ', value: 4 },
];

async function onSubmit() {
  saving.value = true;
  try {
    if (isEdit.value && props.user) {
      await store.updateUser(props.user.id, {
        username: form.value.username,
        name: form.value.name,
        email: form.value.email,
        tel: form.value.tel,
        roleId: form.value.roleId!,
      } as Partial<User>);
      $q.notify({ color: 'positive', message: 'แก้ไขสำเร็จ', icon: 'check_circle' });
    } else {
      await store.createUser({
        username: form.value.username,
        name: form.value.name,
        email: form.value.email,
        tel: form.value.tel,
        roleId: form.value.roleId!,
        password: form.value.password,
      } as Partial<User> & { password: string });
      $q.notify({ color: 'positive', message: 'เพิ่มผู้ใช้งานสำเร็จ', icon: 'check_circle' });
    }
    emit('saved');
  } catch {
    $q.notify({ color: 'negative', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่', icon: 'error' });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.dialog-card {
  border-radius: 16px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-save {
  background: $secondary !important;
  color: #fff !important;
  border-radius: 10px;
  font-weight: 600;
  padding: 6px 24px;
}

:deep(.q-field__control) {
  border-radius: 10px;
}
</style>
