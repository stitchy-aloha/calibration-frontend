import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { HospitalService } from 'src/services/hospital.service';
import type { Hospital } from 'src/services/tool.service';

export const useHospitalsStore = defineStore('hospitals', () => {
  const hospitals = ref<Hospital[]>([]);
  const searchQuery = ref('');

  const filteredHospitals = computed(() => {
    return hospitals.value.filter((h) => {
      const q = searchQuery.value.toLowerCase();
      if (!q) return true;
      return (
        h.id.toString().includes(q) ||
        (h.code && h.code.toLowerCase().includes(q)) ||
        h.name.toLowerCase().includes(q) ||
        (h.province && h.province.toLowerCase().includes(q)) ||
        (h.district && h.district.toLowerCase().includes(q))
      );
    });
  });

  async function fetchHospitals() {
    try {
      const res = await HospitalService.getAll();
      hospitals.value = res.data;
    } catch (e) {
      console.error('fetchHospitals error:', e);
      hospitals.value = [];
    }
  }

  async function addHospital(data: FormData) {
    try {
      await HospitalService.create(data);
      await fetchHospitals();
    } catch (e) {
      console.error('addHospital error:', e);
    }
  }

  async function updateHospital(id: number, data: FormData) {
    try {
      await HospitalService.update(id, data);
      await fetchHospitals();
    } catch (e) {
      console.error('updateHospital error:', e);
    }
  }

  async function deleteHospital(id: number) {
    try {
      await HospitalService.remove(id);
      await fetchHospitals();
    } catch (e) {
      console.error('deleteHospital error:', e);
    }
  }

  return {
    hospitals,
    searchQuery,
    filteredHospitals,
    fetchHospitals,
    addHospital,
    updateHospital,
    deleteHospital,
  };
});
