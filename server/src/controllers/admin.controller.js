import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';
import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';

export const stats = asyncHandler(async (req, res) => {
  const [totalUsers, totalLinks, totalClicks, bannedUsers] = await Promise.all([
    User.countDocuments(),
    Link.countDocuments(),
    Analytics.estimatedDocumentCount(),
    User.countDocuments({ isBanned: true }),
  ]);
  new ApiResponse(200, { totalUsers, totalLinks, totalClicks, bannedUsers }).send(res);
});

export const listUsers = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;
  const q = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Number(limit));

  const [items, total] = await Promise.all([
    User.find(q)
      .select('name email role isBanned isEmailVerified createdAt')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    User.countDocuments(q),
  ]);

  new ApiResponse(200, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 }).send(
    res
  );
});

export const toggleBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  user.isBanned = !user.isBanned;
  await user.save();
  new ApiResponse(200, { isBanned: user.isBanned }, user.isBanned ? 'User banned' : 'User unbanned').send(
    res
  );
});

export const listAllLinks = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 20 } = req.query;
  const q = search
    ? { $or: [{ shortCode: new RegExp(search, 'i') }, { originalUrl: new RegExp(search, 'i') }] }
    : {};

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Number(limit));

  const [items, total] = await Promise.all([
    Link.find(q)
      .populate('owner', 'name email')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Link.countDocuments(q),
  ]);

  new ApiResponse(200, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 }).send(
    res
  );
});

export const deleteAnyLink = asyncHandler(async (req, res) => {
  const link = await Link.findByIdAndDelete(req.params.id);
  if (!link) throw ApiError.notFound('Link not found');
  new ApiResponse(200, null, 'Link removed').send(res);
});
