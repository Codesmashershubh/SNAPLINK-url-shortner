import crypto from 'crypto';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import Analytics from '../models/Analytics.js';
import Link from '../models/Link.js';

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 24);
}

function realIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip;
}

export async function recordClick(link, req) {
  const ip = realIp(req);
  const geo = geoip.lookup(ip) || {};
  const parser = new UAParser(req.headers['user-agent'] || '');
  const ua = parser.getResult();

  await Promise.all([
    Analytics.create({
      linkId: link._id,
      country: geo.country || 'Unknown',
      city: geo.city || 'Unknown',
      browser: ua.browser?.name || 'Unknown',
      os: ua.os?.name || 'Unknown',
      device: ua.device?.type ? capitalize(ua.device.type) : 'Desktop',
      referer: req.headers.referer || 'Direct',
      ipHash: hashIp(ip),
    }),
    Link.findByIdAndUpdate(link._id, {
      $inc: { clicks: 1 },
      $set: { lastClickedAt: new Date() },
    }),
  ]);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getOverview(userId) {
  const links = await Link.find({ owner: userId }).select('_id clicks archived active').lean();
  const linkIds = links.map((l) => l._id);

  const totalLinks = links.filter((l) => !l.archived).length;
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const activeLinks = links.filter((l) => l.active && !l.archived).length;

  const topLinkAgg = await Link.find({ owner: userId, archived: { $ne: true } })
    .sort('-clicks')
    .limit(1)
    .select('shortCode title clicks originalUrl')
    .lean();

  const since = daysAgo(30);
  const clicksOverTime = await Analytics.aggregate([
    { $match: { linkId: { $in: linkIds }, timestamp: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalLinks,
    totalClicks,
    activeLinks,
    qrCodesGenerated: totalLinks, // every link has a QR code generated on demand
    topLink: topLinkAgg[0] || null,
    clicksOverTime: clicksOverTime.map((d) => ({ date: d._id, clicks: d.clicks })),
  };
}

async function groupBy(field, linkIds, limit = 8) {
  const results = await Analytics.aggregate([
    { $match: { linkId: { $in: linkIds } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return results.map((r) => ({ name: r._id || 'Unknown', value: r.count }));
}

export async function getLinkAnalytics({ userId, linkId }) {
  const link = await Link.findOne({ _id: linkId, owner: userId });
  if (!link) return null;

  const linkIds = [link._id];
  const [countries, devices, browsers, referrers, os] = await Promise.all([
    groupBy('country', linkIds),
    groupBy('device', linkIds),
    groupBy('browser', linkIds),
    groupBy('referer', linkIds),
    groupBy('os', linkIds),
  ]);

  const since = daysAgo(30);
  const timeline = await Analytics.aggregate([
    { $match: { linkId: { $in: linkIds }, timestamp: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    link: link.toPublicObject(),
    countries,
    devices,
    browsers,
    referrers,
    os,
    timeline: timeline.map((d) => ({ date: d._id, clicks: d.clicks })),
  };
}

export async function getAccountAnalytics(userId) {
  const links = await Link.find({ owner: userId }).select('_id').lean();
  const linkIds = links.map((l) => l._id);

  const [countries, devices, browsers, referrers] = await Promise.all([
    groupBy('country', linkIds, 10),
    groupBy('device', linkIds, 10),
    groupBy('browser', linkIds, 10),
    groupBy('referer', linkIds, 10),
  ]);

  return { countries, devices, browsers, referrers };
}
