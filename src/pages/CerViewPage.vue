<template>
  <q-page padding class="bg-grey-2 cer-view-page">
    <!-- Premium Header -->
    <div class="cer-header-card q-mb-xl">
      <div class="row items-center full-height q-px-lg justify-between shadow-1">
        <!-- Left Side: Doc Info -->
        <div class="row items-center gap-md">
          <div class="doc-icon-wrapper flex flex-center">
            <q-icon name="description" color="primary" size="24px" />
          </div>
          <div class="column justify-center q-ml-sm">
            <div class="text-h6 text-weight-bold text-grey-9 leading-tight">
              ใบรับรองผลการตรวจสภาพ (Maintenance)
            </div>
            <div class="text-caption text-grey-6 row items-center">
              <span class="text-weight-medium">ID: {{ activeCerData.pmNo || '-' }}</span>
              <q-separator vertical class="q-mx-sm" style="height: 12px" />
              <span>Updated: {{ activeCerData.pmDate }}</span>
            </div>
          </div>
        </div>

        <!-- Center: Toggle Buttons -->
        <div class="cert-toggle-group">
          <div
            v-for="i in [1, 2]"
            :key="i"
            class="cert-toggle-btn"
            :class="{ active: selectedCert === i }"
            @click="selectedCert = i"
          >
            <q-icon :name="selectedCert === i ? 'verified' : 'description'" size="18px" />
            <span class="q-ml-sm"> Certificate {{ i }}</span>
          </div>
        </div>

        <!-- Right Side: Actions -->
        <div class="row items-center gap-md">
          <q-btn
            outline
            color="grey-4"
            text-color="grey-9"
            icon="print"
            label="พิมพ์"
            class="print-btn q-px-md text-weight-bold"
            @click="printCer"
          />
          <q-btn
            unelevated
            color="deep-purple-5"
            icon="download"
            label="ดาวน์โหลด PDF"
            class="download-btn q-px-md text-weight-bold"
            @click="downloadPdf"
          />
        </div>
      </div>
    </div>

    <!-- Certificate Component Display & Capture Target -->
    <div class="cer-container q-mx-auto" ref="cerRef">
      <CerCertificate :data="activeCerData" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import html2pdf from 'html2pdf.js';
import type { jsPDF } from 'jspdf';
import CerCertificate from 'src/components/history/CerCertificate.vue';

const selectedCert = ref(1);
const cerRef = ref<HTMLElement | null>(null);

const cert1Data = {
  pmNo: 'PM-1-69-001',
  pmId: 'PM-1-69-',
  detail: 'PATIENT MONITOR',
  manufacture: 'NIHON KOHDEN',
  model: 'PVM-2701',
  serialNo: '12345678',
  idNo: '3555255',
  department: 'โรงพยาบาลส่งเสริมสุขภาพตำบล',
  address: 'ตำบลบางสะพาน จังหวัดประจวบคีรีขันธ์',
  section: 'NUR - กลุ่มงานการพยาบาล',
  pmDate: 'Monday, February 2, 2024',
  remark1: '',
  remark2: '',
  remark3: '',
  overallResult: 'pass' as const,
};

const cert2Data = {
  pmNo: 'PM-1-69-002',
  pmId: 'PM-1-69-',
  detail: 'EKG MACHINE',
  manufacture: 'SCHILLER',
  model: 'AT-102',
  serialNo: '87654321',
  idNo: '4666366',
  department: 'โรงพยาบาลบางสะพาน',
  address: 'ตำบลกำเนิดนพคุณ อำเภอบางสะพาน',
  section: 'ER - แผนกฉุกเฉิน',
  pmDate: 'Wednesday, March 5, 2024',
  remark1: 'เครื่องทำงานปกติ แต่อาจต้องเปลี่ยนแบตเตอรี่ในรอบหน้า',
  remark2: '',
  remark3: 'ทำความสะอาดเช็คขั้วต่อทั้งหมด',
  overallResult: 'pass' as const,
};

const activeCerData = computed(() => {
  return selectedCert.value === 1 ? cert1Data : cert2Data;
});

function getPdfOptions() {
  return {
    margin: 0,
    filename: `certificate-${activeCerData.value.pmNo}.pdf`,
    image: {
      type: 'jpeg' as const,
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
  };
}

function printCer() {
  if (!cerRef.value) return;

  const opt = getPdfOptions();

  void html2pdf()
    .set(opt)
    .from(cerRef.value)
    .toPdf()
    .get('pdf')
    .then((pdf: jsPDF) => {
      pdf.autoPrint();
      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl);
    });
}

function downloadPdf() {
  if (!cerRef.value) return;

  const opt = getPdfOptions();

  void html2pdf().set(opt).from(cerRef.value).save();
}
</script>
<style scoped lang="scss">
.cer-view-page {
  min-height: 100vh;
}

.cer-header-card {
  background: white;
  height: 80px;
  border-radius: 12px;
  margin-top: -10px;
  position: relative;
  z-index: 10;
}

.doc-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #e3f2fd;
  border-radius: 10px;
}

.cert-toggle-group {
  display: flex;
  background: #f4f6f8;
  padding: 6px;
  border-radius: 10px;
  gap: 4px;
}

.cert-toggle-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #637381;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  &.active {
    background: white;
    color: $deep-purple-5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

.print-btn {
  border-color: #eee !important;
  color: #212b36 !important;
  font-size: 13px;
  border-radius: 10px;
}

.download-btn {
  border-radius: 10px;
  font-size: 13px;
}

.cer-container {
  width: 210mm;
  min-height: 296mm;
  margin: auto;
  background: white;
}
@page {
  size: A4;
  margin: 0;
}

.gap-md {
  gap: 16px;
}

/* Print Styles */
.only-print {
  display: none;
}

@media print {
  body {
    margin: 0;
  }

  .cer-container {
    width: 210mm;
    height: 297mm;
  }
}
</style>
