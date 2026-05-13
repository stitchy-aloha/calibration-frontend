export enum AppRole {
  TECHNICIAN = 'ช่างเทคนิค',
  HEAD_OF_DEPT = 'หัวหน้าแผนก',
  ADMIN = 'ผู้ดูแลระบบ',
  DIRECTOR = 'ผู้อำนวยการ',
}

export interface RolePermissions {
  canManageTools: boolean;
  canManageDepartments: boolean;
  canApproveCalibration: boolean;
  allowedMenus: string[];
}

export const RolePermissionsMap: Record<AppRole, RolePermissions> = {
  [AppRole.TECHNICIAN]: {
    canManageTools: false,
    canManageDepartments: false,
    canApproveCalibration: false,
    allowedMenus: ['/dashboard', '/schedule', '/calibration', '/tools', '/history'],
  },
  [AppRole.HEAD_OF_DEPT]: {
    canManageTools: false,
    canManageDepartments: false,
    canApproveCalibration: true,
    // Head of Dept can see approval and dashboard/reports
    allowedMenus: ['/dashboard', '/schedule', '/approval', '/tools', '/history'],
  },
  [AppRole.ADMIN]: {
    canManageTools: true,
    canManageDepartments: true,
    canApproveCalibration: true,
    // Admin sees everything
    allowedMenus: [
      '/dashboard',
      '/schedule',
      '/ward',
      '/calibration',
      '/approval',
      '/tools',
      '/departments',
      '/users',
      '/hospitals',
      '/maintenance',
      '/history',
      '/audit',
      '/tools/manage',
    ],
  },
  [AppRole.DIRECTOR]: {
    canManageTools: false,
    canManageDepartments: false,
    canApproveCalibration: true,
    // Director mostly sees specialized dashboard, approvals, history
    allowedMenus: ['/director-dashboard', '/schedule', '/approval', '/history'],
  },
};
