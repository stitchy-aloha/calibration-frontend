<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 350px; border-radius: 12px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">ยืนยันการบันทึก</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-lg text-center">
        <q-icon name="check_circle" color="primary" size="4rem" class="q-mb-md" />
        <div class="text-subtitle1 text-grey-9">คุณแน่ใจหรือไม่ว่าต้องการบันทึกข้อมูลการทดสอบนี้?</div>
        <div class="text-caption text-grey-6 q-mt-sm">กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนกดยืนยัน</div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg q-px-lg">
        <q-btn outline label="ยกเลิก" color="grey-7" class="q-px-lg" v-close-popup no-caps />
        <q-btn
          unelevated
          label="ยืนยันการบันทึก"
          color="primary"
          class="q-px-lg"
          @click="onConfirm"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const onConfirm = () => {
  emit('confirm');
  show.value = false;
};
</script>
