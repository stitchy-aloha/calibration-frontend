<template>
  <div
    class="tool-form"
    :class="{ 'tool-form--dialog': mode === 'dialog', 'tool-form--inline': mode === 'inline' }"
  >
    <!-- Header -->
    <div class="tool-form__header">
      <div class="tool-form__header-title">
        <q-icon name="edit_note" size="22px" class="q-mr-sm" />
        {{ isEditing ? 'แก้ไขข้อมูลเครื่องมือ' : 'เพิ่มข้อมูลเครื่องมือ' }}
      </div>
      <q-btn flat round dense icon="close" color="white" @click="$emit('close')" />
    </div>

    <!-- Form Body -->
    <div class="tool-form__body">
      <!-- Row 1: ID + Name -->
      <div class="form-row">
        <q-input
          v-model="form.id"
          label="รหัสเครื่องมือ *"
          outlined
          dense
          bg-color="grey-2"
          readonly
          class="form-field"
        />
        <q-input
          v-model="form.name"
          label="ชื่อเครื่องมือ *"
          placeholder="ระบุชื่อเครื่องมือ"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
      </div>

      <!-- Row 2: Model + Type -->
      <div class="form-row">
        <q-input
          v-model="form.model"
          label="ชื่อรุ่น / Model"
          placeholder="ระบุรุ่น (ถ้ามี)"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
        <q-select
          v-model="form.equipment_type_id"
          :options="toolsStore.equipmentTypes"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          label="ประเภท *"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
      </div>

      <!-- Row 3: Risk Level + Serial Number -->
      <div class="form-row">
        <q-select
          v-model="form.riskLevel"
          :options="[
            { label: 'สูง (High)', value: 'high' },
            { label: 'กลาง (Medium)', value: 'medium' },
            { label: 'ต่ำ (Low)', value: 'low' },
          ]"
          emit-value
          map-options
          label="ความเสี่ยง *"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
        <q-input
          v-model="form.serialNumber"
          label="หมายเลขเครื่อง (Serial No.)"
          placeholder="ระบุ S/N"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
      </div>

      <!-- Row 4: Calibration Cycle + Due Date -->
      <div class="form-row">
        <q-input
          v-model="form.calibrationCycle"
          label="รอบสอบเทียบ *"
          outlined
          dense
          bg-color="white"
          class="form-field"
        >
          <template #append>
            <span class="text-grey-6" style="font-size: 13px">เดือน</span>
          </template>
        </q-input>
        <q-input
          v-model="form.dueDate"
          label="ครบกำหนด (Due Date)"
          outlined
          dense
          bg-color="white"
          class="form-field"
          readonly
          placeholder="mm/dd/yyyy"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.dueDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="ตกลง" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Row 5: Hospital + Section -->
      <div class="form-row">
        <q-select
          v-model="form.sectionId"
          :options="filteredSections"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          label="แผนก/หน่วยงาน (Section) *"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
        <q-select
          v-model="form.status"
          :options="toolsStore.statusOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          label="สถานะ (Status) *"
          outlined
          dense
          bg-color="white"
          class="form-field"
        />
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="tool-form__footer">
      <q-btn flat label="ยกเลิก" class="btn-cancel" @click="$emit('close')" />
      <q-btn
        unelevated
        label="บันทึก"
        icon="save"
        class="btn-save"
        :loading="isSaving"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useToolsStore } from 'src/stores/tools';
import type { MedicalTool, ToolStatus } from 'src/types';

const props = withDefaults(
  defineProps<{
    tool?: MedicalTool | null;
    mode?: 'dialog' | 'inline';
  }>(),
  { tool: null, mode: 'dialog' },
);

const isEditing = computed(() => !!props.tool);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const toolsStore = useToolsStore();
const $q = useQuasar();
const isSaving = ref(false);

function emptyForm() {
  return {
    id: toolsStore.nextId,
    name: '',
    company: '',
    model: '',
    type: '',
    equipment_type_id: null as number | null,
    riskLevel: 'medium',
    serialNumber: '',
    calibrationCycle: '6',
    dueDate: '',
    lastCalibrationDate: '',
    location: '',
    department: '',
    hospitalId: null as number | null,
    sectionId: null as number | null,
    status: 'พร้อมใช้งาน' as ToolStatus,
  };
}

const form = reactive(emptyForm());

const filteredSections = computed(() => {
  if (!form.hospitalId) return [];
  return toolsStore.sections.filter((s) => s.hospitalId === form.hospitalId);
});

onMounted(async () => {
  await Promise.all([
    toolsStore.fetchEquipmentTypes(),
    toolsStore.fetchHospitals(),
    toolsStore.fetchSections(),
  ]);
});

watch(
  () => props.tool,
  (t) => {
    if (t) {
      Object.assign(form, {
        id: t.id,
        name: t.name,
        model: t.model,
        type: t.type,
        equipment_type_id: t.equipment_type_id ?? null,
        riskLevel: t.riskLevel || 'medium',
        serialNumber: t.serialNumber,
        calibrationCycle: t.calibrationCycle.replace(/[^\d]/g, ''),
        dueDate: t.dueDate,
        location: t.location,
        hospitalId: t.hospitalId || null,
        sectionId: t.sectionId || null,
        status: t.status,
      });
    } else {
      Object.assign(form, emptyForm());
    }
  },
  { immediate: true },
);

async function onSave() {
  isSaving.value = true;
  const data: Omit<MedicalTool, 'id'> = {
    name: form.name,
    company: form.company,
    model: form.model,
    type: form.type,
    equipment_type_id: form.equipment_type_id,
    riskLevel: form.riskLevel,
    serialNumber: form.serialNumber,
    calibrationCycle: `${form.calibrationCycle} วัน`,
    dueDate: form.dueDate,
    lastCalibrationDate: form.lastCalibrationDate,
    location: form.location,
    department: form.department,
    hospitalId: form.hospitalId,
    sectionId: form.sectionId,
    status: form.status,
  };
  try {
    if (props.tool) {
      await toolsStore.updateTool(props.tool.id, data);
      $q.notify({ type: 'positive', message: 'อัปเดตเครื่องมือสำเร็จ' });
    } else {
      await toolsStore.addTool(data);
      $q.notify({ type: 'positive', message: 'เพิ่มเครื่องมือสำเร็จ' });
    }
    Object.assign(form, emptyForm());
    emit('saved');
    emit('close');
  } catch {
    $q.notify({ type: 'negative', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped lang="scss">
.tool-form {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tool-form--inline {
  height: 100%;

  .tool-form__body {
    flex: 1;
  }
}

.tool-form--dialog {
  max-width: 700px;
  width: 100%;
}

/* Header */
.tool-form__header {
  background: $secondary;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
}

.tool-form__header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

/* Body */
.tool-form__body {
  padding: 24px 24px 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-field {
  flex: 1;
}

/* Footer */
.tool-form__footer {
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
