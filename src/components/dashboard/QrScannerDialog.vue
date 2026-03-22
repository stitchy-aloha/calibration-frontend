<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useRouter } from 'vue-router';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const html5QrCode = ref<Html5Qrcode | null>(null);
const scannerId = 'qr-reader-' + Math.random().toString(36).substr(2, 9);
const isScanning = ref(false);
const errorMsg = ref<string | null>(null);

watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      void startScanner();
    } else {
      void stopScanner();
    }
  },
  { immediate: true },
);

async function startScanner() {
  try {
    // Ensure cleanup of previous instance if any
    if (html5QrCode.value) {
      await stopScanner();
    }

    html5QrCode.value = new Html5Qrcode(scannerId, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    await html5QrCode.value.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        // Success
        void handleScanSuccess(decodedText);
      },
      () => {
        // Error (silent)
      },
    );
    isScanning.value = true;
    errorMsg.value = null;
  } catch (err: unknown) {
    console.error('Failed to start scanner:', err);
    errorMsg.value = 'ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบสิทธิ์การใช้งาน';
    isScanning.value = false;
  }
}

async function stopScanner() {
  if (html5QrCode.value && isScanning.value) {
    try {
      await html5QrCode.value.stop();
      isScanning.value = false;
    } catch (err) {
      console.error('Failed to stop scanner:', err);
    }
  }
}

async function handleScanSuccess(decodedText: string) {
  // Check if it's our URL format: http://.../status/ID
  const match = decodedText.match(/\/status\/(\d+)/);
  if (match && match[1]) {
    await stopScanner();
    emit('update:modelValue', false);
    await router.push(`/status/${match[1]}`);
  } else if (/^\d+$/.test(decodedText)) {
    // If it's just a numeric ID
    await stopScanner();
    emit('update:modelValue', false);
    await router.push(`/status/${decodedText}`);
  } else {
    // Other QR code
    console.log('Scanned non-status QR:', decodedText);
  }
}

onUnmounted(() => {
  void stopScanner();
});

async function handleClose() {
  await stopScanner();
  emit('update:modelValue', false);
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="handleClose" persistent>
    <q-card class="scanner-card overflow-hidden">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold text-blue-grey-9">สแกน QR Code</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="handleClose" />
      </q-card-section>

      <q-card-section class="q-pa-md column items-center">
        <div class="scanner-container relative-position">
          <div :id="scannerId" class="full-width full-height"></div>

          <!-- Overlay when not scanning/error -->
          <div
            v-if="errorMsg"
            class="absolute-full flex flex-center bg-grey-2 text-center q-pa-lg text-negative"
          >
            <div>
              <q-icon name="videocam_off" size="48px" class="q-mb-md" />
              <div>{{ errorMsg }}</div>
            </div>
          </div>

          <!-- Scanning decoration line -->
          <div v-if="isScanning" class="scan-line"></div>
        </div>

        <div class="q-mt-lg text-center">
          <div class="text-subtitle2 text-grey-8">วาง QR Code ให้อยู่ในกรอบเพื่อเริ่มสแกน</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            ระบบจะนำท่านไปยังหน้าสถานะเครื่องมืออัตโนมัติ
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg no-print">
        <q-btn outline rounded label="ยกเลิก" color="grey-7" class="q-px-xl" @click="handleClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.scanner-card {
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
}

.scanner-container {
  width: 320px;
  height: 320px;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  border: 4px solid #f1f5f9;

  #qr-reader {
    border: none !important;
  }
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: scan 2s linear infinite;
  z-index: 10;
}

@keyframes scan {
  from {
    top: 10%;
  }
  to {
    top: 90%;
  }
}

/* Override html5-qrcode styles */
:deep(#qr-reader__dashboard) {
  display: none !important;
}
:deep(video) {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}
</style>
