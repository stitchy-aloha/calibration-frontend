<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">จัดการรายการตรวจสภาพภายนอก</div>
    <div class="text-caption text-grey-6 text-subtitle1">
      ตั้งค่ารายการตรวจสอบสภาพภายนอก สำหรับใช้ในการทำรายงาน
    </div>

    <div class="row justify-end q-mb-md">
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="เพิ่มหมวดหมู่ใหม่"
        @click="showAddCategoryDialog = true"
        class="text-weight-bold"
      />
    </div>

    <!-- Category Lists -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="categories.length === 0" class="flex flex-center q-py-xl text-grey-6">
      ไม่มีข้อมูลหมวดหมู่
    </div>

    <div v-else class="column gap-md">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-card border-all bg-white q-pa-md shadow-sm"
      >
        <!-- Category Title & Actions -->
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center gap-sm">
            <template v-if="editingCategoryId === cat.id">
              <q-input
                v-model="editCategoryName"
                dense
                outlined
                square
                style="min-width: 250px"
                class="bg-white"
                placeholder="ชื่อหมวดหมู่"
                :rules="[(val) => !!val || 'กรุณากรอกชื่อหมวดหมู่']"
                hide-bottom-space
              />
              <q-input
                v-model.number="editCategoryOrder"
                type="number"
                dense
                outlined
                square
                style="width: 80px"
                class="bg-white"
                label="ลำดับ"
                hide-bottom-space
              />
              <q-btn
                flat
                round
                color="positive"
                icon="check"
                dense
                @click="saveCategoryEdit(cat.id)"
              />
              <q-btn flat round color="negative" icon="close" dense @click="cancelCategoryEdit" />
            </template>
            <template v-else>
              <span class="text-subtitle1 text-weight-bold text-grey-9">
                {{ cat.name }}
              </span>
              <span class="text-caption text-grey-5">(ลำดับ: {{ cat.display_order }})</span>
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                dense
                @click="startCategoryEdit(cat)"
              >
                <q-tooltip>แก้ไขหมวดหมู่</q-tooltip>
              </q-btn>
            </template>
          </div>
          <div>
            <q-btn
              flat
              dense
              color="negative"
              icon="delete"
              label="ลบหมวดหมู่"
              size="sm"
              class="text-weight-bold"
              @click="confirmDeleteCategory(cat)"
            />
          </div>
        </div>

        <!-- Items Table -->
        <q-table
          :rows="cat.items"
          :columns="itemColumns"
          row-key="id"
          flat
          bordered
          binary-state-sort
          hide-pagination
          :rows-per-page-options="[0]"
          class="checklist-table"
          no-data-label="ไม่มีรายการตรวจเช็คในหมวดหมู่นี้"
        >
          <!-- Custom header -->
          <template #header="props">
            <q-tr :props="props" class="table-header-row">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-th">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Custom body rows -->
          <template #body="props">
            <q-tr
              :props="props"
              class="table-body-row"
              :class="{ 'editing-row': editingItemId === props.row.id }"
            >
              <!-- Display Order -->
              <q-td key="display_order" :props="props" class="text-center">
                <template v-if="editingItemId === props.row.id">
                  <q-input
                    v-model.number="editItemOrder"
                    type="number"
                    dense
                    outlined
                    square
                    class="text-center bg-white"
                    style="width: 70px; margin: 0 auto"
                    hide-bottom-space
                  />
                </template>
                <template v-else>
                  {{ props.row.display_order }}
                </template>
              </q-td>

              <!-- Description -->
              <q-td key="description" :props="props">
                <template v-if="editingItemId === props.row.id">
                  <q-input
                    v-model="editItemDescription"
                    dense
                    outlined
                    square
                    class="full-width bg-white"
                    placeholder="ข้อความรายละเอียด"
                    :rules="[(val) => !!val || 'กรุณากรอกรายละเอียด']"
                    hide-bottom-space
                  />
                </template>
                <template v-else>
                  {{ props.row.description }}
                </template>
              </q-td>

              <!-- Actions -->
              <q-td key="actions" :props="props" class="text-center">
                <template v-if="editingItemId === props.row.id">
                  <div class="row items-center justify-center gap-xs">
                    <q-btn
                      flat
                      round
                      color="positive"
                      icon="check"
                      dense
                      size="sm"
                      @click="saveItemEdit(props.row.id)"
                    >
                      <q-tooltip>บันทึก</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="close"
                      dense
                      size="sm"
                      @click="cancelItemEdit"
                    >
                      <q-tooltip>ยกเลิก</q-tooltip>
                    </q-btn>
                  </div>
                </template>
                <template v-else>
                  <div class="row items-center justify-center gap-xs">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      dense
                      size="sm"
                      @click="startItemEdit(props.row)"
                    >
                      <q-tooltip>แก้ไข</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      dense
                      size="sm"
                      @click="confirmDeleteItem(props.row)"
                    >
                      <q-tooltip>ลบ</q-tooltip>
                    </q-btn>
                  </div>
                </template>
              </q-td>
            </q-tr>
          </template>

          <!-- Add New Item Row -->
          <template #bottom-row>
            <q-tr class="bg-grey-2">
              <q-td class="text-center text-weight-bold text-grey-7">
                {{ cat.newItem.display_order }}
              </q-td>
              <q-td>
                <q-input
                  v-model="cat.newItem.description"
                  dense
                  outlined
                  square
                  class="full-width bg-white"
                  placeholder="เพิ่มรายการตรวจใหม่..."
                  hide-bottom-space
                  @keyup.enter="handleAddItem(cat.id)"
                />
              </q-td>
              <q-td class="text-center">
                <q-btn
                  unelevated
                  color="primary"
                  icon="add"
                  label="เพิ่มรายการ"
                  size="sm"
                  class="text-weight-bold"
                  @click="handleAddItem(cat.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add Category Dialog -->
    <q-dialog v-model="showAddCategoryDialog" persistent>
      <q-card square class="border-all" style="min-width: 400px">
        <q-card-section
          class="bg-grey-2 q-py-sm q-px-md row items-center justify-between border-bottom"
        >
          <div class="text-subtitle2 text-weight-bold text-grey-9">
            เพิ่มหมวดหมู่ PM Checklist ใหม่
          </div>
          <q-btn flat round dense icon="close" color="grey-6" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md column gap-md">
          <q-input
            v-model="newCategoryName"
            label="ชื่อหมวดหมู่ (เช่น ระบบไฟฟ้า, สภาพทั่วไป)"
            outlined
            square
            dense
            :rules="[(val) => !!val || 'กรุณากรอกชื่อหมวดหมู่']"
            ref="newCategoryNameRef"
          />
          <q-input
            v-model.number="newCategoryOrder"
            label="ลำดับการแสดงผล"
            type="number"
            outlined
            square
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md border-top bg-grey-1">
          <q-btn flat label="ยกเลิก" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="บันทึก"
            color="primary"
            class="text-weight-bold"
            @click="handleAddCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Delete Category Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteCategoryDialog"
      title="ยืนยันการลบหมวดหมู่"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่และรายการตรวจเช็คทั้งหมดภายใต้หมวดหมู่นี้?"
      :item-name="deletingCategory?.name"
      @confirm="doDeleteCategory"
    />

    <!-- Confirm Delete Item Dialog -->
    <ConfirmDeleteDialog
      v-model="deleteItemDialog"
      title="ยืนยันการลบรายการตรวจ"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการตรวจนี้?"
      :item-name="deletingItem?.description"
      @confirm="doDeleteItem"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { pmService } from 'src/services/pm.service';
