# Pagination Convention

มาตรฐานการจัดหน้าและดึงข้อมูลแบบแบ่งหน้า (Server-side Pagination) สำหรับข้อมูลขนาดใหญ่ทั้งฝั่ง Frontend และ Backend

---

## 1. Backend Standard (NestJS)

ในการดึงข้อมูลแบบแบ่งหน้า ให้ใช้ DTO และจัดรูปแบบ API Response ดังนี้:

### 📥 Pagination Request DTO (`PaginationQueryDto`)
```typescript
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
```

### 📤 Paginated Response Format
ข้อมูลส่งออกกลับไปหา Client จะต้องห่อหุ้มในรูปแบบ JSON ที่มี Metadata เสมอ:
```json
{
  "data": [
    // รายการข้อมูล (Array of entities)
  ],
  "meta": {
    "totalItems": 125,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 13,
    "currentPage": 1
  }
}
```

---

## 2. Frontend Standard (Vue 3 + Quasar `q-table`)

การเชื่อมต่อ Pagination กับ `q-table` ในฝั่ง Frontend:

### 🛠️ โครงสร้างเทมเพลตและการจัดการคำร้องขอ (Request Event)

```html
<template>
  <q-table
    v-model:pagination="pagination"
    :rows="rows"
    :columns="columns"
    :loading="loading"
    row-key="id"
    binary-state-sort
    @request="onRequest"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEquipmentStore } from 'src/stores/equipment';

const equipmentStore = useEquipmentStore();
const rows = ref([]);
const loading = ref(false);
const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0 // จำนวนข้อมูลทั้งหมดที่ดึงมาจาก Server (totalItems)
});

// ฟังก์ชันดึงข้อมูลจาก API
async function onRequest(props: any) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  loading.value = true;

  try {
    const result = await equipmentStore.fetchPaginated({
      page,
      limit: rowsPerPage,
      sortBy,
      sortOrder: descending ? 'DESC' : 'ASC'
    });

    rows.value = result.data;
    pagination.value.page = result.meta.currentPage;
    pagination.value.rowsPerPage = result.meta.itemsPerPage;
    pagination.value.rowsNumber = result.meta.totalItems;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  } catch (error) {
    console.error('Failed to load data', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  onRequest({ pagination: pagination.value });
});
</script>
```
