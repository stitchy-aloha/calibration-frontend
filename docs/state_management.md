# State Management Convention (Pinia)

มาตรฐานการจัดการและเข้าถึงสถานะข้อมูลของแอปพลิเคชัน (Global State Management) โดยใช้ Pinia v3 ในแอปพลิเคชัน Vue 3 + Quasar

---

## 1. การกำหนดโครงสร้างของ Store (Setup Syntax)

เรากำหนดให้ใช้ **Composition Store Syntax** (`ref` เป็น state, `computed` เป็น getters, และ `function` เป็น actions) เสมอ เพื่อความสม่ำเสมอในการเขียนร่วมกับหน้าเพจ Vue 3

### 🛠️ โครงสร้างเทมเพลตมาตรฐานสำหรับ Store
```typescript
// src/stores/equipment.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';

export const useEquipmentStore = defineStore('equipment', () => {
  // ==========================================
  // 1. State (ใช้ ref)
  // ==========================================
  const currentEquipment = ref<any>(null);
  const loading = ref(false);

  // ==========================================
  // 2. Getters (ใช้ computed)
  // ==========================================
  const isExpired = computed(() => {
    if (!currentEquipment.value) return false;
    return new Date(currentEquipment.value.calibrationDueDate) < new Date();
  });

  // ==========================================
  // 3. Actions (ใช้ function ปกติ)
  // ==========================================
  async function getEquipmentById(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/equipment/${id}`);
      currentEquipment.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  // Action บังคับสำหรับล้างข้อมูลเก่า
  function reset() {
    currentEquipment.value = null;
    loading.value = false;
  }

  return {
    currentEquipment,
    loading,
    isExpired,
    getEquipmentById,
    reset
  };
});
```

---

## 2. กฎเหล็กในการจัดการ State (State Lifecycles)

> [!IMPORTANT]
> **การล้างข้อมูลค้างหน้า (Reset State) เพื่อป้องกัน Stale Cache:**
> เมื่อมีการเปลี่ยนหน้าผ่าน router หรือมีการ Logout ค่าต่าง ๆ ที่เคยดึงมาและเก็บไว้ใน Pinia Store (เช่น รายละเอียดของแถวที่ผู้ใช้กดเลือก หรือ รายงานที่อยู่ระหว่างการประมวลผล) อาจจะค้างอยู่ใน Memory
> 
> **สิ่งที่ต้องปฏิบัติ:**
> - ทุก ๆ Store ที่ใช้เก็บข้อมูลแบบเจาะจงรายหน้า (Page-specific details) จะต้องเขียนฟังก์ชัน `reset()` เสมอ
> - เรียกใช้ `reset()` ใน `onUnmounted` ของคอมโพเนนต์ หรือเรียกใช้ใน Vue Router Navigation Guard เมื่อย้ายออกจากเส้นทางเดิม เพื่อป้องกันบั๊กข้อมูลเก่าค้างแสดงบนหน้ารายละเอียดใหม่
