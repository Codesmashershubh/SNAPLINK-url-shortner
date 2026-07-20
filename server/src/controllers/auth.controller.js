import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { COOKIE_NAMES } from '../constants/index.js';
import { env } from '../config/env.js';
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  revokeAllSessions,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSecure ? 'none' : 'lax',
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(COOKIE_NAMES.ACCESS, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(COOKIE_NAMES.REFRESH, refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await registerUser(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  new ApiResponse(
    201,
    { user: user.toSafeObject(), accessToken },
    'Account created — welcome to SnapLink'
  ).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  new ApiResponse(200, { user: user.toSafeObject(), accessToken }, 'Signed in').send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAMES.REFRESH] || req.body?.refreshToken;
  const { user, accessToken, refreshToken } = await rotateRefreshToken(token);
  setAuthCookies(res, accessToken, refreshToken);
  new ApiResponse(200, { user: user.toSafeObject(), accessToken }, 'Session refreshed').send(res);
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) await revokeAllSessions(req.user._id);
  res.clearCookie(COOKIE_NAMES.ACCESS, cookieOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH, cookieOptions);
  new ApiResponse(200, null, 'Signed out').send(res);
});

export const me = asyncHandler(async (req, res) => {
  new ApiResponse(200, { user: req.user.toSafeObject() }).send(res);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const token = await requestPasswordReset(req.body.email);
  // In production this token is emailed via Resend/Nodemailer (see services/auth.service.js).
  // Returned directly only outside production so the flow is testable without an SMTP key.
  new ApiResponse(
    200,
    env.nodeEnv === 'production' ? null : { resetToken: token },
    'If that email exists, a reset link has been sent'
  ).send(res);
});

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await resetPassword(token, password);
  new ApiResponse(200, null, 'Password updated — please sign in again').send(res);
});

export const regenerateApiKey = asyncHandler(async (req, res) => {
  const key = `sl_${crypto.randomBytes(20).toString('hex')}`;
  req.user.apiKey = key;
  await req.user.save();
  new ApiResponse(200, { apiKey: key }, 'API key regenerated').send(res);
});

export const noApiKey = asyncHandler(async (req, res) => {
  if (!req.user.apiKey) throw ApiError.notFound('No API key generated yet');
  new ApiResponse(200, { apiKey: req.user.apiKey }).send(res);
});
