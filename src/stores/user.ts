import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  tel: string;
  imageUrl: string | null;
  signatureUrl: string | null;
  lineUserId: string | null;
  position: string | null;
  roleId: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    searchQuery: '',
    roleFilter: '',
  }),

  getters: {
    filteredUsers(state): User[] {
      let result = state.users;

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            u.tel.includes(q),
        );
      }

      if (state.roleFilter) {
        result = result.filter((u) => u.role.description === state.roleFilter);
      }

      return result;
    },

    availableRoles(state): string[] {
      const roles = new Set(state.users.map((u) => u.role.description));
      return Array.from(roles);
    },
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const res = await api.get<User[]>('/users');
        this.users = res.data;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      await api.delete(`/users/${id}`);
      this.users = this.users.filter((u) => u.id !== id);
    },

    async createUser(data: FormData) {
      const res = await api.post<User>('/users', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      this.users.push(res.data);
    },

    async updateUser(id: number, data: FormData) {
      const res = await api.patch<User>(`/users/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const idx = this.users.findIndex((u) => u.id === id);
      if (idx !== -1) this.users[idx] = res.data;
    },
  },
});
