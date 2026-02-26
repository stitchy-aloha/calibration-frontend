import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: '1',
        username: 'user',
        password: '123',
        name: 'Normal User',
        fullName: 'นายสมโชค ขัยเกษม',
        role: 'ช่างเทคนิค',
        email: 'user@example.com',
      },
      {
        id: '2',
        username: 'admin',
        password: '123',
        name: 'Admin User',
        fullName: 'นายนันท์นภัส รุจิพูนพงศ์',
        role: 'ผู้ดูแลระบบ',
        email: 'admin@example.com',
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
