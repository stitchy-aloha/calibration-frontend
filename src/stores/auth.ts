import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { AppRole, RolePermissionsMap, type RolePermissions } from './roles';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  tel: string;
  imageUrl: string;
  lineUserId: string | null;
  roleId: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

function mapRoleName(role: { id: number; name: string } | null | undefined): AppRole {
  if (!role) return AppRole.TECHNICIAN;

  // Priority 1: Map by ID (most reliable)
  const idMap: Record<number, AppRole> = {
    1: AppRole.ADMIN,
    2: AppRole.TECHNICIAN,
    3: AppRole.HEAD_OF_DEPT,
    4: AppRole.DIRECTOR,
  };
  const appRoleById = idMap[role.id];
  if (appRoleById) return appRoleById;

  // Priority 2: Map by Name (fallback)
  const normalized = (role.name || '').toLowerCase().trim();
  const nameMap: Record<string, AppRole> = {
    admin: AppRole.ADMIN,
    ผู้ดูแลระบบ: AppRole.ADMIN,
    technician: AppRole.TECHNICIAN,
    ช่างเทคนิค: AppRole.TECHNICIAN,
    เจ้าหน้าที่สอบเทียบ: AppRole.TECHNICIAN,
    head_of_dept: AppRole.HEAD_OF_DEPT,
    'head of dept': AppRole.HEAD_OF_DEPT,
    'head-of-dept': AppRole.HEAD_OF_DEPT,
    'head of department': AppRole.HEAD_OF_DEPT,
    หัวหน้าแผนก: AppRole.HEAD_OF_DEPT,
    หัวหน้างาน: AppRole.HEAD_OF_DEPT,
    director: AppRole.DIRECTOR,
    ผู้อำนวยการ: AppRole.DIRECTOR,
  };
  return nameMap[normalized] || AppRole.TECHNICIAN;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | {
      id: number;
      email: string;
      name: string;
      fullName: string;
      username: string;
      tel: string;
      imageUrl: string;
      role: AppRole;
      roleId: number;
      lineUserId: string | null;
      hospitalId: number | null;
    },
    isAuthenticated: false,
    token: null as null | string,
  }),

  getters: {
    getUser: (state) => state.user,
    permissions: (state): RolePermissions | null => {
      if (!state.user) return null;
      return RolePermissionsMap[state.user.role] || null;
    },
  },

  actions: {
    async login(usernameOrEmail: string, password: string) {
      const res = await api.post<{ access_token: string }>('/auth/login', {
        username: usernameOrEmail,
        password,
      });

      const token = res.data.access_token;
      this.token = token;
      localStorage.setItem('auth_token', token);

      // Fetch current user profile
      const profileRes = await api.get<AuthUser>('/auth/profile');
      const u = profileRes.data;

      this.user = {
        id: u.id,
        email: u.email,
        name: u.name,
        fullName: u.name,
        username: u.username,
        tel: u.tel,
        imageUrl: u.imageUrl,
        role: mapRoleName(u.role),
        roleId: u.roleId,
        lineUserId: u.lineUserId || null,
        hospitalId: (u as unknown as { hospitalId: number | null }).hospitalId || null,
      };
      this.isAuthenticated = true;
      return true;
    },

    loadFromStorage() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      }
    },

    async fetchProfile() {
      if (!this.token) return false;
      try {
        const profileRes = await api.get<AuthUser>('/auth/profile');
        const u = profileRes.data;
        this.user = {
          id: u.id,
          email: u.email,
          name: u.name,
          fullName: u.name,
          username: u.username,
          tel: u.tel,
          imageUrl: u.imageUrl,
          role: mapRoleName(u.role),
          roleId: u.roleId,
          lineUserId: u.lineUserId || null,
          hospitalId: (u as unknown as { hospitalId: number | null }).hospitalId || null,
        };
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        this.logout();
        return false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('auth_token');
    },
  },
});
