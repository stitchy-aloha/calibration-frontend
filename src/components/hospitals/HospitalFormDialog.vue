<template>
  <div class="hosp-form">
    <!-- Header -->
    <div class="hosp-form__header">
      <div class="hosp-form__header-title">
        <q-icon name="local_hospital" size="22px" class="q-mr-sm" />
        {{ isEditing ? 'แก้ไขข้อมูลโรงพยาบาล' : 'เพิ่มโรงพยาบาล' }}
      </div>
      <q-btn flat round dense icon="close" color="white" @click="$emit('close')" />
    </div>

    <!-- Body -->
    <div class="hosp-form__body">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-input
            v-model="form.code"
            label="รหัสโรงพยาบาล *"
            placeholder="เช่น 10000"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12 col-md-8">
          <q-input
            v-model="form.name"
            label="ชื่อโรงพยาบาล *"
            placeholder="เช่น โรงพยาบาลส่งเสริมสุขภาพตำบล"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="form.description"
            label="คำอธิบาย (ถ้ามี)"
            placeholder="เช่น สาขาบางสะพาน"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="form.address"
            label="ที่อยู่"
            placeholder="เลขที่ 94 หมู่ 5 ถนนเพชรเกษม..."
            outlined
            dense
            type="textarea"
            rows="2"
            bg-color="white"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="form.district"
            label="อำเภอ"
            placeholder="บางสะพาน"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="form.province"
            label="จังหวัด"
            placeholder="ประจวบคีรีขันธ์"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="form.zipCode"
            label="รหัสไปรษณีย์"
            placeholder="77140"
            outlined
            dense
            bg-color="white"
          />
        </div>
        <div class="col-12">
          <q-file
            v-model="form.logoFile"
            label="อัปโหลดโลโก้"
            outlined
            dense
            bg-color="white"
            accept="image/*"
          >
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="hosp-form__footer">
      <q-btn flat label="ยกเลิก" class="btn-cancel" @click="$emit('close')" />
      <q-btn unelevated label="บันทึก" icon="save" class="btn-save" @click="onSave" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { useHospitalsStore } from 'src/stores/hospitals';
import type { Hospital } from 'src/services/tool.service';

const props = withDefaults(
  defineProps<{
    hospital?: Hospital | null;
  }>(),
  { hospital: null },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const store = useHospitalsStore();

const isEditing = computed(() => !!props.hospital);

function createEmptyForm() {
  return {
    code: '',
    name: '',
    description: '',
    address: '',
    district: '',
    province: '',
    zipCode: '',
    logoFile: null as File | null,
  };
}

const form = reactive(createEmptyForm());

watch(
  () => props.hospital,
  (h) => {
    if (h) {
      form.code = h.code ?? '';
      form.name = h.name;
      form.description = h.description ?? '';
      form.address = h.address ?? '';
      form.district = h.district ?? '';
      form.province = h.province ?? '';
      form.zipCode = h.zipCode ?? '';
      form.logoFile = null;
    } else {
      Object.assign(form, createEmptyForm());
    }
  },
  { immediate: true },
);

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append('code', form.code);
  fd.append('name', form.name);
  fd.append('description', form.description);
  fd.append('address', form.address);
  fd.append('district', form.district);
  fd.append('province', form.province);
  fd.append('zipCode', form.zipCode);
  if (form.logoFile) {
    fd.append('logo', form.logoFile);
  }
  return fd;
}

async function onSave() {
  const fd = buildFormData();
  if (isEditing.value && props.hospital) {
    await store.updateHospital(props.hospital.id, fd);
  } else {
    await store.addHospital(fd);
  }
  Object.assign(form, createEmptyForm());
  emit('saved');
  emit('close');
}
</script>

<style scoped lang="scss">
.hosp-form {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Header */
.hosp-form__header {
  background: $secondary;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
}

.hosp-form__header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

/* Body */
.hosp-form__body {
  padding: 24px;
}

/* Footer */
.hosp-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 24px 20px;
}

.btn-cancel {
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  color: #555;
  padding: 6px 24px;
}

.btn-save {
  background: $primary !important;
  color: #fff !important;
  border-radius: 10px;
  padding: 6px 24px;
  font-weight: 600;
}
</style>
