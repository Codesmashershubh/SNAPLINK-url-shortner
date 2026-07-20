import { api } from './api';
import type { LinkItem, Pagination } from '@/types';

export interface CreateLinkPayload {
  originalUrl: string;
  customAlias?: string;
  password?: string;
  expiresAt?: string;
  title?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

export async function createLinkRequest(payload: CreateLinkPayload) {
  const res = await api.post('/links', payload);
  return res.data.data as { link: LinkItem; shortUrl: string };
}

export async function listLinksRequest(params: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}) {
  const res = await api.get('/links', { params });
  return res.data.data as { items: LinkItem[]; pagination: Pagination };
}

export async function updateLinkRequest(id: string, updates: Partial<LinkItem>) {
  const res = await api.patch(`/links/${id}`, updates);
  return res.data.data.link as LinkItem;
}

export async function deleteLinkRequest(id: string) {
  await api.delete(`/links/${id}`);
}

export async function bulkDeleteRequest(ids: string[]) {
  const res = await api.post('/links/bulk/delete', { ids });
  return res.data.data.deletedCount as number;
}

export async function duplicateLinkRequest(id: string) {
  const res = await api.post(`/links/${id}/duplicate`);
  return res.data.data as { link: LinkItem; shortUrl: string };
}

export async function getQrPngRequest(id: string) {
  const res = await api.get(`/links/${id}/qr.png`);
  return res.data.data.qr as string;
}

export function exportCsvUrl() {
  return `${api.defaults.baseURL}/links/export/csv`;
}
