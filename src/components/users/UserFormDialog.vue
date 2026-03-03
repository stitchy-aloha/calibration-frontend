<template>
  <q-card class="dialog-card">
    <!-- Header -->
    <q-card-section class="dialog-header">
      <div class="row items-center">
        <q-icon name="edit_note" size="24px" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bold">
          {{ isEdit ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มข้อมูลผู้ใช้งาน' }}
        </span>
      </div>
      <q-btn flat round dense icon="close" color="white" @click="$emit('close')" />
    </q-card-section>

    <!-- Form -->
    <q-card-section class="q-pa-lg">
      <q-form @submit.prevent="onSubmit" class="form-grid">
        <!-- Row 1 -->
        <div class="form-field">
          <label class="field-label">รหัสพนักงาน <span class="required">*</span></label>
          <q-input
            v-model="form.username"
            outlined
            dense
            placeholder="ระบุรหัสพนักงาน"
            :rules="[(v) => !!v || 'กรุณากรอกรหัสพนักงาน']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">ชื่อ-นามสกุล <span class="required">*</span></label>
          <q-input
            v-model="form.name"
            outlined
            dense
            placeholder="ระบุชื่อ-นามสกุล"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อ-นามสกุล']"
          />
        </div>

        <!-- Row 2 -->
        <div class="form-field">
          <label class="field-label">อีเมล <span class="required">*</span></label>
          <q-input
            v-model="form.email"
            outlined
            dense
            placeholder="ระบุอีเมล"
            type="email"
            :rules="[(v) => !!v || 'กรุณากรอกอีเมล']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">รหัสผ่าน <span v-if="!isEdit" class="required">*</span></label>
          <q-input
            v-model="form.password"
            outlined
            dense
            placeholder="ระบุรหัสผ่าน"
            :type="showPwd ? 'text' : 'password'"
            :rules="[(v) => isEdit || !!v || 'กรุณากรอกรหัสผ่าน']"
          >
            <template #append>
              <q-icon
                :name="showPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer text-grey-5"
                @click="showPwd = !showPwd"
              />
            </template>
          </q-input>
        </div>

        <!-- Row 3 -->
        <div class="form-field">
          <label class="field-label">เบอร์โทรศัพท์ <span class="required">*</span></label>
          <q-input
            v-model="form.tel"
            outlined
            dense
            placeholder="ระบุเบอร์โทรศัพท์"
            mask="##########"
            :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">ตำแหน่ง <span class="required">*</span></label>
          <q-select
            v-model="form.roleId"
            :options="roleOptions"
            outlined
            dense
            emit-value
            map-options
            placeholder="เลือกตำแหน่ง"
            :rules="[(v) => !!v || 'กรุณาเลือกตำแหน่ง']"
          />
        </div>

        <!-- Row 4 — Image Upload (full width) -->
        <div class="form-field full-width">
          <label class="field-label">รูปภาพ</label>
          <q-file v-model="form.image" outlined dense accept="image/*" label="อัปโหลดรูป">
            <template #prepend>
              <q-icon name="cloud_upload" color="grey-5" />
            </template>
          </q-file>
        </div>

        <!-- Actions -->
        <div class="form-actions full-width">
          <q-btn flat label="ยกเลิก" class="btn-cancel" @click="$emit('close')" />
          <q-btn
            unelevated
            type="submit"
            icon="save"
            label="บันทึก"
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
  image: null as File | null,
});

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
        image: null,
      };
    } else {
      form.value = {
        username: '',
        name: '',
        email: '',
        tel: '',
        roleId: null,
        password: '',
        image: null,
      };
    }
  },
  { immediate: true },
);

const roleOptions = [
  { label: 'ผู้ดูแลระบบ', value: 1 },
  { label: 'เจ้าหน้าที่สอบเทียบ', value: 2 },
  { label: 'หัวหน้าแผนก', value: 3 },
  { label: 'ผู้อำนวยการ', value: 4 },
];

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append('username', form.value.username);
  fd.append('name', form.value.name);
  fd.append('email', form.value.email);
  fd.append('tel', form.value.tel);
  if (form.value.roleId) fd.append('roleId', String(form.value.roleId));
  if (form.value.password) fd.append('password', form.value.password);
  if (form.value.image) fd.append('image', form.value.image);
  return fd;
}

async function onSubmit() {
  saving.value = true;
  try {
    const fd = buildFormData();
    if (isEdit.value && props.user) {
      await store.updateUser(props.user.id, fd);
      $q.notify({ color: 'positive', message: 'แก้ไขสำเร็จ', icon: 'check_circle' });
    } else {
      await store.createUser(fd);
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
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 4px;
}

.required {
  color: $negative;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  border: 1px solid #ddd;
  border-radius: 10px;
  color: #666;
  font-weight: 500;
  padding: 6px 20px;
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
