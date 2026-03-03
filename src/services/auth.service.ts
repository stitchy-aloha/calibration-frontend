import { api } from 'src/boot/axios';
import type { LoginPayload, LoginResponse, ApiAuthUser } from 'src/types';

export const AuthService = {
  login: (payload: LoginPayload) => api.post<LoginResponse>('/auth/login', payload),

  getProfile: () => api.get<ApiAuthUser>('/auth/profile'),
};
