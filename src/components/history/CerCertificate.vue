<template>
  <div class="cer-wrapper">
    <div class="cer-page a4-size">
      <!-- ===== HEADER ===== -->
      <div class="cer-header">
        <div class="header-logo-area">
          <img
            :src="getImageUrl(data.hospital?.logoUrl) || '/image/logo.png'"
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
      <div class="header-pm-no">
        <span class="pm-no-label">PM. No:</span>
        <span class="pm-no-value">{{ data.pmNo }}</span>
      </div>

      <!-- ===== TITLE ===== -->
      <div class="cer-title-row">
        <div class="cer-title">Preventive Maintenance Report</div>
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
            <span class="info-label">ID No :</span>
            <span class="info-value">{{ data.idNo }}</span>
          </div>
        </div>

        <!-- Divider -->
        <div class="info-divider"></div>

        <!-- Right Column -->
        <div class="info-col">
          <div class="info-row">
            <span class="info-label">Department :</span>
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
          <div class="info-row">
            <span class="info-label">PM Date :</span>
            <span class="info-value info-value--bold">{{ data.pmDate }}</span>
          </div>
        </div>
      </div>

      <!-- ===== MAIN CONTENT (3-column layout) ===== -->
      <div class="cer-body">
        <!-- ===== LEFT BODY COLUMN ===== -->
        <div class="body-left">
          <!-- Section 1: ตรวจสภาพทั่วไป -->
          <div class="check-section">
            <div class="section-title">
              <span class="section-name">1. ตรวจสภาพทั่วไป</span>

              <div class="check-header-cols">
                <span>ปกติ</span>
                <span>ไม่ปกติ</span>
                <span>N/A</span>
              </div>
            </div>
            <div v-for="(item, idx) in section1Items" :key="idx" class="check-item">
              <span class="item-code">{{ item.code }}</span>
              <span class="item-name">{{ item.name }}</span>
              <div class="check-boxes">
                <q-checkbox :model-value="item.status === 'normal'" disable dense size="xs" />
                <q-checkbox :model-value="item.status === 'abnormal'" disable dense size="xs" />
                <q-checkbox :model-value="item.status === 'na'" disable dense size="xs" />
              </div>
            </div>
          </div>
        </div>

        <!-- ===== RIGHT BODY COLUMN ===== -->
        <div class="body-right">
          <!-- Remark Box 1 -->
          <div class="remark-block">
            <div class="remark-side">
              <div class="remark-label">หมายเหตุ</div>
              <div class="remark-num">1</div>
            </div>
            <div class="remark-box">{{ data.remark1 }}</div>
          </div>

          <!-- Section 2: การปลอดภัย -->
          <div class="check-section">
            <div class="section-title">
              <span class="section-name">2. การปลอดภัย</span>
              <div class="check-header-cols">
                <span>ปกติ</span>
                <span>ไม่ปกติ</span>
                <span>N/A</span>
              </div>
            </div>
            <div v-for="(item, idx) in section2Items" :key="idx" class="check-item">
              <span class="item-code">{{ item.code }}</span>
              <span class="item-name">{{ item.name }}</span>
              <div class="check-boxes">
                <q-checkbox :model-value="item.status === 'normal'" disable dense size="xs" />
                <q-checkbox :model-value="item.status === 'abnormal'" disable dense size="xs" />
                <q-checkbox :model-value="item.status === 'na'" disable dense size="xs" />
              </div>
            </div>
          </div>

          <!-- Remark Box 2 -->
          <div class="remark-block remark-block--sm">
            <div class="remark-side">
              <div class="remark-label">หมายเหตุ</div>
              <div class="remark-num">2</div>
            </div>
            <div class="remark-box remark-box--sm">{{ data.remark2 }}</div>
          </div>

          <!-- Section 3: การบำรุงรักษา -->
          <div class="check-section">
            <div class="section-title section-title--no-header">
              <span class="section-name">3. การบำรุงรักษา</span>
            </div>
            <div
              v-for="(item, idx) in section3Items"
              :key="idx"
              class="check-item check-item--maintenance"
            >
              <span class="item-code">{{ item.code }}</span>
              <span class="item-name">{{ item.name }}</span>
              <q-checkbox
                :model-value="item.done"
                disable
                dense
                size="xs"
                class="check-box-single"
              />
            </div>
          </div>

          <!-- Remark Box 3 -->
          <div class="remark-block remark-block--sm">
            <div class="remark-side">
              <div class="remark-label">หมายเหตุ</div>
              <div class="remark-num">3</div>
            </div>
            <div class="remark-box remark-box--sm">{{ data.remark3 }}</div>
          </div>

          <!-- Result Row -->
          <div class="result-row">
            <span class="result-label">สรุปโดยรวม</span>
            <div class="result-check">
              <q-checkbox :model-value="data.overallResult === 'pass'" disable dense size="xs" />
              <span class="result-text">ผ่าน</span>
              <q-checkbox :model-value="data.overallResult === 'fail'" disable dense size="xs" />
              <span class="result-text">ไม่ผ่าน</span>
            </div>
          </div>

          <!-- Repair Note -->
          <div class="repair-note">
            <span>บำรุงรักษาโดย : </span>
            <div class="signature-area">
              <div class="signature-wrapper">
                <div v-if="data.technician?.signatureUrl" class="signature-img">
                  <img
                    :src="getImageUrl(data.technician.signatureUrl)"
                    alt="Technician Signature"
                  />
                </div>
                <div v-else class="signature-placeholder"></div>
                <div class="dots-line">....................................................</div>
              </div>

              <div class="signature-line">
                ({{
                  data.technician?.name || '....................................................'
                }})
              </div>
              <div class="signature-title">
                {{ data.technician?.role?.description || 'นายช่างไฟฟ้า' }}
              </div>
            </div>
          </div>

          <!-- Signature -->
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <div class="cer-footer">
        {{ data.hospital?.name || '' }}
        {{ data.hospital?.address || '' }}
        {{ data.hospital?.district || '' }} {{ data.hospital?.province || '' }}
        {{ data.hospital?.zipCode || '' }}
      </div>
    </div>

    <!-- Print Button (hidden in print) -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

function getImageUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${apiBase}${path}`;
}
// ---------- Props ----------
interface CheckItem {
  code: string;
  name: string;
  status: 'normal' | 'abnormal' | 'na';
}
interface MaintenanceItem {
  code: string;
  name: string;
  done: boolean;
}
export interface QualitativeItem {
  item_name: string;
  result: string;
  category_id?: number | undefined;
  display_order?: number | undefined;
}

export interface SpecificParameterApi {
  id: number;
  name: string;
  value: string | null;
  unit: string | null;
  task_id: number;
}

export interface CerData {
  pmNo: string;
  pmId: string;
  detail: string;
  manufacture: string;
  model: string;
  serialNo: string;
  idNo: string;
  department: string;
  address: string;
  section: string;
  pmDate: string;
  remark1: string;
  remark2: string;
  remark3: string;
  overallResult: 'pass' | 'fail';
  qualitatives?: QualitativeItem[];
  specificParameters?: SpecificParameterApi[];
  technician?: {
    name: string;
    signatureUrl?: string | null;
    role?: {
      description: string;
    } | null;
  } | null;
  hospital?: {
    name: string;
    logoUrl?: string | undefined;
    address?: string | undefined;
    district?: string | undefined;
    province?: string | undefined;
    zipCode?: string | undefined;
  } | null;
}

interface Props {
  data?: CerData;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    pmNo: '',
    pmId: 'PM-1-69-',
    detail: 'PATIENT MONITOR',
    manufacture: 'MANNFACT',
    model: 'MODEL',
    serialNo: '99999999',
    idNo: '3555255',
    department: 'โรงพยาบาลส่งเสริมสุขภาพตำบล',
    address: 'ตำบลบางสะพาน จังหวัดประจวบคีรีขันธ์',
    section: 'NUR - กลุ่มงานการพยาบาล',
    pmDate: 'Monday, February 2',
    remark1: '',
    remark2: '',
    remark3: '',
    overallResult: 'pass',
    qualitatives: [],
    hospital: {
      name: 'Bang Saphan Hospital',
      logoUrl: '/image/logo.png',
      address: 'Kamnoet Nopphakhun , Bang Saphan',
      district: 'Bang Saphan',
      province: 'Prachuap Khiri Khan',
      zipCode: '77140',
    },
  }),
});

// ---------- Grouping Qualitatives by Category ----------
const groupedQualitatives = computed(() => {
  if (!props.data.qualitatives) return [];
  // Group by category_id and sort each group by display_order
  const groups: Record<number, QualitativeItem[]> = {};
  props.data.qualitatives.forEach((q) => {
    const catId = q.category_id || 0;
    if (!groups[catId]) groups[catId] = [];
    groups[catId].push(q);
  });

  // Sort categories by their ID (assuming they match the order 1, 2, 3)
  // Or better, convert to an array of sections
  const sortedCatIds = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);
  return sortedCatIds.map((id) =>
    (groups[id] || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
  );
});

// ---------- Helpers ----------
function getStatus(sectionIdx: number, itemIdx: number): 'normal' | 'abnormal' | 'na' {
  const section = groupedQualitatives.value[sectionIdx];
  if (!section || !section[itemIdx]) return 'na';
  const res = section[itemIdx].result.toUpperCase();
  if (res === 'PASS') return 'normal';
  if (res === 'FAIL') return 'abnormal';
  return 'na';
}

function getDone(sectionIdx: number, itemIdx: number): boolean {
  const section = groupedQualitatives.value[sectionIdx];
  if (!section || !section[itemIdx]) return false;
  return section[itemIdx].result.toUpperCase() === 'PASS';
}

// ---------- Section 1 items ----------
const section1Items = computed((): CheckItem[] => {
  const section = groupedQualitatives.value[0];
  if (!section || section.length === 0) {
    return [
      { code: '1.1', name: 'สภาพภายนอก /โครงสร้าง', status: getStatus(0, 0) },
      { code: '1.2', name: 'ฝีมือการติดตั้ง/ยึดโยง', status: getStatus(0, 1) },
      { code: '1.3', name: 'การขับเคลื่อน/เบรค', status: getStatus(0, 2) },
      { code: '1.4', name: 'สายไฟ AC ปลั๊ก', status: getStatus(0, 3) },
      { code: '1.5', name: 'สายสัญญาณ', status: getStatus(0, 4) },
      { code: '1.6', name: 'ความตึงหย่อน/ความหนาแน่น', status: getStatus(0, 5) },
      { code: '1.7', name: 'เบรกเกอร์/ฟิวส์', status: getStatus(0, 6) },
      { code: '1.8', name: 'หลอด ท่อ/วัสดุห่อหุ้ม', status: getStatus(0, 7) },
      { code: '1.9', name: 'สายเคเบิล', status: getStatus(0, 8) },
      { code: '1.10', name: 'ข้อต่อ/จุดต่อต่างๆ', status: getStatus(0, 9) },
      { code: '1.11', name: 'Electrodes/Transducers', status: getStatus(0, 10) },
      { code: '1.12', name: 'ฟิลเตอร์', status: getStatus(0, 11) },
      { code: '1.13', name: 'สวิทช์/การควบคุม', status: getStatus(0, 12) },
      { code: '1.14', name: 'อินเตอร์', status: getStatus(0, 13) },
      { code: '1.15', name: 'มอเตอร์/ปั๊ม/พัดลม', status: getStatus(0, 14) },
      { code: '1.16', name: 'ระดับ/ของเหลว', status: getStatus(0, 15) },
      { code: '1.17', name: 'แบตเตอรี/การชาร์จประจุ', status: getStatus(0, 16) },
      { code: '1.18', name: 'การแสดงผล', status: getStatus(0, 17) },
      { code: '1.19', name: 'Self Test', status: getStatus(0, 18) },
      { code: '1.20', name: 'สัญญาณเตือน', status: getStatus(0, 19) },
      { code: '1.21', name: 'สัญญาณแสดงการทำงาน', status: getStatus(0, 20) },
      { code: '1.22', name: 'ฉลาก/เครื่องหมาย', status: getStatus(0, 21) },
      { code: '1.23', name: 'อุปกรณ์ประกอบ', status: getStatus(0, 22) },
    ];
  }
  return section.map((q, idx) => ({
    code: `1.${idx + 1}`,
    name: q.item_name,
    status:
      q.result.toUpperCase() === 'PASS'
        ? 'normal'
        : q.result.toUpperCase() === 'FAIL'
          ? 'abnormal'
          : 'na',
  }));
});

// ---------- Section 2 items ----------
const section2Items = computed((): CheckItem[] => {
  const section = groupedQualitatives.value[1];
  if (!section || section.length === 0) {
    return [
      { code: '2.1', name: 'ระบบกราวด์ (0.5 OHM)', status: getStatus(1, 0) },
      { code: '2.2', name: 'การรั่วของกระแสไฟฟ้า', status: getStatus(1, 1) },
    ];
  }
  return section.map((q, idx) => ({
    code: `2.${idx + 1}`,
    name: q.item_name,
    status:
      q.result.toUpperCase() === 'PASS'
        ? 'normal'
        : q.result.toUpperCase() === 'FAIL'
          ? 'abnormal'
          : 'na',
  }));
});

// ---------- Section 3 items ----------
const section3Items = computed((): MaintenanceItem[] => {
  const section = groupedQualitatives.value[2];
  if (!section || section.length === 0) {
    return [
      {
        code: '3.1',
        name: 'ทำความสะอาดตัวเครื่อง,สายประกอบภายนอกและภายใน',
        done: getDone(2, 0),
      },
      { code: '3.2', name: 'การหล่อลื่นจุดสัมผัสกลไกต่างๆ', done: getDone(2, 1) },
      {
        code: '3.3',
        name: 'ปรับเทียบค่ามาตรฐาน/ปรับจูนแก้ไข กลไกต่างๆ',
        done: getDone(2, 2),
      },
      { code: '3.4', name: 'เปลี่ยนวัสดุตามอายุงาน ฟิลเตอร์/แปงถ่าน', done: getDone(2, 3) },
      { code: '3.5', name: 'เปลี่ยนถ่ายของเหลวในกระเปาะ', done: getDone(2, 4) },
    ];
  }
  return section.map((q, idx) => ({
    code: `3.${idx + 1}`,
    name: q.item_name,
    done: q.result.toUpperCase() === 'PASS',
  }));
});

// ---------- Print ----------
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
  height: 296mm;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  position: relative;
  overflow: hidden;
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

.header-pm-no {
  text-align: right;
  font-size: 10pt;
  color: #000;
  .pm-no-label {
    font-weight: 600;
  }
  .pm-no-value {
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

.cer-pm-id {
  font-size: 12pt;
  color: #000;
  font-weight: 600;
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

.info-value--bold {
  font-weight: 700;
  color: #000;
}

/* ===== BODY LAYOUT ===== */
.cer-body {
  display: flex;
  gap: 0;
  flex: 1;
}

.body-left {
  flex: 1.1;
  padding-right: 6px;
}

.body-right {
  flex: 1;
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ===== CHECK SECTION ===== */
.check-section {
  margin-bottom: 4px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 2px 6px;
  border-radius: 1px;
  margin-bottom: 1px;
  font-weight: 700;
  font-size: 9.5pt;
}

.section-title--no-header .check-header-cols {
  display: none;
}

.section-num {
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10pt;
  font-weight: 700;
  flex-shrink: 0;
}

.section-name {
  flex: 1;
  text-decoration: underline;
}

.check-header-cols {
  display: flex;
  gap: 6px;
  font-size: 8pt;
  font-weight: 700;
  color: #000;

  span {
    width: 36px;
    text-align: center;
    flex-shrink: 0;
  }
}

/* ===== CHECK ITEM ===== */
.check-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9pt;
  padding: 1px 4px;
  margin-bottom: 4px;
}

.item-code {
  min-width: 28px;
  font-weight: 600;
  color: #000;
  font-size: 8.5pt;
}

.item-name {
  flex: 1;
  font-size: 9pt;
}

.check-boxes {
  display: flex;
  gap: 8px;

  > * {
    width: 36px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
  }
}

/* ===== Maintenance items (section 3, right-aligned checkbox) ===== */
.check-item--maintenance {
  justify-content: flex-start;

  .check-box-single {
    margin-left: auto;
  }
}

/* ===== CHECKBOX ===== */

/* ===== REMARK BOXES ===== */
.remark-block {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 4px;
}

.remark-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.remark-label {
  font-size: 8pt;
  font-weight: 700;
  color: #000;
  white-space: nowrap;
  padding: 2px 0;
}

.remark-num {
  font-size: 10pt;
  font-weight: 700;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.remark-box {
  flex: 1;
  border: 1.5px solid #ccc;
  border-radius: 2px;
  height: 80px;
  padding: 4px;
  font-size: 8.5pt;
  margin-top: 20px;
}

.remark-box--sm {
  min-height: 28px;
}

/* ===== RESULT ROW ===== */
.result-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding-top: 4px;

  .result-label {
    font-weight: 700;
    font-size: 10pt;
    margin-left: 50px;
    margin-right: 40px;
    text-decoration: underline;
  }

  .result-check {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .result-text {
    font-size: 10pt;
    margin-right: 20px;
  }
}

/* ===== REPAIR NOTE ===== */
.repair-note {
  font-size: 10pt;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 65px;
}

/* ===== SIGNATURE ===== */
.signature-area {
  margin-top: 8px;
  text-align: center;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .signature-img {
    height: 45px;
    margin-bottom: -15px;
    z-index: 1;

    img {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .signature-placeholder {
    height: 30px;
    visibility: hidden;
  }

  .signature-line {
    font-size: 9.5pt;
    position: relative;
    z-index: 2;
  }

  .signature-title {
    font-weight: 700;
    font-size: 9.5pt;
  }
}

/* ===== FOOTER ===== */
.cer-footer {
  margin-top: auto;
  padding-top: 6px;
  border-top: 2px solid #000;
  font-size: 8pt;
  color: #444;
  text-align: center;
}

/* ===== PRINT ===== */
.print-actions {
  margin-top: 16px;
}

@media print {
  .no-print {
    display: none !important;
  }

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

  @page {
    size: A4;
    margin: 0;
  }
}
</style>
