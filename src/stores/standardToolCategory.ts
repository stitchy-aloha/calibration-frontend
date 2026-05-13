import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StandardToolService } from '../services/standard-tool.service';

export interface StandardToolCategory {
  id: number;
  name: string;
}

export const useStandardToolCategoryStore = defineStore('standardToolCategory', () => {
  const categories = ref<StandardToolCategory[]>([]);
  const loading = ref(false);

  async function fetchCategories() {
    loading.value = true;
    try {
      const res = await StandardToolService.getCategories();
      categories.value = res.data;
    } catch (error) {
      console.error('fetchCategories error:', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    loading,
    fetchCategories,
  };
});
