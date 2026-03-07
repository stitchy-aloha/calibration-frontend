<template>
  <q-dialog :model-value="true" @update:model-value="emit('close')" persistent>
    <q-card class="dialog-card">
      <!-- Header -->
      <div class="dialog-header">
        <q-icon name="view_list" size="22px" color="white" class="q-mr-sm" />
        <span>{{ isEdit ? 'แก้ไขกระบวนการสอบเทียบ' : 'เพิ่มกระบวนการสอบเทียบ' }}</span>
        <q-space />
        <q-btn flat round icon="close" color="white" size="sm" @click="emit('close')" />
      </div>

      <q-card-section class="q-pa-lg">
        <div class="q-mb-md">
          <div class="field-label">รายการ <span class="text-negative">*</span></div>
          <q-input
            v-model="form.parameter"
            outlined
            dense
            placeholder="ระบุรายการ"
            bg-color="grey-1"
            :rules="[(v) => !!v || 'กรุณากรอกรายการ']"
          />
        </div>

        <div class="row q-gutter-md q-mb-md">
          <div class="col">
            <div class="field-label">หน่วยวัด <span class="text-negative">*</span></div>
            <q-input
              v-model="form.unit"
              outlined
              dense
              placeholder="เช่น mmHg, BPM, Kg"
              bg-color="grey-1"
              :rules="[(v) => !!v || 'กรุณากรอกหน่วยวัด']"
            />
          </div>
          <div class="col">
            <div class="field-label">เครื่องมือมาตรฐาน <span class="text-negative">*</span></div>
            <q-input
              v-model="form.standardEquipment"
              outlined
              dense
              placeholder="เช่น Temp - Alpha Technics"
              bg-color="grey-1"
              :rules="[(v) => !!v || 'กรุณากรอกเครื่องมือมาตรฐาน']"
            />
          </div>
        </div>

        <div class="q-mb-md">
          <div class="field-label">กระบวนการสอบเทียบ <span class="text-negative">*</span></div>
          <q-input
            v-model="form.procedure"
            outlined
            type="textarea"
            rows="4"
            placeholder="ระบุกระบวนการสอบเทียบ"
            bg-color="grey-1"
            :rules="[(v) => !!v || 'กรุณาระบุกระบวนการสอบเทียบ']"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-lg q-pb-lg">
        <q-btn flat label="ยกเลิก" class="btn-cancel" @click="emit('close')" />
        <q-btn unelevated label="บันทึก" icon="save" class="btn-save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import type { CalibrationProcess } from 'src/types';

interface Props {
  process?: CalibrationProcess | null;
}

const props = withDefaults(defineProps<Props>(), { process: null });

const emit = defineEmits<{
  (e: 'saved', value: Omit<CalibrationProcess, 'id'>): void;
  (e: 'close'): void;
}>();

const isEdit = computed(() => !!props.process);

const form = reactive({
  parameter: props.process?.parameter ?? '',
  procedure: props.process?.procedure ?? '',
  unit: props.process?.unit ?? '',
  standardEquipment: props.process?.standardEquipment ?? '',
});

function handleSave() {
  if (!form.parameter || !form.unit || !form.standardEquipment || !form.procedure) return;
  emit('saved', { ...form });
}
</script>

<style scoped lang="scss">
.dialog-card {
  width: 560px;
  max-width: 95vw;
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: $secondary;
  color: #fff;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.btn-cancel {
  color: #555;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 10px;
}

.btn-save {
  background: $secondary !important;
  color: #fff !important;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 10px;
}
</style>
