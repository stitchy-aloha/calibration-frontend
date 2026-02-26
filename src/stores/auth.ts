import { defineStore } from 'pinia';
import { useUserStore } from './user';

import type { AppRole } from './roles';
import { RolePermissionsMap, type RolePermissions } from './roles';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | {
      id: string;
      email: string;
      name: string;
      fullName: string;
      role: AppRole;
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
      const userStore = useUserStore();

      // Mock login delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const validUser = userStore.validateUser(usernameOrEmail, password);

      if (validUser) {
        this.user = {
          id: validUser.id,
          email: validUser.email,
          name: validUser.name,
          fullName: validUser.fullName,
          role: validUser.role,
        };
        this.isAuthenticated = true;
        this.token = 'mock-jwt-token';
        return true;
      }

      return false;
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
    },
  },
});
