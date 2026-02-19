import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: '1',
        username: 'admin',
        password: '123',
        name: 'Admin User',
        email: 'admin@example.com',
      },
      {
        id: '2',
        username: 'user',
        password: 'password123',
        name: 'Normal User',
        email: 'user@example.com',
      },
    ],
  }),

  actions: {
    validateUser(usernameOrEmail: string, password: string) {
      return this.users.find(
        (u) =>
          (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
          u.password === password
      );
    },
  },
});