import type { ChecklistCategoryApi, ChecklistItemApi } from 'src/services/pm.service';
import ConfirmDeleteDialog from 'src/components/common/ConfirmDeleteDialog.vue';

interface ExtendedCategory extends ChecklistCategoryApi {
  newItem: {
    description: string;
    display_order: number;
  };
}

const itemColumns: QTableProps['columns'] = [
  {
    name: 'display_order',
    label: 'ลำดับแสดงผล',
    field: 'display_order',
    align: 'center',
    style: 'width: 80px',
  },
  {
    name: 'description',
    label: 'รายละเอียดรายการตรวจ',
    field: 'description',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'การจัดการ',
    field: 'id',
    align: 'center',
    style: 'width: 150px',
  },
];

const $q = useQuasar();
const loading = ref(false);
const categories = ref<ExtendedCategory[]>([]);

// Edit Category State
const editingCategoryId = ref<number | null>(null);
const editCategoryName = ref('');
const editCategoryOrder = ref(0);

// Edit Item State
const editingItemId = ref<number | null>(null);
const editItemDescription = ref('');
const editItemOrder = ref(0);

// New Category Dialog State
const showAddCategoryDialog = ref(false);
const newCategoryName = ref('');
const newCategoryOrder = ref(1);
const newCategoryNameRef = ref<HTMLInputElement | null>(null);

// Delete Category State
const deleteCategoryDialog = ref(false);
const deletingCategory = ref<ChecklistCategoryApi | null>(null);

// Delete Item State
const deleteItemDialog = ref(false);
const deletingItem = ref<ChecklistItemApi | null>(null);

async function loadData() {
  loading.value = true;
  try {
    const data = await pmService.getCategories();
    categories.value = data.map((cat) => {
      const maxOrder = cat.items.reduce((max, item) => Math.max(max, item.display_order), 0);
      return {
        ...cat,
        newItem: {
          description: '',
          display_order: maxOrder + 1,
        },
      };
    });
  } catch (err: unknown) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'ไม่สามารถโหลดข้อมูล PM Checklist ได้',
    });
  } finally {
    loading.value = false;
  }
}

// ── Category CRUD ───────────────────────────────────────────────────────

function startCategoryEdit(cat: ChecklistCategoryApi) {
  editingCategoryId.value = cat.id;
  editCategoryName.value = cat.name;
  editCategoryOrder.value = cat.display_order;
}

