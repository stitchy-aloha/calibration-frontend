import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import type { TaskApi } from 'src/services/pm.service';

export interface ApprovalEvent {
  id: string;
  taskId: number;
  toolName: string;
  toolCode: string;
  location: string;
  calDate: string;
  result: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useApprovalsStore = defineStore('approvals', () => {
  const approvals = ref<ApprovalEvent[]>([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const selectedType = ref('ทั้งหมด');

  const typeOptions = [
    { label: 'ทั้งหมด', value: 'ทั้งหมด' },
    { label: 'รอดำเนินการ', value: 'pending' },
    { label: 'อนุมัติแล้ว', value: 'approved' },
    { label: 'ปฏิเสธ', value: 'rejected' },
  ];

  async function fetchApprovals() {
    loading.value = true;
    try {
      const res = await api.get<TaskApi[]>('/pm-task');
      // Only show tasks that have been submitted (PendingApproval, Approved, Rejected)
      // 'Pending' means calibration hasn't been done yet — hide those
      const submitted = res.data.filter((task) =>
        ['PendingApproval', 'Approved', 'Rejected'].includes(task.status),
      );
      approvals.value = submitted.map((task) => ({
        id: task.pm_no || `CAL-${task.id}`,
        taskId: task.id,
        toolName: task.equipment?.name || 'Unknown',
        toolCode: task.equipment?.asset_code || '-',
        location: '-',
        calDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString('th-TH') : '-',
        result: task.overall_result === 'Pass' ? 'ผ่าน' : task.overall_result === 'Fail' ? 'ไม่ผ่าน' : '-',
        status: task.status === 'PendingApproval' ? 'pending' :
                task.status === 'Approved' ? 'approved' :
                task.status === 'Rejected' ? 'rejected' : 'pending',
      }));
    } catch (error) {
      console.error('fetchApprovals error:', error);
    } finally {
      loading.value = false;
    }
  }

  const filteredApprovals = computed(() => {
    let result = approvals.value;

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.toolName.toLowerCase().includes(q) ||
          a.toolCode.toLowerCase().includes(q),
      );
    }

    if (selectedType.value !== 'ทั้งหมด') {
      result = result.filter((a) => a.status === selectedType.value);
    }

    return result;
  });

  async function approveEvent(taskId: number, approverId: number = 1) {
    try {
      await api.patch(`/pm-task/${taskId}/approve`, {
        approver_id: approverId,
        decision: 'Approve',
        remarks: 'Approved via frontend',
      });
      await fetchApprovals();
      return true;
    } catch (error) {
      console.error('Approve Error:', error);
      throw error;
    }
  }

  async function rejectEvent(taskId: number, remarks: string, approverId: number = 1) {
    try {
      await api.patch(`/pm-task/${taskId}/approve`, {
        approver_id: approverId,
        decision: 'Reject',
        remarks,
      });
      await fetchApprovals();
      return true;
    } catch (error) {
      console.error('Reject Error:', error);
      throw error;
    }
  }

  return {
    approvals,
    loading,
    searchQuery,
    selectedType,
    typeOptions,
    filteredApprovals,
    fetchApprovals,
    approveEvent,
    rejectEvent,
  };
});
