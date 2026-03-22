<template>
  <q-card class="dialog-card">
    <!-- Header -->
    <q-card-section class="dialog-header">
      <div class="row items-center">
        <q-icon name="edit_note" size="24px" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bold">
          {{ isEdit ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มข้อมูลผู้ใช้งาน' }}
        </span>
      </div>
      <q-btn flat round dense icon="close" color="white" @click="$emit('close')" />
    </q-card-section>

    <!-- Form -->
    <q-card-section class="q-pa-lg">
      <q-form @submit.prevent="onSubmit" class="form-grid">
        <!-- Row 1 -->
        <div class="form-field">
          <label class="field-label">รหัสพนักงาน <span class="required">*</span></label>
          <q-input
            v-model="form.username"
            outlined
            dense
            placeholder="ระบุรหัสพนักงาน"
            :rules="[(v) => !!v || 'กรุณากรอกรหัสพนักงาน']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">ชื่อ-นามสกุล <span class="required">*</span></label>
          <q-input
            v-model="form.name"
            outlined
            dense
            placeholder="ระบุชื่อ-นามสกุล"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อ-นามสกุล']"
          />
        </div>

        <!-- Row 2 -->
        <div class="form-field">
          <label class="field-label">อีเมล <span class="required">*</span></label>
          <q-input
            v-model="form.email"
            outlined
            dense
            placeholder="ระบุอีเมล"
            type="email"
            :rules="[(v) => !!v || 'กรุณากรอกอีเมล']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">รหัสผ่าน <span v-if="!isEdit" class="required">*</span></label>
          <q-input
            v-model="form.password"
            outlined
            dense
            placeholder="ระบุรหัสผ่าน"
            :type="showPwd ? 'text' : 'password'"
            :rules="[(v) => isEdit || !!v || 'กรุณากรอกรหัสผ่าน']"
          >
            <template #append>
              <q-icon
                :name="showPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer text-grey-5"
                @click="showPwd = !showPwd"
              />
            </template>
          </q-input>
        </div>

        <!-- Row 3 -->
        <div class="form-field">
          <label class="field-label">เบอร์โทรศัพท์ <span class="required">*</span></label>
          <q-input
            v-model="form.tel"
            outlined
            dense
            placeholder="ระบุเบอร์โทรศัพท์"
            mask="##########"
            :rules="[(v) => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
          />
        </div>
        <div class="form-field">
          <label class="field-label">ตำแหน่ง <span class="required">*</span></label>
          <q-select
            v-model="form.roleId"
            :options="roleOptions"
            outlined
            dense
            emit-value
            map-options
            placeholder="เลือกตำแหน่ง"
            :rules="[(v) => !!v || 'กรุณาเลือกตำแหน่ง']"
          />
        </div>

        <!-- Row 4 -->
        <div class="form-field">
          <label class="field-label">รูปภาพ</label>
          <q-file v-model="form.image" outlined dense accept="image/*" label="อัปโหลดรูป">
            <template #prepend>
              <q-icon name="cloud_upload" color="grey-5" />
            </template>
          </q-file>
        </div>
        <div class="form-field">
          <label class="field-label">LINE User ID</label>
          <q-input
            v-model="form.lineUserId"
            outlined
            dense
            placeholder="รหัส User ID (U...)"
            hint="พิมพ์ 'ID' หาบอทเพื่อดูรหัสของคุณ"
          >
            <template #prepend>
              <q-icon name="chat" color="green-6" />
            </template>
          </q-input>
        </div>

        <!-- Row 5 — Signature Pad (full width) -->
        <div class="form-field full-width">
          <label class="field-label">ลายเซ็นดิจิทัล <span class="required">*</span></label>
          <div class="signature-container">
            <div v-if="hasExistingSignature && !isResettingSignature" class="existing-sig">
              <img :src="getImageUrl(props.user?.signatureUrl)" alt="Signature" />
              <q-btn
                flat
                round
                dense
                icon="refresh"
                color="primary"
                class="reset-sig-btn"
                @click="resetSignature"
              >
                <q-tooltip>เซ็นใหม่</q-tooltip>
              </q-btn>
            </div>
            <div v-else class="sig-pad-wrapper">
              <canvas
                ref="sigCanvas"
                class="sig-canvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart.prevent="startDrawing"
                @touchmove.prevent="draw"
                @touchend.prevent="stopDrawing"
              ></canvas>
              <div class="sig-actions">
                <q-btn flat dense icon="delete" label="ล้าง" color="grey-7" @click="clearSignature" />
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions full-width">
          <q-btn flat label="ยกเลิก" class="btn-cancel" @click="$emit('close')" />
          <q-btn
            unelevated
            type="submit"
            icon="save"
            label="บันทึก"
            class="btn-save"
            :loading="saving"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore, type User } from 'src/stores/user';

const props = defineProps<{ user: User | null }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const $q = useQuasar();
const store = useUserStore();
const apiBase = import.meta.env.VITE_API_BASE_URL as string;

const isEdit = computed(() => !!props.user);
const saving = ref(false);
const showPwd = ref(false);

const sigCanvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const hasDrawn = ref(false);
const hasExistingSignature = computed(() => !!props.user?.signatureUrl);
const isResettingSignature = ref(false);

function getImageUrl(path: string | null | undefined) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${apiBase}${path}`;
}

function resetSignature() {
  isResettingSignature.value = true;
  hasDrawn.value = false;
  // Canvas won't be available until next tick when v-if updates
}

/* ── Signature Drawing ── */
let ctx: CanvasRenderingContext2D | null = null;

onMounted(() => {
  initCanvas();
});

watch([sigCanvas, isResettingSignature], () => {
  if (sigCanvas.value) {
    initCanvas();
  }
});

function initCanvas() {
  const canvas = sigCanvas.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (ctx) {
    // Set canvas internal size to match displayed size
    canvas.width = canvas.offsetWidth || 0;
    canvas.height = canvas.offsetHeight || 0;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }
}

function getPos(e: MouseEvent | TouchEvent) {
  const canvas = sigCanvas.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
  const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function startDrawing(e: MouseEvent | TouchEvent) {
  isDrawing.value = true;
  hasDrawn.value = true;
  const { x, y } = getPos(e);
  ctx?.beginPath();
  ctx?.moveTo(x, y);
}

function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return;
  const { x, y } = getPos(e);
  ctx?.lineTo(x, y);
  ctx?.stroke();
}

function stopDrawing() {
  isDrawing.value = false;
  ctx?.closePath();
}

function clearSignature() {
  if (!sigCanvas.value || !ctx) return;
  ctx.clearRect(0, 0, sigCanvas.value.width, sigCanvas.value.height);
  hasDrawn.value = false;
}

const form = ref({
  username: '',
  name: '',
  email: '',
  tel: '',
  roleId: null as number | null,
  password: '',
  image: null as File | null,
  lineUserId: '',
});

watch(
  () => props.user,
  (u) => {
    if (u) {
      form.value = {
        username: u.username,
        name: u.name,
        email: u.email,
        tel: u.tel,
        roleId: u.roleId,
        password: '',
        image: null,
        lineUserId: u.lineUserId || '',
      };
    } else {
      form.value = {
        username: '',
        name: '',
        email: '',
        tel: '',
        roleId: null,
        password: '',
        image: null,
        lineUserId: '',
      };
    }
  },
  { immediate: true },
);

async function getSignatureBlob(): Promise<Blob | null> {
  if (!sigCanvas.value || !hasDrawn.value) return null;
  return new Promise((resolve) => {
    sigCanvas.value?.toBlob((blob) => resolve(blob), 'image/png');
  });
}

const roleOptions = [
  { label: 'ผู้ดูแลระบบ', value: 1 },
  { label: 'เจ้าหน้าที่สอบเทียบ', value: 2 },
  { label: 'หัวหน้าแผนก', value: 3 },
  { label: 'ผู้อำนวยการ', value: 4 },
];

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append('username', form.value.username);
  fd.append('name', form.value.name);
  fd.append('email', form.value.email);
  fd.append('tel', form.value.tel);
  if (form.value.roleId) fd.append('roleId', String(form.value.roleId));
  if (form.value.password) fd.append('password', form.value.password);
  if (form.value.image) fd.append('image', form.value.image);
  if (form.value.lineUserId) fd.append('lineUserId', form.value.lineUserId);
  return fd;
}

async function onSubmit() {
  if (!hasExistingSignature.value && !hasDrawn.value) {
    $q.notify({ color: 'warning', message: 'กรุณาเซ็นชื่อ', icon: 'edit' });
    return;
  }

  saving.value = true;
  try {
    const fd = buildFormData();

    // Add signature if newly drawn
    if (hasDrawn.value) {
      const sigBlob = await getSignatureBlob();
      if (sigBlob) {
        fd.append('signature', sigBlob, 'signature.png');
      }
    }

    if (isEdit.value && props.user) {
      await store.updateUser(props.user.id, fd);
      $q.notify({ color: 'positive', message: 'แก้ไขสำเร็จ', icon: 'check_circle' });
    } else {
      await store.createUser(fd);
      $q.notify({ color: 'positive', message: 'เพิ่มผู้ใช้งานสำเร็จ', icon: 'check_circle' });
    }
    emit('saved');
  } catch {
    $q.notify({ color: 'negative', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่', icon: 'error' });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.dialog-card {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 4px;
}

.required {
  color: $negative;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  border: 1px solid #ddd;
  border-radius: 10px;
  color: #666;
  font-weight: 500;
  padding: 6px 20px;
}

.btn-save {
  background: $secondary !important;
  color: #fff !important;
  border-radius: 10px;
  font-weight: 600;
  padding: 6px 24px;
}

:deep(.q-field__control) {
  border-radius: 10px;
}

.signature-container {
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fdfdfd;
  height: 180px;
  position: relative;
  overflow: hidden;
}

.existing-sig {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }

  .reset-sig-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.sig-pad-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.sig-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
}

.sig-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
