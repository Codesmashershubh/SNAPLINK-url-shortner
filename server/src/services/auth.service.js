import crypto from 'crypto';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.js';

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with that email already exists');

  const user = await User.create({
    name,
    email,
    password,
    emailVerifyToken: crypto.randomBytes(24).toString('hex'),
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user, accessToken, refreshToken };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  if (user.isBanned) throw ApiError.forbidden('This account has been suspended');

  const valid = await user.comparePassword(password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user, accessToken, refreshToken };
}

export async function rotateRefreshToken(token) {
  if (!token) throw ApiError.unauthorized('Missing refresh token');

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Refresh token invalid or expired');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Account no longer exists');
  if ((user.refreshTokenVersion || 0) !== payload.v) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user, accessToken, refreshToken };
}

export async function revokeAllSessions(userId) {
  await User.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  // Always resolve without revealing whether the email exists.
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  return resetToken;
}

export async function resetPassword(token, newPassword) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!user) throw ApiError.badRequest('Reset link is invalid or has expired');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
  await user.save();
  return user;
}
