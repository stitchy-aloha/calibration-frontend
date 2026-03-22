<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="qr-card q-pa-lg">
      <div class="column items-center">
        <div class="text-h6 text-weight-bold text-blue-grey-9 q-mb-lg">QR Code ประจำเครื่องมือ</div>

        <!-- QR Code Display Area -->
        <div class="qr-container q-mb-xl">
          <div class="qr-frame">
            <div class="qr-bg">
              <img :src="qrImageUrl" alt="QR Code" class="qr-image" />
            </div>
            <!-- Brackets decoration -->
            <div class="bracket top-left"></div>
            <div class="bracket top-right"></div>
            <div class="bracket bottom-left"></div>
            <div class="bracket bottom-right"></div>
          </div>
        </div>

        <!-- Info Table -->
        <q-list class="info-list full-width q-mb-lg">
          <q-item class="info-item">
            <q-item-section>
              <div class="row no-wrap items-center full-width">
                <div class="col-7 text-grey-7">รหัสเครื่องมือ (Asset ID)</div>
                <div class="col-5 text-right text-weight-bolder text-blue-grey-10">
                  {{ tool.deviceCode }}
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-separator inset class="q-mx-md opacity-20" />
          <q-item class="info-item">
            <q-item-section>
              <div class="row no-wrap items-center">
                <div class="col-7 text-grey-7">ชื่อเครื่องมือ (Name)</div>
                <div class="col-5 text-right text-weight-bolder text-blue-grey-10">
                  {{ tool.deviceName }}
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-separator inset class="q-mx-md opacity-20" />
          <q-item class="info-item">
            <q-item-section>
              <div class="row no-wrap items-center">
                <div class="col-7 text-grey-7">วันสอบเทียบ (Cal. Date)</div>
                <div class="col-5 text-right text-weight-bolder text-blue-grey-10">
                  {{ tool.date }}
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Actions -->
        <div class="column full-width q-gutter-y-sm no-print">
          <q-btn
            unelevated
            color="primary"
            class="full-width print-btn q-py-md text-weight-bold"
            @click="handlePrint"
          >
            <q-icon name="print" left size="20px" />
            พิมพ์ QR Code
          </q-btn>
          <q-btn
            flat
            no-caps
            label="ปิดหน้าต่าง"
            class="full-width close-btn text-grey-6"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  tool: {
    id: number;
    taskId: number;
    deviceName: string;
    deviceCode: string;
    date: string;
  };
}>();

const emit = defineEmits(['update:modelValue']);

const qrUrl = `${window.location.origin}/status/${props.tool.id}`;
const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  qrUrl,
)}`;

function handlePrint() {
  window.print();
}
</script>

<style scoped lang="scss">
.qr-card {
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  background: #ffffff;
}

.status-icon-wrapper {
  background: #f0fdf4;
  border-radius: 50%;
  padding: 4px;
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-frame {
  position: relative;
  padding: 24px;

  .qr-bg {
    background: #e5e7eb;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .qr-image {
    width: 130px;
    height: 130px;
    mix-blend-mode: multiply;
  }

  /* Bracket corners */
  .bracket {
    position: absolute;
    width: 25px;
    height: 25px;
    border: 2px solid #c7d2fe;
    pointer-events: none;

    &.top-left {
      top: 0;
      left: 0;
      border-right: none;
      border-bottom: none;
      border-top-left-radius: 12px;
    }
    &.top-right {
      top: 0;
      right: 0;
      border-left: none;
      border-bottom: none;
      border-top-right-radius: 12px;
    }
    &.bottom-left {
      bottom: 0;
      left: 0;
      border-right: none;
      border-top: none;
      border-bottom-left-radius: 12px;
    }
    &.bottom-right {
      bottom: 0;
      right: 0;
      border-left: none;
      border-top: none;
      border-bottom-right-radius: 12px;
    }
  }
}

.info-list {
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;

  .info-item {
    font-size: 13.5px;
    min-height: 48px;
  }
}

.print-btn {
  border-radius: 12px;
  font-size: 15px;
  background: #a78bfa !important; // Custom purple shade from image
}

.close-btn {
  font-size: 15px;
  font-weight: 500;
}

.opacity-20 {
  opacity: 0.1;
}

@media print {
  .no-print {
    display: none !important;
  }
  .qr-card {
    box-shadow: none !important;
    max-width: none;
  }
}
</style>
