import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: '1',
        username: 'admin',
        password: '123',
        name: 'Admin User',
        fullName: 'นายนันนะพัด รุจิพูนพงศ์',
        email: 'admin@example.com',
      },
      {
        id: '2',
        username: 'user',
        password: 'password123',
        name: 'Normal User',
        fullName: 'นายสมโชค ขัยเกษม',
        email: 'user@example.com',
      },
    ],
  }),

  actions: {
    validateUser(usernameOrEmail: string, password: string) {
      return this.users.find(
        (u) =>
          (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
          u.password === password,
      );
    },
  },
});
