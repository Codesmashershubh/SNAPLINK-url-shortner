import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import {
  createLink,
  listLinks,
  getLinkForOwner,
  updateLink,
  deleteLink,
  bulkDelete,
  duplicateLink,
} from '../services/link.service.js';
import { generateQrPng, generateQrSvg } from '../services/qr.service.js';
import Link from '../models/Link.js';

function shortUrlFor(shortCode) {
  return `${env.baseUrl}/${shortCode}`;
}

export const create = asyncHandler(async (req, res) => {
  const link = await createLink({ userId: req.user?._id || null, body: req.body });
  new ApiResponse(
    201,
    { link: link.toPublicObject(), shortUrl: shortUrlFor(link.shortCode) },
    'Link created'
  ).send(res);
});

export const list = asyncHandler(async (req, res) => {
  const result = await listLinks({ userId: req.user._id, query: req.query });
  const items = result.items.map((l) => ({ ...l, shortUrl: shortUrlFor(l.shortCode) }));
  new ApiResponse(200, { ...result, items }).send(res);
});

export const getOne = asyncHandler(async (req, res) => {
  const link = await getLinkForOwner({ userId: req.user._id, linkId: req.params.id });
  new ApiResponse(200, {
    link: link.toPublicObject(),
    shortUrl: shortUrlFor(link.shortCode),
  }).send(res);
});

export const update = asyncHandler(async (req, res) => {
  const link = await updateLink({ userId: req.user._id, linkId: req.params.id, updates: req.body });
  new ApiResponse(200, { link: link.toPublicObject() }, 'Link updated').send(res);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteLink({ userId: req.user._id, linkId: req.params.id });
  new ApiResponse(200, null, 'Link deleted').send(res);
});

export const removeBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) throw ApiError.badRequest('No links selected');
  const count = await bulkDelete({ userId: req.user._id, ids });
  new ApiResponse(200, { deletedCount: count }, `${count} link(s) deleted`).send(res);
});

export const duplicate = asyncHandler(async (req, res) => {
  const link = await duplicateLink({ userId: req.user._id, linkId: req.params.id });
  new ApiResponse(
    201,
    { link: link.toPublicObject(), shortUrl: shortUrlFor(link.shortCode) },
    'Link duplicated'
  ).send(res);
});

export const getQrPng = asyncHandler(async (req, res) => {
  const link = await Link.findOne({ _id: req.params.id, owner: req.user._id });
  if (!link) throw ApiError.notFound('Link not found');
  const dataUri = await generateQrPng(shortUrlFor(link.shortCode));
  new ApiResponse(200, { qr: dataUri }).send(res);
});

export const getQrSvg = asyncHandler(async (req, res) => {
  const link = await Link.findOne({ _id: req.params.id, owner: req.user._id });
  if (!link) throw ApiError.notFound('Link not found');
  const svg = await generateQrSvg(shortUrlFor(link.shortCode));
  res.set('Content-Type', 'image/svg+xml');
  res.send(svg);
});

export const exportCsv = asyncHandler(async (req, res) => {
  const links = await Link.find({ owner: req.user._id }).sort('-createdAt').lean();
  const header = 'Short URL,Original URL,Title,Clicks,Active,Created At\n';
  const rows = links
    .map((l) =>
      [
        shortUrlFor(l.shortCode),
        `"${l.originalUrl.replace(/"/g, '""')}"`,
        `"${(l.title || '').replace(/"/g, '""')}"`,
        l.clicks,
        l.active,
        l.createdAt.toISOString(),
      ].join(',')
    )
    .join('\n');

  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', 'attachment; filename="snaplink-export.csv"');
  res.send(header + rows);
});
