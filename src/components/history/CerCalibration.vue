<template>
  <div class="cer-wrapper">
    <div class="cer-page a4-size">
      <!-- ===== HEADER ===== -->
      <div class="cer-header">
        <div class="header-logo-area">
          <img src="public/image/logo.png" alt="Hospital Logo" class="hospital-logo" />
          <div class="hospital-info">
            <div class="hospital-name">Bang Saphan Hospital</div>
            <div class="hospital-address">
              Kamnoet Nopphakhun , Bang Saphan , Prachuap Khiri Khan
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
      <div v-if="specificParameters && specificParameters.length > 0" class="cer-specs-grid q-mb-md">
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
          <thead>
            <tr>
              <th class="text-left w-25"></th>
              <th>STD Setting</th>
              <th>UUC Reading <span v-if="hasExtendedReadings" class="text-caption block">(1,2,3) Mean</span></th>
              <th>Error <span v-if="hasUcbData" class="text-caption block">(Budget) Offset</span></th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <!-- Dynamic Rows -->
            <tr v-for="(m, idx) in measurements" :key="idx">
              <td class="text-left label-col">{{ m.parameter_name }}</td>
              <td>
                <div class="unit">{{ m.display_type || '' }}</div>
                {{ m.standard_value }}
              </td>
              <!-- Multiple Readings Support -->
              <template v-if="m.reading_2 !== null || m.ucb1 !== null">
                <td>
                  <div class="column items-center">
                    <div class="row q-gutter-x-xs no-wrap text-caption text-grey-8">
                       <span>{{ m.reading_1 }}</span>
                       <span>{{ m.reading_2 }}</span>
                       <span>{{ m.reading_3 }}</span>
                    </div>
                    <div class="text-weight-bold">{{ m.average_value }}</div>
                  </div>
                </td>
                <td>
                  <div class="column items-center">
                    <div class="row q-gutter-x-xs no-wrap text-caption text-grey-7" v-if="m.ucb1">
                       <span>{{ m.ucb1 }}</span>
                       <span>{{ m.ucb2 }}</span>
                       <span>{{ m.ucb3 }}</span>
                    </div>
                    <div>{{ m.error_value }}</div>
                  </div>
                </td>
              </template>
              <template v-else>
                <td>{{ m.average_value }}</td>
                <td>{{ m.error_value }}</td>
              </template>
              <td>
                {{ m.result === 'PASS' ? 'ผ่าน' : 'ไม่ผ่าน' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Alarms Row -->
        <div class="alarms-row">
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
                <th>Manufacture</th>
                <th>Model</th>
                <th>S/N</th>
                <th>Cal date</th>
                <th>Cert No.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(std, idx) in standards" :key="idx">
                <td class="text-italic">{{ std.manufacture }}</td>
                <td class="text-italic">{{ std.model }}</td>
                <td>{{ std.sn }}</td>
                <td>{{ std.calDate }}</td>
                <td class="text-italic">{{ std.certNo }}</td>
              </tr>
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
          <div class="signature-box">
            <div class="sig-label">Calibration by :</div>
            <div class="sig-line">....................................................</div>
            <div class="sig-name">( นายมนัส กว้างขวาง )</div>
            <div class="sig-title">นายช่างเทคนิค</div>
          </div>
          <div class="signature-box">
            <div class="sig-label">Approved by :</div>
            <div class="sig-line">....................................................</div>
            <div class="sig-name">( นายวันทชัย นุ้ยนาพญา )</div>
            <div class="sig-title">นายช่างไฟฟ้า</div>
          </div>
        </div>

        <div class="claim-note">
          <span class="underline">Comment:</span> This report certifies the testing results as of
          the date, the location and the conditions of testing only.
        </div>

        <div class="cer-footer">
          โรงพยาบาล บางสะพาน เลขที่ 94 หมู่ 5 ถนนเพชรเกษม-ชายทะเล ตำบลกำเนิดนพคุณ อำเภอบางสะพาน
          จังหวัดประจวบคีรีขันธ์ 77140
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface ReadingItem {
  std: string;
  uuc: string;
  error: string;
  accept: string;
}

interface StandardItem {
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
  ucb1?: number | null;
  ucb2?: number | null;
  ucb3?: number | null;
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
}

interface Props {
  data?: CerCalibrationData;
  specificParameters?: SpecificParameterApi[];
  measurements?: MeasurementApi[];
  readings?: {
    systolic: ReadingItem;
    diastolic: ReadingItem;
    temperature: ReadingItem;
    heartRate: ReadingItem;
    spo2: ReadingItem;
  };
  alarms?: {
    I: string;
    II: string;
    III: string;
    AVR: string;
    AVL: string;
    AVF: string;
    Alarm: string;
    oneMV: string;
  };
  standards?: StandardItem[];
}

const props = withDefaults(defineProps<Props>(), {
  measurements: () => [],
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
  }),
  readings: () => ({
    systolic: { std: '140.0', uuc: '139.67', error: '-0.33', accept: '+/- 8.00' },
    diastolic: { std: '90.0', uuc: '90.00', error: '0.00', accept: '+/- 8.00' },
    temperature: { std: '36.0', uuc: '36.17', error: '0.17', accept: '+/- 1.00' },
    heartRate: { std: '90.0', uuc: '90.33', error: '0.33', accept: '+/- 2.00' },
    spo2: { std: '98.0', uuc: '98.50', error: '0.50', accept: '+/- 2.00' },
  }),
  alarms: () => ({
    I: 'PASS',
    II: 'PASS',
    III: 'PASS',
    AVR: 'PASS',
    AVL: 'PASS',
    AVF: 'PASS',
    Alarm: 'PASS',
    oneMV: 'PASS',
  }),
  standards: () => [
    {
      manufacture: 'FLUKE',
      model: 'ProSim4',
      sn: '3891030',
      calDate: '01-Jun-1474',
      certNo: 'PC-EVT-65B7',
    },
    {
      manufacture: 'FLUKE',
      model: 'SPOT Light',
      sn: '3891030',
      calDate: '01-Jun-1474',
      certNo: 'DTMEVTPC4603',
    },
  ],
});

