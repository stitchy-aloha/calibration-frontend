<template>
  <q-card class="shadow-1 quick-actions-card text-white overflow-hidden " style="background-color:#9E79E0">
    <div class="absolute-top-left q-pa-md text-subtitle1 text-weight-bold">
      <q-icon name="bolt" size="xs" /> ทางลัด (Quick Actions)
    </div>

    <!-- Inner frosted card -->
    <q-card-section class="q-pt-xl q-px-md q-pb-md">
      <div class="inner-card q-pa-lg column flex-center">
            <div class="q-mb-md" style="position: relative; width: 64px; height: 64px;">
            <!-- พื้นหลังปุ่ม -->
            <div style="
                position: absolute; inset: 0;
                background: white;
                border-radius: 50%;
                opacity: 0.2;
            "></div>
            <!-- icon อยู่บนสุด ไม่โดน opacity -->
            <div class="flex flex-center" style="position: absolute; inset: 0;">
                <q-icon name="qr_code_scanner" size="40px" color="white" />
            </div>
            </div>
        <div class="text-h6 text-weight-bold text-white">สแกน QR Code</div>
        <div class="text-caption text-whiteasad">เพื่อดูข้อมูล</div>
      </div>
    </q-card-section>
  </q-card>
</template>
<style scoped>
.quick-actions-card {
  border-radius: 20px;
  min-width: 280px;
  position: relative;
}

.inner-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(4px);
}
</style>
