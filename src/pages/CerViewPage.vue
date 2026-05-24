<template>
  <q-page padding class="bg-grey-2 cer-view-page">
    <!-- Premium Header -->
    <div class="cer-header-card q-mb-xl shadow-1">
      <div class="row items-center q-px-lg q-py-md justify-between q-col-gutter-y-md">
        <!-- Left Side: Doc Info -->
        <div class="col-12 col-md-auto row items-center justify-center justify-md-start gap-md">
          <div class="doc-icon-wrapper flex flex-center">
            <q-icon name="description" color="primary" size="24px" />
          </div>
          <div class="column justify-center q-ml-sm">
            <div class="text-h6 text-weight-bold text-grey-9 leading-tight">
              {{
                selectedCert === 1
                  ? 'ใบรับรองผลการตรวจสภาพ (Maintenance)'
                  : 'ใบรับรองผลการสอบเทียบเครื่องมือ (Calibration)'
              }}
            </div>
            <div class="text-caption text-grey-6 row items-center">
              <span class="text-weight-medium">ID: {{ activeCerData.pmNo || '-' }}</span>
              <q-separator vertical class="q-mx-sm" style="height: 12px" />
              <span>Updated: {{ activeCerData.pmDate }}</span>
            </div>
          </div>
        </div>

        <!-- Center: Toggle Buttons -->
        <div class="col-12 col-md-auto flex justify-center">
          <div class="cert-toggle-group">
            <div
              class="cert-toggle-btn"
              :class="{ active: selectedCert === 1 }"
              @click="selectedCert = 1"
            >
              <q-icon :name="selectedCert === 1 ? 'verified' : 'description'" size="18px" />
              <span class="q-ml-sm"> ใบตรวจสภาพ (PM)</span>
            </div>
            <div
              class="cert-toggle-btn"
              :class="{ active: selectedCert === 2 }"
              @click="selectedCert = 2"
            >
              <q-icon :name="selectedCert === 2 ? 'verified' : 'description'" size="18px" />
              <span class="q-ml-sm"> ใบสอบเทียบ (Cal)</span>
            </div>
          </div>
        </div>

        <!-- Right Side: Actions -->
        <div class="col-12 col-md-auto row items-center justify-center justify-md-end gap-md">
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
            color="primary"
            icon="download"
            label="ดาวน์โหลด PDF"
            class="download-btn q-px-md text-weight-bold"
            @click="downloadPdf"
          />
        </div>
      </div>
    </div>

    <!-- Certificate Component Display & Capture Target -->
    <div class="cer-scroll-wrapper">
      <div class="cer-container q-mx-auto" ref="cerRef">
        <div v-show="selectedCert === 1 || isPrinting">
          <CerCertificate :data="activeCerData" />
        </div>
        <div v-show="selectedCert === 2 || isPrinting">
          <CerCalibration
            :data="calibrationCertData"
            :measurements="task?.measurements || []"
            :settings="settingStore.settings"
            :specific-parameters="task?.specificParameters || []"
            :technician="task ? { 
              name: task.certificate_data?.technician?.name || task.technician?.name || '-', 
              position: task.technician?.role?.description || 'นายช่างไฟฟ้า', 
              signatureUrl: task.certificate_data?.technician?.signatureUrl || task.technician?.signatureUrl || null 
            } : null"
            :approver="task ? { 
              name: task.certificate_data?.approver?.name || task.approver?.name || '-', 
              position: task.approver?.role?.description || 'หัวหน้างาน', 
              signatureUrl: task.certificate_data?.approver?.signatureUrl || task.approver?.signatureUrl || null, 
            } : null"
            :alarms="alarmsData"
            :standards="standardsData"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import html2pdf from 'html2pdf.js';
import type { jsPDF } from 'jspdf';
import { pmService } from 'src/services/pm.service';
import type { TaskApi } from 'src/services/pm.service';
import CerCertificate from 'src/components/history/CerCertificate.vue';
import type { CerData } from 'src/components/history/CerCertificate.vue';
import CerCalibration from 'src/components/history/CerCalibration.vue';
import type { CerCalibrationData } from 'src/components/history/CerCalibration.vue';
import { useCalibrationSettingStore } from 'src/stores/calibrationSetting';

