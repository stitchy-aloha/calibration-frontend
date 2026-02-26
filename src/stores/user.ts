import { defineStore } from 'pinia';
import { AppRole } from './roles';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: '1',
        username: 'tech',
        password: '123',
        name: 'Tech User',
        fullName: 'นายสมโชค ขัยเกษม',
        role: AppRole.TECHNICIAN,
        email: 'tech@example.com',
      },
      {
        id: '2',
        username: 'head',
        password: '123',
        name: 'Head Dept',
        fullName: 'นางสมศรี ดีใจ',
        role: AppRole.HEAD_OF_DEPT,
        email: 'head@example.com',
      },
      {
        id: '3',
        username: 'admin',
        password: '123',
        name: 'Admin User',
        fullName: 'นายนันท์นภัส รุจิพูนพงศ์',
        role: AppRole.ADMIN,
        email: 'admin@example.com',
      },
      {
        id: '4',
        username: 'director',
        password: '123',
        name: 'Director User',
        fullName: 'นพ. วิทยา ทองสว่าง',
        role: AppRole.DIRECTOR,
        email: 'director@example.com',
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
