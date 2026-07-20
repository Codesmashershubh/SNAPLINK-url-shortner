import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getOverview, getLinkAnalytics, getAccountAnalytics } from '../services/analytics.service.js';

export const overview = asyncHandler(async (req, res) => {
  const data = await getOverview(req.user._id);
  new ApiResponse(200, data).send(res);
});

export const account = asyncHandler(async (req, res) => {
  const data = await getAccountAnalytics(req.user._id);
  new ApiResponse(200, data).send(res);
});

export const forLink = asyncHandler(async (req, res) => {
  const data = await getLinkAnalytics({ userId: req.user._id, linkId: req.params.id });
  if (!data) throw ApiError.notFound('Link not found');
  new ApiResponse(200, data).send(res);
});
