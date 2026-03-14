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

      <!-- ===== MAIN CONTENT ===== -->
      <div class="cer-body">
        <!-- Reading Table -->
        <table class="reading-table">
          <thead>
            <tr>
              <th class="text-left w-25"></th>
              <th>STD Setting</th>
              <th>UUC Reading</th>
              <th>Error</th>
              <th>Accept value</th>
            </tr>
          </thead>
          <tbody>
            <!-- Systolic -->
            <tr>
              <td class="text-left label-col">Systolic Pressure</td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.systolic.std }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.systolic.uuc }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.systolic.error }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.systolic.accept }}
              </td>
            </tr>
            <!-- Diastolic -->
            <tr>
              <td class="text-left label-col">Diastolic Pressure</td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.diastolic.std }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.diastolic.uuc }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.diastolic.error }}
              </td>
              <td>
                <div class="unit">mmHg</div>
                {{ readings.diastolic.accept }}
              </td>
            </tr>
            <!-- Temperature -->
            <tr>
              <td class="text-left label-col">Temperature</td>
              <td>
                <div class="unit">Celsius</div>
                {{ readings.temperature.std }}
              </td>
              <td>
                <div class="unit">Celsius</div>
                {{ readings.temperature.uuc }}
              </td>
              <td>
                <div class="unit">Celsius</div>
                {{ readings.temperature.error }}
              </td>
              <td>
                <div class="unit">Celsius</div>
                {{ readings.temperature.accept }}
              </td>
            </tr>
            <!-- Heart Rate -->
            <tr>
              <td class="text-left label-col">Heart Rate</td>
              <td>
                <div class="unit">Pulse/Minute</div>
                {{ readings.heartRate.std }}
              </td>
              <td>
                <div class="unit">Pulse/Minute</div>
                {{ readings.heartRate.uuc }}
              </td>
              <td>
                <div class="unit">Pulse/Minute</div>
                {{ readings.heartRate.error }}
              </td>
              <td>
                <div class="unit">Pulse/Minute</div>
                {{ readings.heartRate.accept }}
              </td>
            </tr>
            <!-- SpO2 -->
            <tr>
              <td class="text-left label-col">SpO2</td>
              <td>
                <div class="unit">%</div>
                {{ readings.spo2.std }}
              </td>
              <td>
                <div class="unit">%</div>
                {{ readings.spo2.uuc }}
              </td>
              <td>
                <div class="unit">%</div>
                {{ readings.spo2.error }}
              </td>
              <td>
                <div class="unit">%</div>
                {{ readings.spo2.accept }}
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
interface ReadingItem {
  std: string;
  uuc: string;
  error: string;
  accept: string;
}

interface CerCalibrationData {
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

interface StandardItem {
  manufacture: string;
  model: string;
  sn: string;
  calDate: string;
  certNo: string;
}

interface Props {
  data?: CerCalibrationData;
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

withDefaults(defineProps<Props>(), {
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
</style>
