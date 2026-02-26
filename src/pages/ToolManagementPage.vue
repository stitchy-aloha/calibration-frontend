<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="text-h6 q-mb-sm text-weight-bold">จัดการเครื่องมือแพทย์</div>
    <div class="text-caption text-grey-6 q-mb-md">เพิ่มและตั้งค่าเครื่องมือทั้งหมดในระบบ</div>

    <!-- Two-column layout -->
    <div class="manage-layout">
      <!-- Left Sidebar -->
      <div class="manage-sidebar">
        <q-btn
          unelevated
          icon="add"
          label="เพิ่มเครื่องมือ"
          class="sidebar-btn sidebar-btn--primary"
          @click="resetForm"
        />

        <q-btn
          outline
          icon="settings"
          label="ตั้งค่าเครื่องมือแพทย์"
          class="sidebar-btn sidebar-btn--outline"
        />
      </div>

      <!-- Right: Form (fills remaining space) -->
      <div class="manage-form-area">
        <ToolFormDialog
          :key="formKey"
          :tool="editingTool"
          mode="inline"
          @close="goBack"
          @saved="goBack"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ToolFormDialog from 'src/components/tools/ToolFormDialog.vue';
import type { MedicalTool } from 'src/stores/tools';

const router = useRouter();
const editingTool = ref<MedicalTool | null>(null);
const formKey = ref(0);

function resetForm() {
  editingTool.value = null;
  formKey.value++;
}

async function goBack() {
  await router.push('/tools');
}
</script>

<style scoped lang="scss">
.manage-layout {
  display: flex;
  gap: 24px;
  align-items: stretch;
  min-height: calc(100vh - 200px);
}

/* Sidebar */
.manage-sidebar {
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ececec;
  padding: 20px;
  align-self: flex-start;
}

.sidebar-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  padding: 14px 0;
  font-size: 14px;
}

.sidebar-btn--primary {
  background: $secondary !important;
  color: #fff !important;
}

.sidebar-btn--outline {
  border-color: #d0d5dd;
  color: #555;
}

/* Form area — fills remaining width + height */
.manage-form-area {
  flex: 1;
  border-radius: 20px;
  border: 1px solid #ececec;
  overflow: hidden;
  background: #fff;
  min-height: calc(100vh - 200px);
}

@media (max-width: 768px) {
  .manage-layout {
    flex-direction: column;
    min-height: unset;
  }

  .manage-sidebar {
    width: 100%;
    min-width: unset;
  }
}
</style>
