<template>
  <div class="qualitative-block q-mb-md">
    <div class="row items-center q-mb-md">
      <div class="index-circle q-mr-md">{{ index }}</div>
      <div class="row q-gutter-x-md flex-grow">
        <div class="col">
          <label class="text-caption text-weight-bold">ชื่อพารามิเตอร์</label>
          <q-input
            :model-value="parameterName"
            @update:model-value="emit('update:parameterName', $event)"
            outlined
            dense
            bg-color="grey-1"
            class="q-mt-xs"
            full-width
          />
        </div>
        <div class="col">
          <label class="text-caption text-weight-bold">ประเภทเครื่องมือมาตรฐาน</label>
          <q-select
            :model-value="categoryId"
            @update:model-value="emit('update:categoryId', $event)"
            :options="categoryOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            outlined
            dense
            bg-color="grey-1"
            class="q-mt-xs"
            full-width
            placeholder="เลือกประเภท..."
          />
        </div>
      </div>
      <q-btn flat round dense icon="close" size="sm" color="grey-6" @click="emit('remove')" />
    </div>

    <div class="q-pl-md">
      <div class="row items-center q-mb-sm">
        <q-space />
        <q-btn
          flat
          dense
          icon="add_circle"
          color="primary-teal"
          size="md"
          class="q-ml-sm"
          @click="addTestItem"
          label="รายการทดสอบ"
        />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="(item, idx) in testItems" :key="idx" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="test-item-card">
            <q-btn
              flat
              round
              dense
              icon="close"
              size="xs"
              color="grey-4"
              class="absolute-top-right q-ma-xs z-top"
              @click="removeTestItem(idx)"
            />
            <div class="row q-pa-sm items-center">
              <div class="item-index q-mr-sm">{{ idx + 1 }}</div>
              <q-input
                :model-value="item.name"
                @update:model-value="updateItemName(idx, $event as string)"
                borderless
                dense
                placeholder="ระบุรายการ..."
                class="col"
                input-style="font-size: 13px"
              />
            </div>
            <!-- result buttons can remain local or be removed if purely for design in config -->
            <div class="row border-top-dashed session-buttons">
              <q-btn
                flat
                label="ผ่าน"
                class="col btn-pass"
                :class="{ 'active-pass': item.result === 'pass' }"
                @click="
                  item.result = 'pass';
                  updateItems([...testItems]);
                "
              />
              <div class="vertical-divider"></div>
              <q-btn
                flat
                label="ไม่ผ่าน"
                class="col btn-fail"
                :class="{ 'active-fail': item.result === 'fail' }"
                @click="
                  item.result = 'fail';
                  updateItems([...testItems]);
                "
              />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface TestItem {
  name: string;
  result: 'pass' | 'fail' | null;
}

interface Props {
  index: number;
  parameterName: string;
  testItems: TestItem[];
  categoryId?: number | undefined;
  categoryOptions: { id: number; name: string }[];
}

const props = defineProps<Props>();
const emit = defineEmits([
  'remove',
  'update:parameterName',
  'update:testItems',
  'update:categoryId',
]);

function updateItems(newItems: TestItem[]) {
  emit('update:testItems', newItems);
}

function addTestItem() {
  updateItems([...props.testItems, { name: '', result: null }]);
}

function removeTestItem(idx: number) {
  updateItems(props.testItems.filter((_, i) => i !== idx));
}

function updateItemName(idx: number, name: string) {
  const newItems = props.testItems.map((item, i) => (i === idx ? { ...item, name } : item));
  updateItems(newItems);
}
</script>
<style scoped lang="scss">
.qualitative-block {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
}

.index-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $secondary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.text-primary-teal {
  color: $primary;
}

.test-item-card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.item-index {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: $secondary;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border-top-dashed {
  border-top: 1px dashed #e0e0e0;
}

.session-buttons {
  .btn-pass,
  .btn-fail {
    font-size: 13px;
    height: 36px;
    border-radius: 0;
    color: #999;
  }

  .active-pass {
    background: rgba($primary, 0.08);
    color: $primary;
    font-weight: 600;
  }

  .active-fail {
    background: #fff5f5;
    color: #e53935;
    font-weight: 600;
  }
}

.vertical-divider {
  width: 1px;
  border-right: 1px dashed #e0e0e0;
}

.flex-grow {
  flex-grow: 1;
}
</style>
