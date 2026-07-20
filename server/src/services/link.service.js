import Link from '../models/Link.js';
import { ApiError } from '../utils/ApiError.js';
import { generateUniqueCode, isReserved } from '../utils/generateCode.js';
import { PLAN_LIMITS } from '../constants/index.js';

function appendUtm(originalUrl, utm) {
  if (!utm || (!utm.source && !utm.medium && !utm.campaign)) return originalUrl;
  try {
    const url = new URL(originalUrl);
    if (utm.source) url.searchParams.set('utm_source', utm.source);
    if (utm.medium) url.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign);
    return url.toString();
  } catch {
    return originalUrl;
  }
}

export async function createLink({ userId, body }) {
  const { originalUrl, customAlias, password, expiresAt, title, utm } = body;

  if (userId) {
    const count = await Link.countDocuments({ owner: userId });
    if (count >= PLAN_LIMITS.FREE_LINKS_PER_USER) {
      throw ApiError.forbidden(
        `Free plan is limited to ${PLAN_LIMITS.FREE_LINKS_PER_USER} links per account`
      );
    }
  }

  let shortCode = customAlias?.trim();
  if (shortCode) {
    if (isReserved(shortCode)) {
      throw ApiError.badRequest('That alias is reserved, please choose another');
    }
    const exists = await Link.exists({ shortCode });
    if (exists) throw ApiError.conflict('That custom alias is already taken');
  } else {
    shortCode = await generateUniqueCode();
  }

  const finalUrl = appendUtm(originalUrl, utm);

  const link = await Link.create({
    originalUrl: finalUrl,
    shortCode,
    owner: userId || null,
    title: title || '',
    password: password || null,
    expiresAt: expiresAt || null,
    utm: utm || {},
  });

  return link;
}

export async function listLinks({ userId, query }) {
  const { search, sort = '-createdAt', page = 1, limit = 20, filter } = query;

  const q = { owner: userId };
  if (filter === 'active') q.active = true;
  if (filter === 'archived') q.archived = true;
  if (filter === 'favorite') q.favorite = true;
  if (filter !== 'archived') q.archived = { $ne: true };

  if (search) {
    q.$or = [
      { title: { $regex: search, $options: 'i' } },
      { originalUrl: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Link.find(q)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Link.countDocuments(q),
  ]);

  return {
    items: items.map((l) => ({
      id: l._id,
      originalUrl: l.originalUrl,
      shortCode: l.shortCode,
      title: l.title,
      clicks: l.clicks,
      active: l.active,
      favorite: l.favorite,
      archived: l.archived,
      hasPassword: Boolean(l.password),
      expiresAt: l.expiresAt,
      lastClickedAt: l.lastClickedAt,
      createdAt: l.createdAt,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
}

export async function getLinkForOwner({ userId, linkId }) {
  const link = await Link.findOne({ _id: linkId, owner: userId });
  if (!link) throw ApiError.notFound('Link not found');
  return link;
}

export async function updateLink({ userId, linkId, updates }) {
  const link = await getLinkForOwner({ userId, linkId });

  const allowed = ['title', 'originalUrl', 'active', 'favorite', 'archived', 'expiresAt'];
  allowed.forEach((key) => {
    if (key in updates) link[key] = updates[key];
  });

  await link.save();
  return link;
}

export async function deleteLink({ userId, linkId }) {
  const link = await Link.findOneAndDelete({ _id: linkId, owner: userId });
  if (!link) throw ApiError.notFound('Link not found');
  return link;
}

export async function bulkDelete({ userId, ids }) {
  const result = await Link.deleteMany({ _id: { $in: ids }, owner: userId });
  return result.deletedCount;
}

export async function duplicateLink({ userId, linkId }) {
  const source = await getLinkForOwner({ userId, linkId });
  const shortCode = await generateUniqueCode();
  const copy = await Link.create({
    originalUrl: source.originalUrl,
    shortCode,
    owner: userId,
    title: source.title ? `${source.title} (copy)` : '',
    utm: source.utm,
  });
  return copy;
}

export async function resolveShortCode(shortCode) {
  const link = await Link.findOne({ shortCode }).select('+password');
  if (!link) throw ApiError.notFound('This link does not exist');
  if (!link.active) throw ApiError.forbidden('This link has been disabled');
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw ApiError.notFound('This link has expired');
  }
  return link;
}
