import { api } from './api';
import type { User } from '@/types';

export async function registerRequest(payload: { name: string; email: string; password: string }) {
  const res = await api.post('/auth/register', payload);
  return res.data.data as { user: User; accessToken: string };
}

export async function loginRequest(payload: { email: string; password: string }) {
  const res = await api.post('/auth/login', payload);
  return res.data.data as { user: User; accessToken: string };
}

export async function logoutRequest() {
  await api.post('/auth/logout');
}

export async function meRequest() {
  const res = await api.get('/auth/me');
  return res.data.data.user as User;
}

export async function forgotPasswordRequest(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data as { message: string; data: { resetToken?: string } | null };
}

export async function resetPasswordRequest(token: string, password: string) {
  await api.post('/auth/reset-password', { token, password });
}

export async function regenerateApiKeyRequest() {
  const res = await api.post('/auth/api-key/regenerate');
  return res.data.data.apiKey as string;
}

export async function getApiKeyRequest() {
  const res = await api.get('/auth/api-key');
  return res.data.data.apiKey as string;
}
