<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="confirm-delete-card">
      <q-card-section class="row items-center q-pb-none justify-center">
        <div class="warning-icon-bg">
          <q-icon name="delete_forever" color="red-5" size="32px" />
        </div>
      </q-card-section>

      <q-card-section class="text-center q-pt-md">
        <div class="text-h6 text-weight-bold text-grey-9">{{ title }}</div>
        <div class="text-body2 text-grey-7 q-mt-sm">
          {{ message }} <br />
          <span v-if="itemName" class="text-weight-bold text-red-7 item-name-highlight">
            "{{ itemName }}"
          </span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg q-pt-md q-px-lg gap-md">
        <q-btn
          flat
          label="ยกเลิก"
          class="btn-cancel"
          v-close-popup
          :disable="loading"
          @click="$emit('cancel')"
        />
        <q-btn
          unelevated
          label="ยืนยันการลบ"
          color="red-5"
          class="btn-confirm"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  itemName?: string | undefined;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'ยืนยันการลบ',
  message: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?',
  itemName: '',
  loading: false,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<style scoped lang="scss">
.confirm-delete-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px !important;
  padding: 8px;
}

.warning-icon-bg {
  width: 70px;
  height: 70px;
  background: #fff5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}

.item-name-highlight {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  background: #fff5f5;
  border-radius: 6px;
}

.gap-md {
  gap: 16px;
}

.btn-cancel {
  flex: 1;
  border: 1.5px solid #eee;
  border-radius: 12px;
  color: #666;
  font-weight: 600;
  height: 44px;
}

.btn-confirm {
  flex: 1.2;
  border-radius: 12px;
  font-weight: 700;
  height: 44px;
}
</style>
