<template>
  <q-dialog :model-value="true" @update:model-value="emit('close')" persistent>
    <q-card class="dialog-card">
      <!-- Header -->
      <div class="dialog-header">
        <q-icon name="receipt_long" size="22px" color="white" class="q-mr-sm" />
        <span>{{ isEdit ? 'แก้ไขค่าใช้จ่าย' : 'เพิ่มค่าใช้จ่ายในการสอบเทียบ' }}</span>
        <q-space />
        <q-btn flat round icon="close" color="white" size="sm" @click="emit('close')" />
      </div>

      <q-card-section class="q-pa-lg">
        <div class="q-mb-md">
          <div class="field-label">ชื่อเครื่องมือ <span class="text-negative">*</span></div>
          <q-input
            v-model="form.toolName"
            outlined
            dense
            placeholder="ระบุชื่อเครื่องมือ"
            bg-color="grey-1"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อเครื่องมือ']"
          />
        </div>

        <div class="q-mb-md">
          <div class="field-label">รายการ <span class="text-negative">*</span></div>
          <q-input
            v-model="form.description"
            outlined
            dense
            placeholder="ระบุรายการ"
            bg-color="grey-1"
            :rules="[(v) => !!v || 'กรุณากรอกรายการ']"
          />
        </div>

        <div class="q-mb-md">
          <div class="field-label">ราคา (บาท) <span class="text-negative">*</span></div>
          <q-input
            v-model.number="form.price"
            outlined
            dense
            type="number"
            placeholder="0"
            bg-color="grey-1"
            :rules="[(v) => v > 0 || 'กรุณากรอกราคา']"
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
import type { CalibrationCost } from 'src/types';

interface Props {
  cost?: CalibrationCost | null;
}

const props = withDefaults(defineProps<Props>(), { cost: null });

const emit = defineEmits<{
  (e: 'saved', value: Omit<CalibrationCost, 'id'>): void;
  (e: 'close'): void;
}>();

const isEdit = computed(() => !!props.cost);

const form = reactive({
  toolName: props.cost?.toolName ?? '',
  description: props.cost?.description ?? '',
  price: props.cost?.price ?? 0,
});

function handleSave() {
  if (!form.toolName || !form.description || form.price <= 0) return;
  emit('saved', { ...form });
}
</script>

<style scoped lang="scss">
.dialog-card {
  width: 480px;
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
