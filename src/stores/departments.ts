import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SectionService, type Section } from 'src/services/tool.service';
import { useAuthStore } from './auth';

export type Department = Section;

export const useDepartmentsStore = defineStore('departments', () => {
  const departments = ref<Department[]>([]);
  const searchQuery = ref('');
  const authStore = useAuthStore();

  const filteredDepartments = computed(() => {
    return departments.value.filter((d) => {
      const q = searchQuery.value.toLowerCase();
      if (!q) return true;
      return (
        d.id.toString().includes(q) ||
        (d.code && d.code.toLowerCase().includes(q)) ||
        d.name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
      );
    });
  });

  async function fetchDepartments() {
    console.log('[DEBUG] store: fetchDepartments called');
    const hospitalId = authStore.user?.hospitalId;
    console.log('[DEBUG] store: hospitalId is', hospitalId);
    try {
      let res;
      if (hospitalId) {
        console.log('[DEBUG] store: calling getByHospital');
        res = await SectionService.getByHospital(hospitalId);
      } else {
        console.log('[DEBUG] store: calling getAll');
        res = await SectionService.getAll();
      }
      console.log('[DEBUG] store: API response', res.data);
      departments.value = res.data;
    } catch (e) {
      console.error('[DEBUG] fetchDepartments error:', e);
      departments.value = [];
    }
  }

  async function addDepartment(dept: Omit<Department, 'id' | 'hospitalId'>) {
    let hospitalId = authStore.user?.hospitalId;

    // Fallback for global admin: use hospitalId 1 if not set
    if (!hospitalId) {
      hospitalId = 1;
    }

    try {
      await SectionService.create({
        ...dept,
        hospitalId,
      });
      await fetchDepartments();
    } catch (e) {
      console.error('addDepartment error:', e);
    }
  }

  async function updateDepartment(id: number, data: Omit<Department, 'id' | 'hospitalId'>) {
    try {
      await SectionService.update(id, data);
      await fetchDepartments();
    } catch (e) {
      console.error('updateDepartment error:', e);
    }
  }

  async function deleteDepartment(id: number) {
    try {
      await SectionService.remove(id);
      await fetchDepartments();
    } catch (e) {
      console.error('deleteDepartment error:', e);
    }
  }

  return {
    departments,
    searchQuery,
    filteredDepartments,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
});
