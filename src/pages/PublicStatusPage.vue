<template>
  <q-page class="bg-grey-2">
    <!-- Purple Header -->

    <div class="container q-pa-md q-mx-auto" style="max-width: 1200px">
      <div v-if="loading" class="flex flex-center q-pt-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="error || !data" class="flex flex-center q-pt-xl">
        <q-card flat bordered class="q-pa-xl text-center">
          <q-icon name="error_outline" color="negative" size="64px" class="q-mb-md" />
          <div class="text-h6 q-mb-xs">ไม่พบข้อมูลเครื่องมือ</div>
          <div class="text-grey-7">รหัสเครื่องมือนี้อาจไม่ถูกต้อง หรือไม่มีข้อมูลในระบบ</div>
        </q-card>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <!-- Left Column: Tool Info & History -->
        <div class="col-12 col-md-4">
          <!-- Tool Detail Card -->
          <q-card flat class="tool-card q-mb-lg overflow-hidden relative-position">
            <div class="card-gradient-bg"></div>
            <q-card-section class="q-pa-lg">
              <div class="row items-start no-wrap q-mb-md">
                <div class="info-badge q-px-sm q-py-xs q-mb-sm">ID: {{ data.equipment.id }}</div>
              </div>
              <div class="row no-wrap items-center q-mb-md">
                <div class="tool-image-placeholder q-mr-md">
                  <q-icon name="settings_remote" size="32px" color="primary" />
                </div>
                <div>
                  <div class="text-h6 text-blue-grey-10 text-weight-bolder lh-1">
                    {{ data.equipment.name }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ data.equipment.model }} ({{ data.equipment.equipmentType?.name }})
                  </div>
                </div>
              </div>

              <q-list dense class="q-mt-md details-list">
                <q-item class="q-px-none min-h-sm">
                  <q-item-section class="text-grey-7">แผนก</q-item-section>
                  <q-item-section side class="text-weight-bold text-blue-grey-9">
                    {{ data.equipment.section?.name || '-' }}
                  </q-item-section>
                </q-item>
                <q-item class="q-px-none min-h-sm">
                  <q-item-section class="text-grey-7">ยี่ห้อ</q-item-section>
                  <q-item-section side class="text-weight-bold text-blue-grey-9">
                    {{ data.equipment.manufacturer || '-' }}
                  </q-item-section>
                </q-item>
                <q-item class="q-px-none min-h-sm">
                  <q-item-section class="text-grey-7">Serial No.</q-item-section>
                  <q-item-section side class="text-weight-bold text-blue-grey-9">
                    {{ data.equipment.serial_number || '-' }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- History Timeline Card -->
          <q-card flat class="history-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-lg">
                <q-icon name="history" color="primary" size="20px" class="q-mr-xs" />
                <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                  ประวัติการสอบเทียบ
                </div>
              </div>

              <div class="timeline">
                <div v-for="(log, idx) in data.history" :key="idx" class="timeline-item">
                  <div class="timeline-line" v-if="idx !== data.history.length - 1"></div>
                  <div class="timeline-content row items-center">
                    <div
                      class="timeline-dot q-mr-md"
                      :class="log.overall_result === 'Pass' ? 'bg-positive' : 'bg-negative'"
                    ></div>
                    <div class="col">
                      <div class="row justify-between items-center">
                        <div class="text-weight-bold text-blue-grey-9">
                          {{ formatDate(log.createdAt) }}
                        </div>
                        <div
                          class="status-pill-small"
                          :class="log.overall_result === 'Pass' ? 'pass' : 'fail'"
                        >
                          {{ log.overall_result === 'Pass' ? 'ผ่าน' : 'ไม่ผ่าน' }}
                        </div>
                      </div>
                      <div class="text-caption text-grey-6">
                        โดย {{ log.technician?.name || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!data.history?.length" class="text-center text-grey-6 q-py-md">
                  ไม่มีประวัติการสอบเทียบ
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Right Column: Status & Latest Result -->
        <div class="col-12 col-md-8">
          <!-- Result Card -->
          <q-card flat class="status-card q-mb-lg">
            <q-card-section class="q-pa-lg">
              <div class="row justify-between items-center q-mb-lg">
                <div class="row items-center">
                  <div class="text-h6 text-weight-bold text-blue-grey-10">ผลการสอบเทียบล่าสุด</div>
                  <q-icon name="check_circle" color="primary" class="q-ml-sm" size="18px" />
                </div>
                <div class="text-grey-6 text-caption">
                  ข้อมูล ณ วันที่ {{ formatDate(data.latestTask?.createdAt) }}
                </div>
              </div>

              <div
                class="result-box q-pa-md q-mb-lg row no-wrap items-center justify-between"
                :class="
                  data.latestTask?.overall_result === 'Pass'
                    ? 'bg-positive-light'
                    : 'bg-negative-light'
                "
              >
                <div class="row no-wrap items-center">
                  <div class="result-icon-bg q-mr-md flex flex-center">
                    <q-icon
                      :name="data.latestTask?.overall_result === 'Pass' ? 'check' : 'close'"
                      :color="data.latestTask?.overall_result === 'Pass' ? 'positive' : 'negative'"
                      size="24px"
                    />
                  </div>
                  <div>
                    <div
                      class="text-subtitle1 text-weight-bold"
                      :class="
                        data.latestTask?.overall_result === 'Pass'
                          ? 'text-positive'
                          : 'text-negative'
                      "
                    >
                      {{
                        data.latestTask?.overall_result === 'Pass'
                          ? 'ผ่านการสอบเทียบ'
                          : 'ไม่ผ่านการสอบเทียบ'
                      }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{
                        data.latestTask?.overall_result === 'Pass'
                          ? 'Passed Calibration Standards'
                          : 'Failed Calibration Standards'
                      }}
                    </div>
                  </div>
                </div>
                <div
                  class="status-pill bg-white bordered"
                  :class="
                    data.latestTask?.overall_result === 'Pass' ? 'text-positive' : 'text-negative'
                  "
                >
                  สถานะ:
                  {{
                    data.latestTask?.overall_result === 'Pass'
                      ? 'ใช้งานได้ปกติ (Normal)'
                      : 'ต้องส่งซ่อม/แก้ไข (Maintenance Required)'
                  }}
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="info-item row no-wrap items-center q-pa-md bordered-box">
                    <q-icon name="person_outline" color="primary" size="24px" class="q-mr-md" />
                    <div>
                      <div class="text-caption text-grey-6 lh-1">ผู้สอบเทียบ (TECHNICIAN)</div>
                      <div class="text-weight-bold text-blue-grey-10">
                        {{ data.latestTask?.technician?.name || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item row no-wrap items-center q-pa-md bordered-box">
                    <q-icon name="calendar_today" color="primary" size="24px" class="q-mr-md" />
                    <div>
                      <div class="text-caption text-grey-6 lh-1">วันที่สอบเทียบ (DATE)</div>
                      <div class="text-weight-bold text-blue-grey-10">
                        {{ formatDate(data.latestTask?.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="info-item next-due-item row no-wrap items-center justify-between q-pa-md bordered-box"
                  >
                    <div class="row no-wrap items-center">
                      <q-icon name="update" color="primary" size="24px" class="q-mr-md" />
                      <div>
                        <div class="text-caption text-grey-6 lh-1">
                          กำหนดสอบเทียบครั้งถัดไป (NEXT DUE)
                        </div>
                        <div class="text-weight-bold text-blue-grey-10">
                          {{ formatDate(data.equipment.calibration_due_date) }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="getDaysRemaining(data.equipment.calibration_due_date)"
                      class="days-badge"
                    >
                      อีก {{ getDaysRemaining(data.equipment.calibration_due_date) }} วัน
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Notes Card -->
          <q-card flat class="notes-card">
            <q-card-section class="q-pa-lg">
              <div class="row items-center q-mb-md">
                <q-icon name="notes" color="grey-7" size="18px" class="q-mr-sm" />
                <div class="text-subtitle2 text-weight-bold text-grey-7">
                  หมายเหตุ (NOTES/REMARKS)
                </div>
              </div>
              <div class="notes-content q-pa-md">
                {{ data.latestTask?.remarks || 'ไม่มีหมายเหตุเพิ่มเติม' }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { date } from 'quasar';

const route = useRoute();
const toolId = String(route.params.id);
const loading = ref(true);
const error = ref(false);

interface PublicStatusData {
  equipment: {
    id: number;
    name: string;
    model: string;
    serial_number: string;
    manufacturer: string;
    calibration_due_date: string;
    equipmentType?: { name: string };
    section?: { name: string };
  };
  latestTask: {
    createdAt: string;
    overall_result: string;
    remarks: string;
    technician?: { name: string };
  } | null;
  history: Array<{
    createdAt: string;
    overall_result: string;
    technician?: { name: string };
  }>;
}

const data = ref<PublicStatusData | null>(null);

onMounted(async () => {
  try {
    const res = await axios.get<PublicStatusData>(
      `http://localhost:3000/equipment/public-status/${toolId}`,
    );
    data.value = res.data;
  } catch (err) {
    console.error('Failed to fetch public status:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

function formatDate(d: string | Date | null | undefined) {
  if (!d) return '-';
  return date.formatDate(d, 'D MMM YYYY');
}

function getDaysRemaining(nextDue: string | undefined) {
  if (!nextDue) return null;
  const today = new Date();
  const due = new Date(nextDue);
  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}
</script>

<style scoped lang="scss">
.public-header {
  height: 60px;
  background: #a78bfa; // Matching reference purple
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tool-card {
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  .card-gradient-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(167, 139, 250, 0.1), transparent);
    pointer-events: none;
  }
}

.info-badge {
  background: rgba(167, 139, 250, 0.15);
  color: #7c3aed;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.tool-image-placeholder {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.details-list .q-item {
  padding: 10px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.05);
}

.history-card {
  border-radius: 20px;
}

.timeline {
  .timeline-item {
    position: relative;
    padding-bottom: 24px;

    &:last-child {
      padding-bottom: 0;
    }
  }

  .timeline-line {
    position: absolute;
    left: 4.5px;
    top: 10px;
    bottom: -14px;
    width: 1px;
    background: #e2e8f0;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: relative;
    z-index: 1;
  }

  .status-pill-small {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 10px;
    &.pass {
      background: #f0fdf4;
      color: #10b981;
    }
    &.fail {
      background: #fef2f2;
      color: #ef4444;
    }
  }
}

.status-card {
  border-radius: 20px;
}

.result-box {
  border-radius: 16px;

  &.bg-positive-light {
    background: #f0fdf4;
    border: 1px solid rgba(16, 185, 129, 0.1);
    .result-icon-bg {
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }
  }
  &.bg-negative-light {
    background: #fff1f2;
    border: 1px solid rgba(225, 29, 72, 0.1);
    .result-icon-bg {
      box-shadow: 0 2px 8px rgba(225, 29, 72, 0.2);
    }
  }

  .result-icon-bg {
    width: 44px;
    height: 44px;
    background: #ffffff;
    border-radius: 50%;
  }
}

.status-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.bordered-box {
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.next-due-item {
  background: #ffffff;
  border: 1px solid #f1f5f9;
}

.days-badge {
  background: #fdf2f8;
  color: #db2777;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
}

.notes-card {
  border-radius: 20px;

  .notes-content {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 12px;
    color: #92400e;
    font-size: 13.5px;
    line-height: 1.6;
  }
}

.lh-1 {
  line-height: 1.2;
}

.lh-2 {
  line-height: 1.8;
}
</style>
