# Form Validation Convention

มาตรฐานการจัดการและตรวจสอบความถูกต้องของข้อมูลที่รับเข้ามา (Validation Framework) ทั้งในฝั่ง Frontend UI และ Backend APIs เพื่อความถูกต้องและความปลอดภัยสูงสุดของฐานข้อมูล

---

## 1. Frontend Validation (Vue 3 + Quasar)

การทำตรวจสอบข้อมูลในระดับหน้าจอของผู้ใช้ (Client-Side Check) เพื่อมอบประสบการณ์ที่ดีแก่ผู้ใช้ (UX) ไม่ต้องกดยืนยันแล้วรอข้อผิดพลาดจากเซิร์ฟเวอร์ย้อนกลับมา

- **Inline Rules:** ใช้คุณสมบัติ `:rules` ของ Quasar components (เช่น `q-input`, `q-select`)
- **แยก Validation Logic:** ไม่ใส่ฟังก์ชันเช็คซับซ้อนในเทมเพลต แต่ให้แยกออกเป็น Helper functions

### 🛠️ ตัวอย่างการเขียนอินพุตและการกำหนด Rule
```html
<template>
  <q-form ref="myForm" @submit="onSubmit">
    <!-- ฟิลด์รหัสอุปกรณ์ (บังคับกรอก และต้องไม่ต่ำกว่า 3 ตัวอักษร) -->
    <q-input
      v-model="form.equipmentCode"
      label="Equipment Code"
      :rules="[
        val => !!val || 'Equipment Code is required',
        val => val.length >= 3 || 'Must be at least 3 characters'
      ]"
      outlined
      dense
    />

    <!-- ฟิลด์ความละเอียดเครื่องมือ (ต้องเป็นตัวเลขเชิงบวกเท่านั้น) -->
    <q-input
      v-model.number="form.resolution"
      type="number"
      label="Resolution"
      :rules="[
        val => val !== null && val !== undefined || 'Resolution is required',
        val => val > 0 || 'Must be greater than zero'
      ]"
      outlined
      dense
    />

    <q-btn type="submit" color="primary" label="Submit" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Notify } from 'quasar';

const myForm = ref<any>(null);
const form = ref({
  equipmentCode: '',
  resolution: 0.1
});

async function onSubmit() {
  const success = await myForm.value.validate();
  if (success) {
    Notify.create({ type: 'positive', message: 'Form is valid!' });
  } else {
    Notify.create({ type: 'negative', message: 'Please correct validation errors' });
  }
}
</script>
```

---

## 2. Backend Validation (NestJS + class-validator)

เป็นการรับประกันความปลอดภัยของระบบฐานข้อมูลอย่างแท้จริง โดยห้ามปล่อยให้ Payload ที่ไม่ได้มาตรฐาน บันทึกข้อมูลหรือไปเรียกใช้ใน Logic เด็ดขาด

- **DTO Definition:** ทุก ๆ POST, PUT, PATCH จะต้องมี DTO มารองรับ
- **Validation decorators:** ใช้ `@IsNotEmpty()`, `@IsString()`, `@IsNumber()`, และตัวอื่น ๆ จาก `class-validator`

### 🛠️ ตัวอย่างการเขียน DTO ฝั่ง Backend
```typescript
// cal_backend/src/equipment/dto/create-equipment.dto.ts
import { IsString, IsNotEmpty, MinLength, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  equipmentCode: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.0001)
  resolution: number;
}
```
