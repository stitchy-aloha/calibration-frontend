import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface EquipmentDetails {
  id: string;
  name: string;
  company: string;
  model: string;
  serialNumber: string;
  code: string;
  riskLevel: string;
  type: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
}

export interface LocationDetails {
  department: string;
  hospital: string;
  district: string;
  province: string;
}

export interface EnvironmentDetails {
  temperature: number | null;
  humidity: number | null;
}

export interface StandardEquipment {
  id: string;
  type: string;
  name: string;
  company: string;
  serialNumber: string;
  unit: string;
  lastCalibrationDate: string;
  certificateNumber: string;
}

export interface TestResultItem {
  id: string;
  parameter: string;
  standardValue: number | null;
  val1: number | null;
  val2: number | null;
  val3: number | null;
}

export const useCalibrationRecordStore = defineStore('calibrationRecord', () => {
  const loading = ref(false);
  const activeTab = ref('general');

  const equipmentDetails = ref<EquipmentDetails>({
    id: '',
    name: '',
    company: '',
    model: '',
    serialNumber: '',
    code: '',
    riskLevel: '',
    type: '',
    calibrationCycle: '',
    lastCalibrationDate: '',
    nextCalibrationDate: '',
  });

  const locationDetails = ref<LocationDetails>({
    department: '',
    hospital: '',
    district: '',
    province: '',
  });

  const environment = ref<EnvironmentDetails>({
    temperature: null,
    humidity: null,
  });

  const standardEquipments = ref<StandardEquipment[]>([]);

  // Mock fetching data based on ID
  const fetchCalibrationRecord = async (id: string) => {
    loading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data based on the UI provided
      equipmentDetails.value = {
        id,
        name: 'Patient Monitor',
        company: 'FLUKE',
        model: 'ProSim4',
        serialNumber: '5481017',
        code: 'BME-002',
        riskLevel: 'สูง',
        type: 'Medical',
        calibrationCycle: '6 เดือน',
        lastCalibrationDate: '26 มิถุนายน 2568',
        nextCalibrationDate: '28 ธันวาคม 2568',
      };

      locationDetails.value = {
        department: 'NUR - กลุ่มงานการพยาบาล',
        hospital: 'โรงพยาบาลส่งเสริมสุขภาพตำบล',
        district: 'บางสะพาน',
        province: 'ประจวบคีรีขันธ์',
      };

      standardEquipments.value = [
        {
          id: '1',
          type: 'Patient BP / EKG',
          name: 'ProSim4',
          company: 'FLUKE',
          serialNumber: 'S35684',
          unit: 'mmHg',
          lastCalibrationDate: '1 มิถุนายน 2566',
          certificateNumber: 'PC-EVT-6587',
        },
        {
          id: '2',
          type: 'SPOT Light',
          name: 'SPOT Light',
          company: 'FLUKE',
          serialNumber: 'S34494',
          unit: 'Pulse/Minute',
          lastCalibrationDate: '1 มิถุนายน 2566',
          certificateNumber: 'PC-EVT-6587',
        },
      ];

      environment.value = {
        temperature: 24.5,
        humidity: 42,
      };
    } catch (error) {
      console.error('Failed to fetch calibration record', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    activeTab,
    equipmentDetails,
    locationDetails,
    environment,
    standardEquipments,
    fetchCalibrationRecord,
  };
});
