<template>
  <div class="cer-wrapper">
    <div class="cer-page a4-size">
      <!-- ===== HEADER ===== -->
      <div class="cer-header">
        <div class="header-logo-area">
          <img
            :src="getImageUrl(data.hospital?.logoUrl) || 'public/image/logo.png'"
            alt="Hospital Logo"
            class="hospital-logo"
          />
          <div class="hospital-info">
            <div class="hospital-name">{{ data.hospital?.name || 'Hospital Name' }}</div>
            <div class="hospital-address">
              {{ data.hospital?.address || '' }}
              {{ data.hospital?.district || '' }} {{ data.hospital?.province || '' }}
            </div>
          </div>
        </div>
      </div>
      <div class="header-divider"></div>
      <div class="header-cert-no">
        <span class="cert-no-label">Cert. No. :</span>
        <span class="cert-no-value">{{ data.certNo }}</span>
      </div>

      <!-- ===== TITLE ===== -->
      <div class="cer-title-row">
        <div class="cer-title">Certificate of Testing</div>
      </div>

      <!-- ===== INFO GRID ===== -->
      <div class="cer-info-grid">
        <!-- Left Column -->
        <div class="info-col">
          <div class="info-row">
            <span class="info-label">Detail :</span>
            <span class="info-value">{{ data.detail }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Manufacture :</span>
            <span class="info-value">{{ data.manufacture }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Model :</span>
            <span class="info-value">{{ data.model }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">S/N :</span>
            <span class="info-value">{{ data.serialNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ID No. :</span>
            <span class="info-value">{{ data.idNo }}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="info-divider"></div>

        <!-- Right Column -->
        <div class="info-col right-col">
          <div class="info-row">
            <span class="info-label">Departments :</span>
            <span class="info-value">{{ data.department }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address :</span>
            <span class="info-value">{{ data.address }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Section :</span>
            <span class="info-value">{{ data.section }}</span>
          </div>
          <div class="info-row env-row">
            <div class="env-item">
              <span class="info-label">Temperature :</span>
              <span class="info-value">{{ data.temperature }} &plusmn; 2&deg;C</span>
            </div>
            <div class="env-item">
              <span class="info-label">Humidity :</span>
              <span class="info-value">{{ data.humidity }} &plusmn; 5% R.H.</span>
            </div>
          </div>
          <div class="info-row date-row">
            <div class="date-item">
              <span class="info-label">Cal. Date:</span>
              <span class="info-value info-value--bold">{{ data.calDate }}</span>
            </div>
            <div class="date-item">
              <span class="info-label">Appr. Date:</span>
              <span class="info-value info-value--bold">{{ data.apprDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== SPECIFICATIONS (Specific Parameters) ===== -->
      <div
        v-if="specificParameters && specificParameters.length > 0"
        class="cer-specs-grid q-mb-md"
      >
        <div class="row q-col-gutter-sm">
          <div v-for="(param, idx) in specificParameters" :key="idx" class="col-3">
            <div class="spec-box text-center">
              <div class="spec-label">{{ param.name }}</div>
              <div class="spec-value">
                {{ param.value || '-' }} <span class="spec-unit">{{ param.unit || '' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="cer-body">
        <!-- Reading Table -->
        <table class="reading-table">
          <tbody>
            <template v-if="groupedMeasurements.length > 0">
              <template v-for="(group, gIdx) in groupedMeasurements" :key="gIdx">
                <!-- Parameter Header Row -->
                <tr class="param-header-row">
                  <td class="text-left label-col param-title">
                    <u>{{ group.parameter_name }}</u>
                  </td>
                  <td class="text-weight-bold">{{ getCol2Header(group) }}</td>
                  <td class="text-weight-bold">{{ getCol3Header(group) }}</td>
                  <td class="text-weight-bold">Error ({{ group.unit }})</td>
                  <td class="text-weight-bold">Uncertaintry (± {{ group.unit }})</td>
                  <td class="text-weight-bold">MPE (± {{ group.unit }})</td>
                </tr>
                <!-- Parameter Data Rows -->
                <tr v-for="(m, mIdx) in group.rows" :key="mIdx" class="param-data-row">
                  <td class="text-left"></td>
                  <td>{{ formatValue(m.standard_value) }}</td>
                  <td class="text-weight-bold">{{ formatValue(m.average_value) }}</td>
                  <td>{{ formatValue(m.error_value) }}</td>
                  <td>{{ formatValue(group.uncertainty) }}</td>
                  <td>{{ formatValue(group.mpe) }}</td>
                </tr>
              </template>
            </template>
            <template v-else>
              <tr>
                <td colspan="6" class="text-center text-grey-6 q-py-md">ไม่มีข้อมูลการสอบเทียบ</td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- Alarms Row (Only for ECG/Patient Monitor items) -->
        <div class="alarms-row" v-if="alarms">
          <div class="alarm-item">I : {{ alarms.I }}</div>
          <div class="alarm-item">II : {{ alarms.II }}</div>
          <div class="alarm-item">III : {{ alarms.III }}</div>
          <div class="alarm-item">AVR : {{ alarms.AVR }}</div>
          <div class="alarm-item">AVL : {{ alarms.AVL }}</div>
          <div class="alarm-item">AVF : {{ alarms.AVF }}</div>
          <div class="alarm-item">Alarm : {{ alarms.Alarm }}</div>
          <div class="alarm-item">1mV : {{ alarms.oneMV }}</div>
        </div>

        <!-- Calibration Standard Used -->
        <div class="cal-standard">
          <div class="cal-standard-title">Calibration Standard Used</div>
          <table class="standard-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Manufacture</th>
                <th>Model</th>
                <th>Serial No.</th>
                <th>Certification No.</th>
                <th>Cal date</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="standards && standards.length > 0">
                <tr v-for="(std, idx) in standards" :key="idx">
                  <td>{{ std.name }}</td>
                  <td class="text-italic">{{ std.manufacture }}</td>
                  <td class="text-italic">{{ std.model }}</td>
                  <td>{{ std.sn }}</td>
                  <td class="text-italic">{{ std.certNo }}</td>
                  <td>{{ std.calDate }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="6" class="text-center text-grey-6 q-py-md">ไม่มีข้อมูลเครื่องมือมาตรฐานที่ใช้</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="method-desc">
            <span class="bold-th">วิธีทดสอบ :</span>
            <div class="desc-content">
              <div>
                โดยการวัดเทียบกับเครื่องสร้างสัญญาณมาตรฐาน โดยการกำหนดค่าแรงดัน,
                อัตราการเต้นของหัวใจ อ่านค่าและจดบันทึก
              </div>
              <div>
                โดยการนำเครื่องมือที่ต้องการทดสอบต่อเข้ากับเครื่องสร้างสัญญาณแล้วกำหนดค่า % และ ECG
                อ่านผลและจดบันทึก
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FOOTER & SIGNATURE ===== -->
      <div class="cer-bottom">
        <div class="cal-signatures">
          <!-- Calibration by (Technician) -->
          <div class="signature-box">
            <div class="sig-label">Calibration by :</div>
            <div class="signature-wrapper">
              <div v-if="technician?.signatureUrl" class="signature-img">
                <img :src="getImageUrl(technician.signatureUrl)" alt="Technician Signature" />
              </div>
              <div v-else class="signature-placeholder"></div>
              <div class="dots-line">....................................................</div>
            </div>
            <div class="sig-name">
              ( {{ technician?.name || '..............................' }} )
            </div>
            <div class="sig-title">{{ technician?.position || '' }}</div>
          </div>
          <!-- Approved by (Approver) -->
          <div class="signature-box">
            <div class="sig-label">Approved by :</div>
            <div class="signature-wrapper">
              <div v-if="approver?.signatureUrl" class="signature-img">
                <img :src="getImageUrl(approver.signatureUrl)" alt="Approver Signature" />
              </div>
              <div v-else class="signature-placeholder"></div>
              <div class="dots-line">....................................................</div>
            </div>
            <div class="sig-name">( {{ approver?.name || '..............................' }} )</div>
            <div class="sig-title">{{ approver?.position || '' }}</div>
          </div>
        </div>

        <div class="claim-note">
          <span class="underline">Comment:</span> This report certifies the testing results as of
          the date, the location and the conditions of testing only.
        </div>

        <div class="cer-footer">
          {{ data.hospital?.name || '' }}
          {{ data.hospital?.address || '' }}
          {{ data.hospital?.district || '' }} {{ data.hospital?.province || '' }}
          {{ data.hospital?.zipCode || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || '';

function getImageUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${apiBase}${path}`;
}
interface ReadingItem {
  std: string;
  uuc: string;
  error: string;
  accept: string;
}

interface StandardItem {
  name: string;
  manufacture: string;
  model: string;
  sn: string;
  calDate: string;
  certNo: string;
}

export interface MeasurementApi {
  id: number;
  parameter_name: string;
  range: number;
  standard_value: number;
  reading_1: number;
  reading_2: number;
  reading_3: number;
  average_value: number;
  error_value: number;
  result: 'PASS' | 'FAIL';
  display_type?: string;
  resolution?: string;

  std_type?: string;
  data?: Record<string, unknown>;
}

export interface SpecificParameterApi {
  id: number;
  name: string;
  value: string | null;
  unit: string | null;
  task_id: number;
}

export interface CerCalibrationData {
  certNo: string;
  detail: string;
  manufacture: string;
  model: string;
  serialNo: string;
  idNo: string;
  department: string;
  address: string;
  section: string;
  temperature: string;
  humidity: string;
  calDate: string;
  apprDate: string;
  hospital?: {
    name: string;
    logoUrl?: string | undefined;
    address?: string | undefined;
    district?: string | undefined;
    province?: string | undefined;
    zipCode?: string | undefined;
  } | null;
}

export interface CalibrationSettingItem {
  id?: number;
  equipment_name?: string;
  type?: string;
  parameter_name?: string;
  unit?: string;
  tolerance?: string;
  std_type?: string;
  display_type?: string;
  resolution?: string;
}

interface Props {
  data?: CerCalibrationData;
  specificParameters?: SpecificParameterApi[];
  measurements?: MeasurementApi[];
  technician?: {
    name: string;
    position?: string;
    signatureUrl?: string | null | undefined;
  } | null;
  approver?: {
    name: string;
    position?: string;
    signatureUrl?: string | null | undefined;
  } | null;
  readings?: {
    systolic: ReadingItem;
    diastolic: ReadingItem;
    temperature: ReadingItem;
    heartRate: ReadingItem;
    spo2: ReadingItem;
  };
  alarms?:
    | {
        I: string;
        II: string;
        III: string;
        AVR: string;
        AVL: string;
        AVF: string;
        Alarm: string;
        oneMV: string;
      }
    | undefined;
  standards?: StandardItem[] | undefined;
  settings?: CalibrationSettingItem[];
}

const props = withDefaults(defineProps<Props>(), {
  measurements: () => [],
  settings: () => [],
  data: () => ({
    certNo: 'CAL-001',
    detail: 'PATIENT MONITOR',
    manufacture: 'MINDRAY',
    model: 'SV300',
    serialNo: '58645',
    idNo: '223',
    department: 'โรงพยาบาลส่งเสริมสุขภาพตำบล',
    address: 'อำเภอบางสะพาน จังหวัดประจวบคีรีขันธ์',
    section: 'NUR - กลุ่มงานการพยาบาล',
    temperature: '23',
    humidity: '60',
    calDate: 'Thursday, February 1',
    apprDate: 'Thursday, February 1',
    hospital: {
      name: 'Bang Saphan Hospital',
      logoUrl: 'public/image/logo.png',
      address: 'Kamnoet Nopphakhun , Bang Saphan',
      district: 'Bang Saphan',
      province: 'Prachuap Khiri Khan',
      zipCode: '77140',
    },
  }),
  readings: () => ({
    systolic: { std: '140.0', uuc: '139.67', error: '-0.33', accept: '+/- 8.00' },
    diastolic: { std: '90.0', uuc: '90.00', error: '0.00', accept: '+/- 8.00' },
    temperature: { std: '36.0', uuc: '36.17', error: '0.17', accept: '+/- 1.00' },
    heartRate: { std: '90.0', uuc: '90.33', error: '0.33', accept: '+/- 2.00' },
    spo2: { std: '98.0', uuc: '98.50', error: '0.50', accept: '+/- 2.00' },
  }),
  standards: () => [
    {
      name: 'Vital Signs Simulator',
      manufacture: 'FLUKE',
      model: 'ProSim4',
      sn: '3891030',
      calDate: '01-Jun-1474',
      certNo: 'PC-EVT-65B7',
    },
    {
      name: 'Pulse Oximeter Calibrator',
      manufacture: 'FLUKE',
      model: 'SPOT Light',
      sn: '3891030',
      calDate: '01-Jun-1474',
      certNo: 'DTMEVTPC4603',
    },
  ],
});

interface GroupedParameter {
  parameter_name: string;
  unit: string;
  std_type: string;
  uncertainty: string;
  mpe: string;
  rows: MeasurementApi[];
}

const groupedMeasurements = computed((): GroupedParameter[] => {
  if (!props.measurements) return [];
  const groups: Record<string, MeasurementApi[]> = {};

  props.measurements.forEach((m) => {
    if (!m || !m.parameter_name) return;
    const name = m.parameter_name;
    if (!groups[name]) groups[name] = [];
    groups[name].push(m);
  });

  return Object.keys(groups).map((name) => {
    const items = groups[name] || [];
    const first = items[0];

    // Find matching setting to get unit, tolerance (MPE), and resolution (uncertainty)
    const setting = props.settings?.find((s: CalibrationSettingItem) => s.parameter_name === name);

    const unit = setting?.unit || UNIT_MAP[name] || '';
    const mpe = setting?.tolerance || first?.range?.toString() || '1.0';
    const uncertainty = setting?.resolution || first?.resolution || '0.1';

    const parsedRows = items.map((item) => {
      const getVal = (key: string): unknown => {
        const d = item.data;
        if (d && typeof d === 'object' && key in d) {
          return d[key];
        }
        return (item as unknown as Record<string, unknown>)[key];
      };

      return {
        ...item,
        standard_value: getVal('standard_value'),
        average_value: getVal('average_value'),
        error_value: getVal('error_value'),
      } as unknown as MeasurementApi;
    });

    return {
      parameter_name: name,
      unit,
      std_type: first?.std_type || '',
      uncertainty,
      mpe,
      rows: parsedRows,
    };
  });
});

const getCol2Header = (group: GroupedParameter) => {
  const isUut = group.std_type?.includes('2') && group.std_type?.includes('UUT');
  const label = isUut ? 'UUC Setting' : 'STD Setting';
  return group.unit ? `${label} (${group.unit})` : label;
};

const getCol3Header = (group: GroupedParameter) => {
  const isUut = group.std_type?.includes('2') && group.std_type?.includes('UUT');
  const label = isUut ? 'STD Reading' : 'UUC Reading';
  return group.unit ? `${label} (${group.unit})` : label;
};

const formatValue = (val: unknown) => {
  if (val === null || val === undefined || val === '') return '-';
  const num = Number(val);
  if (!isNaN(num)) return num.toFixed(2);
  return typeof val === 'string' || typeof val === 'number' ? String(val) : '-';
};

const UNIT_MAP: Record<string, string> = {
  'Systolic Pressure': 'mmHg',
  'Diastolic Pressure': 'mmHg',
  Temperature: 'Celsius',
  'Heart Rate': 'Pulse/min',
  SpO2: '%',
  'Flow Rate': 'mL/h',
  Volume: 'mL',
};
</script>

<style scoped lang="scss">
/* ===== Wrapper ===== */
.cer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f0;
  padding: 0;
  min-height: auto;
}

/* ===== A4 Page ===== */
.a4-size {
  width: 210mm;
  height: 297mm;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  position: relative;
  overflow: hidden;
  page-break-before: always;
  page-break-after: avoid;
}

.cer-page {
  font-family: 'Sarabun', 'TH Sarabun New', 'Arial', sans-serif;
  font-size: 11pt;
  color: #000;
  padding: 8mm 10mm 6mm 10mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* ===== HEADER ===== */
.cer-header {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
}

.header-divider {
  border-bottom: 3px solid #000;
  margin-bottom: 6px;
}

.header-logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hospital-logo {
  width: 54px;
  height: 54px;
  object-fit: contain;
  border: 2px solid #000;
  border-radius: 50%;
  padding: 2px;
}

.hospital-name {
  font-size: 15pt;
  font-weight: 700;
  color: #000;
  line-height: 1.3;
}
.hospital-address {
  font-size: 10pt;
  color: #000;
  font-style: italic;
}

.header-page-info {
  font-size: 9pt;
  align-self: flex-start;
  margin-top: 5px;
}

.header-cert-no {
  text-align: right;
  font-size: 10pt;
  color: #000;
  .cert-no-label {
    font-weight: 600;
  }
  .cert-no-value {
    margin-left: 4px;
  }
}

/* ===== TITLE ===== */
.cer-title-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12px;
  margin: 4px 0 6px;
}

.cer-title {
  font-size: 16pt;
  font-weight: 700;
  color: #000;
  text-align: center;
}

/* ===== INFO GRID ===== */
.cer-info-grid {
  display: flex;
  gap: 0;
  margin-bottom: 8px;
  border-radius: 2px;
  border-bottom: 1px solid #ccc;
}

.info-col {
  flex: 1;
  padding: 5px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-divider {
  width: 1px;
  background: #ccc;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 9.5pt;
}

.info-label {
  color: #444;
  min-width: 90px;
  flex-shrink: 0;
}

.info-value {
  color: #000;
  flex: 1;
}

.right-col {
  .info-label {
    min-width: 80px;
  }
}

.env-row,
.date-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.env-item,
.date-item {
  display: flex;
  gap: 4px;
}

.info-value--bold {
  font-weight: 700;
}

/* ===== MAIN CONTENT ===== */
.cer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reading-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 9pt;
  border-bottom: 2px solid #002d62;
}

.reading-table th {
  border-top: 2px solid #002d62;
  border-bottom: 2px solid #002d62;
  padding: 5px 4px;
  font-weight: 600;
}

.reading-table td {
  padding: 4px 4px;
}

.param-header-row td {
  border-top: 2px solid #002d62;
  border-bottom: 2px solid #002d62;
  padding: 5px 4px;
  color: #002d62;
}

.param-title {
  font-size: 9.5pt;
  font-weight: 700;
  color: #002d62;
  text-decoration: underline;
}

.param-data-row td {
  border-bottom: none;
  font-size: 8.5pt;
}

.reading-table .label-col {
  font-weight: 600;
}

.w-25 {
  width: 25%;
}

.text-left {
  text-align: left;
}

/* ===== ALARMS ROW ===== */
.alarms-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1.5px solid #ccc;
  padding: 3px 8px;
  font-size: 9pt;
  font-weight: 600;
}

.alarm-item {
  color: #000;
}

/* ===== CAL STANDARD ===== */
.cal-standard {
  margin-top: 6px;
}

.cal-standard-title {
  font-weight: 700;
  font-size: 9.5pt;
  margin-bottom: 3px;
}

.standard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 8.5pt;
  margin-bottom: 6px;
  border: 1px solid #000;
}

.standard-table th,
.standard-table td {
  border: 1px solid #000;
  padding: 3px;
}

.standard-table th {
  font-weight: 600;
}

.text-italic {
  font-style: italic;
}

.method-desc {
  display: flex;
  gap: 8px;
  font-size: 8.5pt;
  line-height: 1.3;
}

.bold-th {
  font-weight: 700;
  white-space: nowrap;
}

/* ===== BOTTOM ===== */
.cer-bottom {
  margin-top: auto;
}

.cal-signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  margin-bottom: 12px;
  padding: 0 40px;
}

.signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 9.5pt;
  gap: 5px;
}

.sig-label {
  align-self: flex-start;
  margin-bottom: 6px;
}

.sig-line {
  color: #000;
}

.signature-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
}

.signature-img {
  height: 40px;
  margin-bottom: -12px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  img {
    max-height: 100%;
    object-fit: contain;
  }
}

.signature-placeholder {
  height: 25px;
  visibility: hidden;
}

.dots-line {
  font-size: 9.5pt;
  position: relative;
  z-index: 2;
  color: #000;
}

.sig-title {
  margin-top: 2px;
  font-weight: 600;
}

.claim-note {
  font-size: 7.8pt;
  margin-bottom: 6px;
  .underline {
    text-decoration: underline;
    font-weight: 600;
  }
}

.cer-footer {
  border-top: 2px solid #000;
  padding-top: 5px;
  font-size: 9.5pt;
  text-align: center;
  font-style: italic;
}

/* ===== PRINT ===== */
@media print {
  .cer-wrapper {
    background: none;
    padding: 0;
  }

  .a4-size {
    width: 210mm;
    height: 297mm;
    box-shadow: none;
    margin: 0;
  }
}

.cer-specs-grid {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.spec-box {
  border: 1px solid #eee;
  padding: 6px;
  border-radius: 4px;
  background: #fcfcfc;
}

.spec-label {
  font-size: 8pt;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.spec-value {
  font-size: 10pt;
  font-weight: 700;
  color: #000;
}

.spec-unit {
  font-size: 8pt;
  font-weight: 400;
  color: #888;
}
</style>
