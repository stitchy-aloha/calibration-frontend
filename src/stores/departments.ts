import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Department {
  id: number;
  code: string; // ชื่อย่อหน่วยงาน
  name: string; // ชื่อหน่วยงาน
}

const mockDepartments: Department[] = [
  { id: 1, code: 'NUR', name: 'กลุ่มงานการพยาบาล' },
  { id: 2, code: 'PHA', name: 'กลุ่มงานเภสัชกรรม' },
  { id: 3, code: 'DEN', name: 'กลุ่มงานทันตกรรม' },
  { id: 4, code: 'EYE', name: 'กลุ่มงานจักษุวิทยา' },
  { id: 5, code: 'LAB', name: 'กลุ่มงานพยาธิวิทยาคลินิก' },
  { id: 6, code: 'SMD', name: 'กลุ่มงานเวชกรรมสังคม' },
  { id: 7, code: 'COH', name: 'งานรักษาพยาบาลชุมชน' },
  { id: 8, code: 'HPP', name: 'งานส่งเสริมป้องกันและควบคุมโรค' },
  { id: 9, code: 'OHM', name: 'กลุ่มงานอาชีวะเวชกรรม' },
  { id: 10, code: 'PSY', name: 'กลุ่มงานจิตเวช' },
  { id: 11, code: 'RAD', name: 'กลุ่มงานรังสีวิทยา' },
  { id: 12, code: 'ELT', name: 'งานไฟฟ้า' },
  { id: 13, code: 'ANC', name: 'งานฝากครรภ์และวางแผนครอบครัว' },
  { id: 14, code: 'LRO', name: 'งานห้องคลอด' },
  { id: 15, code: 'PPR', name: 'งานหลังคลอด' },
];

export const useDepartmentsStore = defineStore('departments', () => {
  const departments = ref<Department[]>(mockDepartments);
  const searchQuery = ref('');

  const filteredDepartments = computed(() => {
    return departments.value.filter((d) => {
      const q = searchQuery.value.toLowerCase();
      if (!q) return true;
      return (
        d.id.toString().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q)
      );
    });
  });

  const nextId = computed(() => {
    if (departments.value.length === 0) return 1;
    const maxId = Math.max(...departments.value.map((d) => d.id));
    return maxId + 1;
  });

  function addDepartment(dept: Omit<Department, 'id'>) {
    departments.value.push({
      ...dept,
      id: nextId.value,
    });
  }

  function updateDepartment(id: number, data: Omit<Department, 'id'>) {
    const idx = departments.value.findIndex((d) => d.id === id);
    if (idx !== -1) {
      departments.value[idx] = { ...data, id };
    }
  }

  function deleteDepartment(id: number) {
    departments.value = departments.value.filter((d) => d.id !== id);
  }

  return {
    departments,
    searchQuery,
    filteredDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
});
