import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { resolveShortCode } from '../services/link.service.js';
import { recordClick } from '../services/analytics.service.js';
import { env } from '../config/env.js';

// GET /:code — used by real browsers clicking a shared link.
export const redirect = asyncHandler(async (req, res) => {
  const link = await resolveShortCode(req.params.code);

  if (link.password) {
    // Send them to the frontend's "this link is protected" screen instead of
    // asking for a password on a bare API response.
    return res.redirect(
      `${env.clientUrl}/protected/${link.shortCode}?next=${encodeURIComponent(link.originalUrl)}`
    );
  }

  await recordClick(link, req);
  return res.redirect(302, link.originalUrl);
});

// POST /api/redirect/:code/unlock — called by the frontend password screen.
export const unlock = asyncHandler(async (req, res) => {
  const link = await resolveShortCode(req.params.code);
  const { password } = req.body;

  if (!link.password) {
    return new ApiResponse(200, { originalUrl: link.originalUrl }).send(res);
  }

  const valid = await link.comparePassword(password);
  if (!valid) throw ApiError.unauthorized('Incorrect password');

  await recordClick(link, req);
  new ApiResponse(200, { originalUrl: link.originalUrl }).send(res);
});

// GET /api/redirect/:code/meta — lets the frontend show link title/favicon
// on the password gate without exposing the destination URL up front.
export const meta = asyncHandler(async (req, res) => {
  const link = await resolveShortCode(req.params.code);
  new ApiResponse(200, {
    shortCode: link.shortCode,
    title: link.title,
    hasPassword: Boolean(link.password),
  }).send(res);
});
