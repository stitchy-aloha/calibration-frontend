import { api } from 'src/boot/axios';
import type { ApprovalEvent } from 'src/types';

export const ApprovalService = {
  getAll: () => api.get<ApprovalEvent[]>('/approvals'),

  approve: (id: string) => api.patch(`/approvals/${id}/approve`),

  reject: (id: string) => api.patch(`/approvals/${id}/reject`),
};
