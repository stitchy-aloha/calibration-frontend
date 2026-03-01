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
  roleId: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

function mapRoleName(roleName: string): AppRole {
  const map: Record<string, AppRole> = {
    admin: AppRole.ADMIN,
    ผู้ดูแลระบบ: AppRole.ADMIN,
    technician: AppRole.TECHNICIAN,
    ช่างเทคนิค: AppRole.TECHNICIAN,
    head_of_dept: AppRole.HEAD_OF_DEPT,
    หัวหน้าแผนก: AppRole.HEAD_OF_DEPT,
    director: AppRole.DIRECTOR,
    ผู้อำนวยการ: AppRole.DIRECTOR,
  };
  return map[roleName] || AppRole.TECHNICIAN;
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
        role: mapRoleName(u.role.name),
        roleId: u.roleId,
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

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('auth_token');
    },
  },
});
