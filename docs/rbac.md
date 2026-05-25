# Role-Based Access Control (RBAC) & Security

มาตรฐานการกำหนดสิทธิ์ในการเข้าถึงและแสดงผลส่วนประกอบ (Elements) ในระบบ โดยจำแนกตามตำแหน่งหรือหน้าที่ของผู้ใช้งาน (Roles)

---

## 1. คำนิยามของสิทธิ์ผู้ใช้งาน (System Roles)

ระบบประกอบไปด้วย 3 บทบาทหลัก ที่มีลำดับสิทธิ์ลดหลั่นกันลงมา:

1. **`Admin` (ผู้ดูแลระบบ):** เข้าถึงได้ทุกฟังก์ชัน ลบข้อมูลอัปเดตระบบ จัดการผู้ใช้รายอื่นได้
2. **`Approver` (ผู้อนุมัติ):** ตรวจสอบและลงนามรับรองใบรับรองการสอบเทียบ (Calibration Certificate) แต่แก้ไขค่าตัวตั้งค่าระบบไม่ได้
3. **`Technician` (ช่างเทคนิค):** เข้าสอบเทียบเครื่องมือ บันทึกค่าผลลัพธ์ แต่ไม่มีสิทธิ์ลงนามอนุมัติหรือลบประวัติหลักของระบบ

---

## 2. การควบคุมสิทธิ์บนหน้าเว็บ (UI Level / Client-Side)

### 2.1 Custom Composable (`useRoleAccess`)

เราใช้ Composable ในการรับมือกับการตรวจสอบความถูกต้องของสิทธิ์ผู้ใช้ เพื่อให้สามารถเรียกใช้ได้สม่ำเสมอในทุก ๆ คอมโพเนนต์:

```typescript
// src/composables/useRoleAccess.ts
import { useAuthStore } from 'src/stores/auth';

export function useRoleAccess() {
  const authStore = useAuthStore();

  // ตรวจสอบว่าผู้ใช้มีบทบาทเดี่ยว หรือบทบาทใดบทบาทหนึ่งในกลุ่มหรือไม่
  function hasRole(requiredRoles: string | string[]): boolean {
    const userRole = authStore.userRole;
    if (!userRole) return false;

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    return userRole === requiredRoles;
  }

  return {
    hasRole,
  };
}
```

### 2.2 การนำไปประยุกต์ใช้งานในเทมเพลต (Template Integration)

ซ่อน/แสดง หรือปิดการใช้งาน (Disable) ปุ่ม/ข้อมูล ตามบทบาทของผู้ใช้ปัจจุบัน:

```html
<template>
  <div class="row q-gutter-sm">
    <!-- แสดงปุ่มเฉพาะช่างเทคนิคหรือผู้ดูแลระบบที่เข้ามาดำเนินการจริง -->
    <q-btn
      v-if="hasRole(['Admin', 'Technician'])"
      color="primary"
      label="Start Calibration"
      @click="startJob"
    />

    <!-- แสดงปุ่มอนุมัติใบรับรองเฉพาะบทบาทผู้ดูแลระบบหรือผู้อนุมัติเท่านั้น -->
    <q-btn
      v-if="hasRole(['Admin', 'Approver'])"
      color="positive"
      label="Approve Certificate"
      @click="approveCert"
    />
  </div>
</template>

<script setup lang="ts">
  import { useRoleAccess } from 'src/composables/useRoleAccess';

  const { hasRole } = useRoleAccess();
</script>
```

---

## 3. ความปลอดภัยฝั่ง Backend (API Level / Server-Side)

> [!WARNING]
> การซ่อนองค์ประกอบในหน้าจอ UI เป็นเพียงความสะดวกในการใช้งานเท่านั้น (UX) **คุณต้องป้องกันการเข้าถึงข้อมูลที่ปลายทาง (API Backend) เสมอ**
>
> ห้ามให้ API เปิดสาธารณะโดยไม่มี `@Roles` และ `@UseGuards(JwtAuthGuard, RolesGuard)` คอยป้องกันหลังบ้านเด็ดขาด
