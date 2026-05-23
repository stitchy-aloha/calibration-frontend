<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card class="tool-dialog-card" style="width: 700px; max-width: 90vw;">
      <!-- Header -->
      <q-card-section class="dialog-header text-white bg-primary q-py-md">
        <div class="row items-center no-wrap justify-between">
          <div class="text-h6 text-weight-bold row items-center">
            <q-icon name="app:container" size="24px" class="q-mr-sm" />
            {{ isEditing ? 'แก้ไขข้อมูลเครื่องมือมาตรฐาน' : 'เพิ่มเครื่องมือมาตรฐาน' }}
          </div>
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </div>
      </q-card-section>

      <!-- Form Body -->
      <q-card-section class="dialog-body q-pa-lg">
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-col-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Asset Code -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.asset_code"
                label="รหัสทรัพย์สิน/รหัสเครื่องมือ"
                placeholder="เช่น STD-1"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Name -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.name"
                label="ชื่อเครื่องมือมาตรฐาน *"
                placeholder="เช่น NIBP"
                outlined
                dense
                bg-color="white"
                :rules="[val => !!val || 'กรุณากรอกชื่อเครื่องมือมาตรฐาน']"
              />
            </div>

            <!-- Manufacturer -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.manufacturer"
                label="บริษัทผู้ผลิต"
                placeholder="เช่น FLUKE"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Model -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.model"
                label="รุ่น"
                placeholder="เช่น ProSim4"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Serial Number -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.serial_number"
                label="หมายเลขเครื่อง (Serial Number)"
                placeholder="เช่น 3891030"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Unit -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.unit"
                label="หน่วยวัด"
                placeholder="เช่น VAC, mmHg"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Category -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.category_id"
                :options="categoryOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                label="หมวดหมู่/ประเภทเครื่องมือ"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Last Calibration Date -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.calibration_date_last"
                label="วันที่สอบเทียบล่าสุด"
                outlined
                dense
                bg-color="white"
                mask="####-##-##"
                placeholder="YYYY-MM-DD"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.calibration_date_last" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="ปิด" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Certificate Number -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.certificate_number"
                label="เลขที่ใบรับรอง"
                placeholder="เช่น CERT-2026-001"
                outlined
                dense
                bg-color="white"
              />
            </div>

            <!-- Certificate PDF Upload -->
            <div class="col-12 col-sm-6">
              <q-file
                v-model="pdfFile"
                label="อัปโหลดใบรับรอง (PDF เท่านั้น)"
                outlined
                dense
                bg-color="white"
                accept=".pdf"
                clearable
              >
                <template #prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <div v-if="form.path_pdf && !pdfFile" class="text-caption text-primary q-mt-xs text-truncate">
                ไฟล์ปัจจุบัน: 
                <a :href="getFileUrl(form.path_pdf)" target="_blank" class="text-underline">
                  เปิดดูไฟล์
                </a>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Action Buttons -->
      <q-card-actions align="right" class="q-px-lg q-pb-lg q-pt-none">
        <q-btn
          flat
          label="ยกเลิก"
          class="btn-cancel"
          v-close-popup
        />
        <q-btn
          unelevated
          label="บันทึกข้อมูล"
          icon="save"
          class="btn-save"
          :loading="saving"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useToolsStore } from 'src/stores/tools';
import type { BackendStandardTool } from 'src/types/tool.types';
import { useQuasar, QForm } from 'quasar';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    tool?: BackendStandardTool | null;
  }>(),
  { tool: null }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved'): void;
}>();

const $q = useQuasar();
const store = useToolsStore();
const formRef = ref<QForm | null>(null);
const saving = ref(false);
const pdfFile = ref<File | null>(null);

const isEditing = computed(() => !!props.tool);

const initialForm = {
  asset_code: '',
  name: '',
  manufacturer: '',
  model: '',
  serial_number: '',
  unit: '',
  category_id: null as number | null,
  calibration_date_last: '',
  certificate_number: '',
  path_pdf: '',
};

const form = reactive({ ...initialForm });

const categoryOptions = computed(() => {
  return [
    { label: 'กรุณาเลือกหมวดหมู่', value: null },
    ...store.standardCategories.map((c) => ({
      label: c.name,
      value: c.id,
    })),
  ];
});

onMounted(async () => {
  if (store.standardCategories.length === 0) {
    await store.fetchStandardCategories();
  }
});

watch(
  () => props.tool,
  (val) => {
    if (val) {
      form.asset_code = val.asset_code ?? '';
      form.name = val.name ?? '';
      form.manufacturer = val.manufacturer ?? '';
      form.model = val.model ?? '';
      form.serial_number = val.serial_number ?? '';
      form.unit = val.unit ?? '';
      form.category_id = val.category_id ?? null;
      form.calibration_date_last = val.calibration_date_last ?? '';
      form.certificate_number = val.certificate_number ?? '';
      form.path_pdf = val.path_pdf ?? '';
      pdfFile.value = null;
    } else {
      Object.assign(form, initialForm);
      pdfFile.value = null;
    }
  },
  { immediate: true }
);

function getFileUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${process.env.API_URL || 'http://localhost:3000'}${path}`;
}

async function onSubmit() {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  saving.value = true;
  try {
    const payload = {
      asset_code: form.asset_code || null,
      name: form.name,
      manufacturer: form.manufacturer || null,
      model: form.model || null,
      serial_number: form.serial_number || null,
      unit: form.unit || null,
      category_id: form.category_id || null,
      calibration_date_last: form.calibration_date_last || null,
      certificate_number: form.certificate_number || null,
      path_pdf: form.path_pdf || null,
    };

    let savedTool: BackendStandardTool;
    if (isEditing.value && props.tool) {
      savedTool = await store.updateStandardTool(props.tool.id, payload);
    } else {
      savedTool = await store.addStandardTool(payload);
    }

    // Handle PDF upload if selected
    if (pdfFile.value) {
      await store.uploadStandardToolPdf(savedTool.id, pdfFile.value);
    }

    $q.notify({
      type: 'positive',
      message: isEditing.value ? 'แก้ไขเครื่องมือมาตรฐานสำเร็จ' : 'เพิ่มเครื่องมือมาตรฐานสำเร็จ',
      position: 'top-right',
    });

    emit('saved');
    emit('update:modelValue', false);
  } catch (err: unknown) {
    const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'บันทึกข้อมูลล้มเหลว';
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top-right',
    });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.tool-dialog-card {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  font-family: 'Sarabun', sans-serif;
}

.dialog-body {
  font-family: 'Sarabun', sans-serif;
}

.btn-cancel {
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  color: #555;
  padding: 6px 20px;
  min-width: 100px;
  font-family: 'Sarabun', sans-serif;
  font-weight: 500;
}

.btn-save {
  background: $primary !important;
  color: #fff !important;
  border-radius: 10px;
  padding: 6px 20px;
  min-width: 120px;
  font-family: 'Sarabun', sans-serif;
  font-weight: 600;
}

.text-underline {
  text-decoration: underline;
}
</style>
