export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
}

export interface LinkItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title: string;
  clicks: number;
  active: boolean;
  favorite: boolean;
  archived: boolean;
  hasPassword: boolean;
  expiresAt: string | null;
  lastClickedAt: string | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OverviewStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  qrCodesGenerated: number;
  topLink: { shortCode: string; title: string; clicks: number; originalUrl: string } | null;
  clicksOverTime: { date: string; clicks: number }[];
}

export interface BreakdownItem {
  name: string;
  value: number;
}

export interface LinkAnalytics {
  link: LinkItem;
  countries: BreakdownItem[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  referrers: BreakdownItem[];
  os: BreakdownItem[];
  timeline: { date: string; clicks: number }[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
