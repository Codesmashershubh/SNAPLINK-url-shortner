import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiry,
  });
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), v: user.refreshTokenVersion || 0 },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiry }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}
