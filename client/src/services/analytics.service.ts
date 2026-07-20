import { api } from './api';
import type { OverviewStats, LinkAnalytics, BreakdownItem } from '@/types';

export async function getOverviewRequest() {
  const res = await api.get('/analytics/overview');
  return res.data.data as OverviewStats;
}

export async function getAccountAnalyticsRequest() {
  const res = await api.get('/analytics/account');
  return res.data.data as {
    countries: BreakdownItem[];
    devices: BreakdownItem[];
    browsers: BreakdownItem[];
    referrers: BreakdownItem[];
  };
}

export async function getLinkAnalyticsRequest(id: string) {
  const res = await api.get(`/analytics/link/${id}`);
  return res.data.data as LinkAnalytics;
}
