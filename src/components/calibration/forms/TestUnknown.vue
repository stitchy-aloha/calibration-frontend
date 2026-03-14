<template>
  <div class="q-py-xl flex flex-center">
    <q-card flat bordered class="q-pa-lg text-center" style="max-width: 500px">
      <q-icon name="warning" color="warning" size="48px" class="q-mb-md" />
      <div class="text-h6 q-mb-sm">แผงแบบฟอร์มการสอบเทียบยังไม่ได้รับการรองรับ</div>
      <div class="text-body2 text-grey-7 q-mb-lg">
        ยังไม่มีแบบฟอร์มบันทึกผลการสอบเทียบสำหรับเครื่องมือประเภท <strong>{{ equipmentType }}</strong> 
        กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มโครงสร้างฟอร์มสำหรับอุปกรณ์นี้
      </div>

      <q-btn outline color="primary" label="กลับไปหน้าหลัก" to="/tool-management" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
interface Props {
  equipmentType?: string;
}

withDefaults(defineProps<Props>(), {
  equipmentType: 'ไม่ทราบประเภท',
});
</script>