const hasExtendedReadings = computed(() => 
  props.measurements?.some(m => m.reading_2 !== null && m.reading_2 !== undefined)
);

const hasUcbData = computed(() => 
  props.measurements?.some(m => m.ucb1 !== null && m.ucb1 !== undefined)
);
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
  gap: 15px;
}

.reading-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 9.5pt;
}

.reading-table th {
  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  padding: 4px;
  font-weight: 600;
}

.reading-table td {
  padding: 4px;
  border-bottom: 1px solid #ccc;
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

.unit {
  font-size: 8pt;
  color: #000;
  margin-bottom: 2px;
}

/* ===== ALARMS ROW ===== */
.alarms-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1.5px solid #ccc;
  padding: 4px 10px;
  font-size: 9.5pt;
  font-weight: 600;
}

.alarm-item {
  color: #000;
}

/* ===== CAL STANDARD ===== */
.cal-standard {
  margin-top: 10px;
}

.cal-standard-title {
  font-weight: 700;
  font-size: 10pt;
  margin-bottom: 4px;
}

.standard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 9pt;
  margin-bottom: 10px;
  border: 1px solid #000;
}

.standard-table th,
.standard-table td {
  border: 1px solid #000;
  padding: 4px;
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
  font-size: 9.5pt;
  line-height: 1.4;
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
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 0 40px;
}

.signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10pt;
  gap: 6px;
}

.sig-label {
  align-self: flex-start;
  margin-bottom: 10px;
}

.sig-line {
  color: #000;
}

.sig-title {
  margin-top: -2px;
}

.claim-note {
  font-size: 8pt;
  margin-bottom: 8px;
  .underline {
    text-decoration: underline;
    font-weight: 600;
  }
}

.cer-footer {
  border-top: 2px solid #000;
  padding-top: 6px;
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
