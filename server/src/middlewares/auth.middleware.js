import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/token.js';
import User from '../models/User.js';
import { COOKIE_NAMES, ROLES } from '../constants/index.js';

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  if (req.cookies && req.cookies[COOKIE_NAMES.ACCESS]) return req.cookies[COOKIE_NAMES.ACCESS];
  return null;
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized('Please sign in to continue');

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized('Your session has expired, please sign in again');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Account no longer exists');
  if (user.isBanned) throw ApiError.forbidden('This account has been suspended');

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user && !user.isBanned) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Admin access required');
  }
  next();
});

// Accepts either a logged-in session OR a valid x-api-key header, for
// developers calling the public REST API directly.
export const requireAuthOrApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    const user = await User.findOne({ apiKey });
    if (!user) throw ApiError.unauthorized('Invalid API key');
    if (user.isBanned) throw ApiError.forbidden('This account has been suspended');
    req.user = user;
    return next();
  }
  return requireAuth(req, res, next);
});
