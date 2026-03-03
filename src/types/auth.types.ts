// ─────────────────────────────────────────────────────────────────────────────
// Auth & User types (used by auth.ts, user.ts stores)
// ─────────────────────────────────────────────────────────────────────────────

import type { AppRole } from 'src/stores/roles';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  fullName: string;
  username: string;
  tel: string;
  imageUrl: string;
  role: AppRole;
  roleId: number;
}

export interface ApiAuthUser {
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

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}
