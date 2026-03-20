<template>
  <div class="dept-form">
    <!-- Header -->
    <div class="dept-form__header">
      <div class="dept-form__header-title">
        <q-icon name="apartment" size="22px" class="q-mr-sm" />
        {{ isEditing ? 'แก้ไขหน่วยงาน' : 'เพิ่มหน่วยงาน' }}
      </div>
      <q-btn flat round dense icon="close" color="white" @click="$emit('close')" />
    </div>

    <!-- Body -->
    <div class="dept-form__body">
      <q-input
        v-model="form.name"
        label="ชื่อย่อหน่วยงาน *"
        placeholder="เช่น NUR"
        outlined
        dense
        bg-color="white"
        class="q-mb-md"
      />
      <q-input
        v-model="form.description"
        label="ชื่อหน่วยงาน *"
        placeholder="เช่น กลุ่มงานการพยาบาล"
        outlined
        dense
        bg-color="white"
        class="q-mb-md"
      />
    </div>

    <!-- Footer -->
    <div class="dept-form__footer">
      <q-btn flat label="ยกเลิก" class="btn-cancel" @click="$emit('close')" />
      <q-btn unelevated label="บันทึก" icon="save" class="btn-save" @click="onSave" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { useDepartmentsStore, type Department } from 'src/stores/departments';

const props = withDefaults(
  defineProps<{
    department?: Department | null;
  }>(),
  { department: null },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const store = useDepartmentsStore();

const isEditing = computed(() => !!props.department);

function createEmptyForm() {
  return {
    name: '',
    description: '',
  };
}

const form = reactive(createEmptyForm());

watch(
  () => props.department,
  (d) => {
    if (d) {
      form.name = d.name;
      form.description = d.description ?? '';
    } else {
      Object.assign(form, createEmptyForm());
    }
  },
  { immediate: true },
);

async function onSave() {
  if (isEditing.value && props.department) {
    await store.updateDepartment(props.department.id, {
      name: form.name,
      description: form.description,
    });
  } else {
    await store.addDepartment({
      name: form.name,
      description: form.description,
    });
  }
  Object.assign(form, createEmptyForm());
  emit('saved');
  emit('close');
}
</script>

<style scoped lang="scss">
.dept-form {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Header */
.dept-form__header {
  background: $secondary;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
}

.dept-form__header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

/* Body */
.dept-form__body {
  padding: 24px 24px 8px;
}

/* Footer */
.dept-form__footer {
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
