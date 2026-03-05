<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="export-dialog-card">
      <!-- Header -->
      <div class="dialog-header">
        <div class="row items-center gap-sm">
          <q-icon name="download" size="20px" />
          <span class="text-subtitle1 text-weight-bold">ส่งออกข้อมูล (Export)</span>
        </div>
        <q-btn flat round dense icon="close" @click="close" />
      </div>

      <q-scroll-area style="height: calc(100% - 64px)">
        <div class="dialog-body q-gutter-y-lg">
          <!-- File Format -->
          <div>
            <div class="section-label">รูปแบบไฟล์</div>
            <div class="row q-gutter-sm">
              <div
                class="format-card col cursor-pointer"
                :class="{ 'format-card--active': form.format === 'csv' }"
                @click="form.format = 'csv'"
              >
                <q-icon name="description" size="28px" color="positive" />
                <div class="text-weight-bold q-mt-xs">ไฟล์ CSV</div>
                <div class="text-caption text-grey-6">ข้อมูลสำหรับ Excel / Sheets</div>
              </div>
              <div
                class="format-card col cursor-pointer"
                :class="{ 'format-card--active': form.format === 'pdf' }"
                @click="form.format = 'pdf'"
              >
                <q-icon name="picture_as_pdf" size="28px" color="negative" />
                <div class="text-weight-bold q-mt-xs">ไฟล์ PDF</div>
                <div class="text-caption text-grey-6">รูปแบบใบรับรอง (Cert)</div>
              </div>
            </div>
          </div>

          <!-- Cert Type -->
          <div>
            <div class="section-label">ประเภทใบรับรอง</div>
            <div class="row q-gutter-sm">
              <div
                v-for="ct in certTypes"
                :key="ct.value"
                class="cert-card col cursor-pointer"
                :class="{ 'cert-card--active': form.certType === ct.value }"
                @click="form.certType = ct.value"
              >
                <q-avatar
                  size="52px"
                  :style="{
                    background: form.certType === ct.value ? 'rgba(147,121,194,0.15)' : '#f5f5f5',
                  }"
                >
                  <q-icon
                    :name="ct.icon"
                    size="24px"
                    :color="form.certType === ct.value ? 'primary' : 'grey-6'"
                  />
                </q-avatar>
                <div class="text-weight-bold text-body2 q-mt-sm">{{ ct.label }}</div>
              </div>
            </div>
          </div>

          <!-- Date Range -->
          <div>
            <div class="section-label">ช่วงเวลาที่ต้องการ</div>
            <div class="row q-gutter-sm">
              <q-input
                v-model="form.dateFrom"
                outlined
                dense
                label="เริ่มจากวันที่"
                type="date"
                class="col"
              >
                <template #prepend>
                  <q-icon name="calendar_today" size="16px" color="grey-6" />
                </template>
              </q-input>
              <q-input
                v-model="form.dateTo"
                outlined
                dense
                label="ถึงวันที่"
                type="date"
                class="col"
              >
                <template #prepend>
                  <q-icon name="calendar_today" size="16px" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Filters -->
          <div>
            <div class="section-label">รายละเอียดอื่น ๆ</div>
            <div class="row q-gutter-sm">
              <q-select
                v-model="form.device"
                :options="deviceOptions"
                outlined
                dense
                label="เครื่องมือ"
                class="col"
                emit-value
                map-options
              />
              <q-select
                v-model="form.result"
                :options="resultOptions"
                outlined
                dense
                label="ผลการสอบเทียบ"
                class="col"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </q-scroll-area>

      <!-- Footer Actions -->
      <div class="dialog-footer">
        <q-btn flat label="ยกเลิก" color="grey-7" @click="close" />
        <q-btn
          unelevated
          color="primary"
          icon="download"
          label="ส่งออกไฟล์"
          class="q-px-lg"
          :loading="exporting"
          @click="handleExport"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

type ExportFormat = 'csv' | 'pdf';
type CertType = 'all' | 'external' | 'calibration';

interface Props {
  modelValue: boolean;
  deviceOptions: { label: string; value: string }[];
  resultOptions: { label: string; value: string }[];
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const $q = useQuasar();
const exporting = ref(false);

const certTypes: { label: string; value: CertType; icon: string }[] = [
  { label: 'ทั้งหมด', value: 'all', icon: 'layers' },
  { label: 'ตรวจสภาพภายนอก', value: 'external', icon: 'build' },
  { label: 'การสอบเทียบ', value: 'calibration', icon: 'fact_check' },
];

const form = reactive({
  format: 'pdf' as ExportFormat,
  certType: 'all' as CertType,
  dateFrom: '',
  dateTo: '',
  device: '',
  result: '',
});

function close() {
  emit('update:modelValue', false);
}

async function handleExport() {
  exporting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  exporting.value = false;
  close();
  $q.notify({
    type: 'positive',
    icon: 'check_circle',
    message: `ส่งออกไฟล์ ${form.format.toUpperCase()} สำเร็จ`,
    position: 'top-right',
    timeout: 3000,
  });
}
</script>

<style scoped lang="scss">
.export-dialog-card {
  width: 560px;
  max-width: 95vw;
  height: 680px;
  max-height: 92vh;
  border-radius: 16px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  color: white;
  flex-shrink: 0;
  background: $secondary;
}

.dialog-body {
  padding: 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 10px;
  padding-left: 2px;
  border-left: 3px solid $primary;
  padding-left: 8px;
}

/* Format cards */
.format-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px 14px;
  text-align: left;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba($primary, 0.4);
    background: rgba($primary, 0.03);
  }

  &--active {
    border-color: $primary;
    background: rgba($primary, 0.06);
  }
}

/* Cert type cards */
.cert-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 18px 12px;
  text-align: center;
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba($primary, 0.4);
    background: rgba($primary, 0.03);
  }

  &--active {
    border-color: $primary;
    background: rgba($primary, 0.06);
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}
</style>