const route = useRoute();
const selectedCert = ref(1);
const $q = useQuasar();
const isPrinting = ref(false);
const cerRef = ref<HTMLElement | null>(null);
const loading = ref(false);
const settingStore = useCalibrationSettingStore();
const task = ref<TaskApi | null>(null);

const activeCerData = computed((): CerData => {
  if (!task.value) {
    return {
      pmNo: '-',
      pmId: '-',
      detail: '-',
      manufacture: '-',
      model: '-',
      serialNo: '-',
      idNo: '-',
      department: '-',
      address: '-',
      section: '-',
      pmDate: '-',
      remark1: '',
      remark2: '',
      remark3: '',
      overallResult: 'pass' as const,
      specificParameters: [],
    };
  }

  const t = task.value;
  return {
    pmNo: t.pm_no || `CAL-${t.id}`,
    pmId: t.pm_no?.substring(0, 8) || 'PM-1-69-',
    detail: t.equipment?.name || '-',
    manufacture: t.equipment?.manufacturer || '-',
    model: t.equipment?.model || '-',
    serialNo: t.equipment?.serial_number || '-',
    idNo: t.equipment?.asset_code || '-',
    department: t.certificate_data?.hospital?.name || t.equipment?.section?.hospital?.name || t.equipment?.location || 'Hospital',
    address: t.certificate_data?.hospital?.district 
      ? [t.certificate_data.hospital.district, t.certificate_data.hospital.province].filter(Boolean).join(' ') 
      : [t.equipment?.section?.hospital?.district, t.equipment?.section?.hospital?.province].filter(Boolean).join(' ') || '-',
    section: t.certificate_data?.department?.name 
      ? `${t.certificate_data.department.name} - ${t.equipment?.section?.description || ''}`
      : t.equipment?.section ? `${t.equipment.section.name} - ${t.equipment.section.description}` : (t.equipment?.department || '-'),
    pmDate: t.createdAt
      ? new Date(t.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '-',
    remark1: t.checklistRemarks?.find((r) => r.category?.name?.includes('สภาพทั่วไป'))?.text || '',
    remark2: t.checklistRemarks?.find((r) => r.category?.name?.includes('ปลอดภัย'))?.text || '',
    remark3: t.checklistRemarks?.find((r) => r.category?.name?.includes('บำรุงรักษา'))?.text || '',
    overallResult: t.overall_result?.toLowerCase() === 'pass' ? 'pass' : 'fail',
    qualitatives: (t.certificate_data as Record<string, unknown>)?.pmChecklist
      ? ((t.certificate_data as Record<string, unknown>).pmChecklist as { description: string; status: 'Pass' | 'Fail' | 'NA'; category_id: number; display_order: number }[]).map((r) => ({
          item_name: r.description || '-',
          result: r.status,
          category_id: r.category_id,
          display_order: r.display_order,
        }))
      : t.checklistResults?.map((r) => ({
          item_name: r.item?.description || '-',
          result: r.status,
          category_id: r.item?.category_id,
          display_order: r.item?.display_order,
        })) || [],
    technician: t
      ? {
          name: t.certificate_data?.technician?.name || t.technician?.name || '-',
          signatureUrl: t.certificate_data?.technician?.signatureUrl || t.technician?.signatureUrl || null,
          role: {
            description: t.technician?.role?.description || '-',
          },
        }
      : null,
    specificParameters: t.specificParameters || [],
    hospital: t.certificate_data?.hospital?.name
      ? {
          name: t.certificate_data.hospital.name,
          logoUrl: t.certificate_data.hospital.logoUrl,
          address: t.certificate_data.hospital.address,
          district: t.certificate_data.hospital.district,
          province: t.certificate_data.hospital.province,
          zipCode: t.certificate_data.hospital.zipCode,
        }
      : t.technician?.hospital
        ? {
            name: t.technician.hospital.name,
            logoUrl: t.technician.hospital.logoUrl,
            address: t.technician.hospital.address,
            district: t.technician.hospital.district,
            province: t.technician.hospital.province,
            zipCode: t.technician.hospital.zipCode,
          }
        : t.equipment?.section?.hospital
          ? {
              name: t.equipment.section.hospital.name,
              logoUrl: t.equipment.section.hospital.logoUrl,
              address: t.equipment.section.hospital.address,
              district: t.equipment.section.hospital.district,
              province: t.equipment.section.hospital.province,
              zipCode: t.equipment.section.hospital.zipCode,
            }
          : null,
  };
});

const calibrationCertData = computed((): CerCalibrationData => {
  const t = task.value;
  return {
    certNo: t?.pm_no || (t ? `CAL-${t.id}` : '-'),
    detail: t?.equipment?.name || '-',
    manufacture: t?.equipment?.manufacturer || '-',
    model: t?.equipment?.model || '-',
    serialNo: t?.equipment?.serial_number || '-',
    idNo: t?.equipment?.asset_code || '-',
    department: t?.certificate_data?.hospital?.name || t?.equipment?.section?.hospital?.name || t?.equipment?.location || 'Hospital',
    address: t?.certificate_data?.hospital?.district
      ? [t.certificate_data.hospital.district, t.certificate_data.hospital.province].filter(Boolean).join(' ')
      : [t?.equipment?.section?.hospital?.district, t?.equipment?.section?.hospital?.province]
          .filter(Boolean)
          .join(' ') || '-',
    section: t?.certificate_data?.department?.name
      ? `${t.certificate_data.department.name} - ${t?.equipment?.section?.description || ''}`
      : t?.equipment?.section
        ? `${t.equipment.section.name} - ${t.equipment.section.description}`
        : t?.equipment?.department || '-',
    temperature: t?.environments?.[0]?.ambient_temp !== undefined && t?.environments?.[0]?.ambient_temp !== null
      ? Number(t.environments[0].ambient_temp).toFixed(1)
      : '25.0',
    humidity: t?.environments?.[0]?.ambient_humidity !== undefined && t?.environments?.[0]?.ambient_humidity !== null
      ? Number(t.environments[0].ambient_humidity).toFixed(1)
      : '45.0',
    calDate: t?.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : '-',
    apprDate: t?.approvedAt ? new Date(t.approvedAt).toLocaleDateString('en-GB') : '-',
    hospital: t?.certificate_data?.hospital?.name
      ? {
          name: t.certificate_data.hospital.name,
          logoUrl: t.certificate_data.hospital.logoUrl,
          address: t.certificate_data.hospital.address,
          district: t.certificate_data.hospital.district,
          province: t.certificate_data.hospital.province,
          zipCode: t.certificate_data.hospital.zipCode,
        }
      : t?.technician?.hospital
        ? {
            name: t.technician.hospital.name,
            logoUrl: t.technician.hospital.logoUrl,
            address: t.technician.hospital.address,
            district: t.technician.hospital.district,
            province: t.technician.hospital.province,
            zipCode: t.technician.hospital.zipCode,
          }
        : t?.equipment?.section?.hospital
          ? {
              name: t.equipment.section.hospital.name,
              logoUrl: t.equipment.section.hospital.logoUrl,
              address: t.equipment.section.hospital.address,
              district: t.equipment.section.hospital.district,
              province: t.equipment.section.hospital.province,
              zipCode: t.equipment.section.hospital.zipCode,
            }
          : null,
  };
});

const alarmsData = computed(() => {
  const t = task.value;
  if (!t) return undefined;

  let foundAtLeastOne = false;
  const findResult = (key: string) => {
    // 1. Check Qualitatives (Cal)
    const q = t.qualitatives?.find((item) => item.item_name === key);
    if (q) {
      foundAtLeastOne = true;
      return q.result;
    }

    // 2. Check Checklist Results (PM)
    const cr = t.checklistResults?.find((item) => item.item?.description === key);
    if (cr) {
      foundAtLeastOne = true;
      return cr.status.toUpperCase();
    }

    // 3. Partial match (case-insensitive) fallback
    const cr2 = t.checklistResults?.find((item) =>
      item.item?.description.toLowerCase().includes(key.toLowerCase()),
    );
    if (cr2) {
      foundAtLeastOne = true;
      return cr2.status.toUpperCase();
    }

    return null;
  };

  const res = {
    I: findResult('I'),
    II: findResult('II'),
    III: findResult('III'),
    AVR: findResult('AVR'),
    AVL: findResult('AVL'),
    AVF: findResult('AVF'),
    Alarm: findResult('Alarm'),
    oneMV: findResult('1mV'),
  };

  if (!foundAtLeastOne) return undefined;

  return {
    I: res.I || 'PASS',
    II: res.II || 'PASS',
    III: res.III || 'PASS',
    AVR: res.AVR || 'PASS',
    AVL: res.AVL || 'PASS',
    AVF: res.AVF || 'PASS',
    Alarm: res.Alarm || 'PASS',
    oneMV: res.oneMV || 'PASS',
  };
});

const standardsData = computed(() => {
  return task.value?.standardTools?.map((std) => ({
    name: std.name,
    manufacture: std.manufacturer,
    model: std.model,
    sn: std.serial_number,
    calDate: std.calibration_date_last
      ? new Date(std.calibration_date_last).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-',
    certNo: std.certificate_number,
  }));
});

onMounted(async () => {
  const taskId = route.query.taskId as string;
  if (taskId) {
    loading.value = true;
    try {
      const data = await pmService.getTaskById(parseInt(taskId));
      task.value = data.data;
      console.log('[DEBUG] Task Loaded in CER View:', {
        certificate_data: data.data.certificate_data,
        approver: data.data.approver,
      });
      if (task.value?.equipment?.name) {
        await settingStore.fetchSettings(task.value.equipment.name.trim());
      }
    } catch (error) {
      console.error('Failed to fetch task for CER:', error);
    } finally {
      loading.value = false;
    }
  }
});

watch(
  () => task.value,
  (t) => {
    if (t?.status === 'Approved' && !t.path_pdf_cer) {
      // Auto-upload in background after rendering
      setTimeout(() => {
        void autoUploadPdf();
      }, 3000);
    }
  },
);

async function autoUploadPdf() {
  if (!cerRef.value || !task.value?.id || task.value.path_pdf_cer) return;
  console.log('触发自动上传 PDF...');
  const opt = getPdfOptions();
  try {
    const blob = await html2pdf().set(opt).from(cerRef.value).output('blob');
    await pmService.uploadCerPdf(task.value.id, blob);
    task.value.path_pdf_cer = 'uploaded-auto';
    console.log('自动上传 PDF 成功');
  } catch (e) {
    console.error('Auto-upload PDF failed:', e);
  }
}

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

async function printCer() {
  if (!cerRef.value) return;

  isPrinting.value = true;
  await nextTick();

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
    })
    .finally(() => {
      isPrinting.value = false;
    });
}

