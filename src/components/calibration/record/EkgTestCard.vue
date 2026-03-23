<template>
  <div class="q-mb-lg">
    <div class="row items-center q-mb-md">
      <div class="section-title">{{ title || 'EKG' }}</div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="item in ekgItems" :key="item.id" class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="text-center overflow-hidden">
          <!-- Readonly: everything in one row -->
          <template v-if="readonly">
            <q-card-section class="q-pa-sm row items-center justify-between">
              <div class="row items-center">
                <q-icon
                  :name="item.status === 'fail' ? 'warning' : 'favorite'"
                  :color="
                    item.status === 'pass'
                      ? 'positive'
                      : item.status === 'fail'
                        ? 'negative'
                        : 'grey-4'
                  "
                  size="sm"
                  class="q-mr-sm"
                />
                <div class="text-weight-bold text-subtitle2">{{ item.label }}</div>
              </div>
              <span :class="item.status === 'pass' ? 'ekg-result--pass' : 'ekg-result--fail'">
                {{ item.status === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน' }}
              </span>
            </q-card-section>
          </template>

          <!-- Editable: icon+label on top, buttons below -->
          <template v-else>
            <q-card-section class="q-pa-sm row items-center justify-center">
              <q-icon
                :name="item.status === 'fail' ? 'warning' : 'favorite'"
                :color="
                  item.status === 'pass'
                    ? 'positive'
                    : item.status === 'fail'
                      ? 'negative'
                      : 'grey-4'
                "
                size="sm"
                class="q-mr-sm"
              />
              <div class="text-weight-bold text-subtitle2">{{ item.label }}</div>
            </q-card-section>

            <q-card-actions align="center" class="q-pa-sm q-gutter-sm">
              <span
                :class="[
                  'ekg-btn',
                  item.status === 'pass' ? 'ekg-btn--pass-active' : 'ekg-btn--pass-idle',
                ]"
                @click="item.status = 'pass'"
              >
                <q-icon name="check_circle" size="14px" class="q-mr-xs" />ผ่าน
              </span>
              <span
                :class="[
                  'ekg-btn',
                  item.status === 'fail' ? 'ekg-btn--fail-active' : 'ekg-btn--fail-idle',
                ]"
                @click="item.status = 'fail'"
              >
                <q-icon name="cancel" size="14px" class="q-mr-xs" />ไม่ผ่าน
              </span>
            </q-card-actions>
          </template>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EkgItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | null;
}

defineProps<{
  ekgItems: EkgItem[];
  title?: string;
  readonly?: boolean;
}>();
</script>

<style scoped lang="scss">
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  border-left: 4px solid $secondary;
  padding-left: 10px;
}

.ekg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &--pass-active {
    background: $positive;
    color: #fff;
    border-color: $positive;
  }

  &--pass-idle {
    background: #fff;
    color: #aaa;
    border-color: #ccc;
  }

  &--fail-active {
    background: $negative;
    color: #fff;
    border-color: $negative;
  }

  &--fail-idle {
    background: #fff;
    color: #aaa;
    border-color: #ccc;
  }
}

.ekg-result {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 0;

  &--pass {
    color: $positive;
  }

  &--fail {
    color: $negative;
  }
}
</style>