function cancelCategoryEdit() {
  editingCategoryId.value = null;
}

async function saveCategoryEdit(id: number) {
  if (!editCategoryName.value.trim()) {
    $q.notify({ type: 'warning', message: 'กรุณากรอกชื่อหมวดหมู่' });
    return;
  }
  try {
    await pmService.updateCategory(id, {
      name: editCategoryName.value,
      display_order: editCategoryOrder.value,
    });
    $q.notify({ type: 'positive', message: 'แก้ไขหมวดหมู่สำเร็จ' });
    editingCategoryId.value = null;
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'แก้ไขหมวดหมู่ล้มเหลว' });
  }
}

async function handleAddCategory() {
  if (!newCategoryName.value.trim()) {
    $q.notify({ type: 'warning', message: 'กรุณากรอกชื่อหมวดหมู่' });
    return;
  }
  try {
    await pmService.createCategory({
      name: newCategoryName.value,
      display_order: newCategoryOrder.value,
    });
    $q.notify({ type: 'positive', message: 'เพิ่มหมวดหมู่สำเร็จ' });
    showAddCategoryDialog.value = false;
    newCategoryName.value = '';
    newCategoryOrder.value = categories.value.length + 1;
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'เพิ่มหมวดหมู่ล้มเหลว' });
  }
}

function confirmDeleteCategory(cat: ChecklistCategoryApi) {
  deletingCategory.value = cat;
  deleteCategoryDialog.value = true;
}

async function doDeleteCategory() {
  if (!deletingCategory.value) return;
  try {
    await pmService.deleteCategory(deletingCategory.value.id);
    $q.notify({ type: 'positive', message: 'ลบหมวดหมู่เรียบร้อยแล้ว' });
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'ไม่สามารถลบหมวดหมู่ได้' });
  } finally {
    deleteCategoryDialog.value = false;
    deletingCategory.value = null;
  }
}

// ── Item CRUD ───────────────────────────────────────────────────────────

function startItemEdit(item: ChecklistItemApi) {
  editingItemId.value = item.id;
  editItemDescription.value = item.description;
  editItemOrder.value = item.display_order;
}

function cancelItemEdit() {
  editingItemId.value = null;
}

async function saveItemEdit(id: number) {
  if (!editItemDescription.value.trim()) {
    $q.notify({ type: 'warning', message: 'กรุณากรอกรายละเอียดรายการตรวจ' });
    return;
  }
  try {
    await pmService.updateItem(id, {
      description: editItemDescription.value,
      display_order: editItemOrder.value,
    });
    $q.notify({ type: 'positive', message: 'แก้ไขรายการตรวจสำเร็จ' });
    editingItemId.value = null;
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'แก้ไขรายการตรวจล้มเหลว' });
  }
}

async function handleAddItem(categoryId: number) {
  const cat = categories.value.find((c) => c.id === categoryId);
  if (!cat || !cat.newItem.description.trim()) {
    $q.notify({ type: 'warning', message: 'กรุณากรอกข้อความเพื่อเพิ่มรายการตรวจ' });
    return;
  }
  try {
    await pmService.createItem({
      category_id: categoryId,
      description: cat.newItem.description,
      display_order: cat.newItem.display_order,
    });
    $q.notify({ type: 'positive', message: 'เพิ่มรายการตรวจสำเร็จ' });
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'เพิ่มรายการตรวจล้มเหลว' });
  }
}

function confirmDeleteItem(item: ChecklistItemApi) {
  deletingItem.value = item;
  deleteItemDialog.value = true;
}

async function doDeleteItem() {
  if (!deletingItem.value) return;
  try {
    await pmService.deleteItem(deletingItem.value.id);
    $q.notify({ type: 'positive', message: 'ลบรายการตรวจเรียบร้อยแล้ว' });
    await loadData();
  } catch (err: unknown) {
    console.error(err);
    $q.notify({ type: 'negative', message: 'ไม่สามารถลบรายการตรวจได้' });
  } finally {
    deleteItemDialog.value = false;
    deletingItem.value = null;
  }
}

onMounted(() => {
  void loadData();
});
</script>

<style scoped lang="scss">
.pm-checklist-page {
  font-family: 'Sarabun', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  border-radius: 8px;
}

.checklist-table {
  border-radius: 8px !important;
  overflow: hidden;

  :deep(.table-header-row) {
    background: $secondary;
  }

  :deep(.table-th) {
    color: #fff !important;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.2px;
    white-space: nowrap;
    padding: 12px 16px;
  }

  :deep(.table-body-row) {
    transition: background 0.12s ease;

    td {
      padding: 12px 16px;
      font-size: 13.5px;
    }

    &:hover td {
      background: #fafbff !important;
    }
  }
}

.border-all {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.gap-sm {
  gap: 8px;
}

.gap-md {
  gap: 16px;
}

.editing-row {
  :deep(td) {
    background-color: #e3f2fd !important;
  }
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