async function downloadPdf() {
  if (!cerRef.value) return;

  isPrinting.value = true;
  await nextTick();

  const opt = getPdfOptions();

  try {
    const blob = await html2pdf().set(opt).from(cerRef.value).output('blob');
    
    // Save locally for the user
    void html2pdf().set(opt).from(cerRef.value).save();

    // Upload to backend
    if (task.value?.id) {
      await pmService.uploadCerPdf(task.value.id, blob);
      $q.notify({
        type: 'positive',
        message: 'บันทึกใบ CER ลงระบบเรียบร้อยแล้ว',
        position: 'top',
      });
      // Update local task state to reflect it's saved (optional)
      task.value.path_pdf_cer = 'uploaded'; 
    }
  } catch (error) {
    console.error('PDF Generation/Upload Error:', error);
    $q.notify({
      type: 'negative',
      message: 'เกิดข้อผิดพลาดในการบันทึก PDF',
    });
  } finally {
    isPrinting.value = false;
  }
}
</script>
<style scoped lang="scss">
.cer-view-page {
  min-height: 100vh;
}

.cer-header-card {
  background: white;
  min-height: 80px;
  border-radius: 12px;
  margin-top: -10px;
  position: relative;
  z-index: 10;
}

.cer-scroll-wrapper {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 24px;
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
    color: $primary;
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
    /* let height be auto for multiple pages */
    height: auto;
  }
}
</style>
