import { body, param } from 'express-validator';

export const createLinkValidator = [
  body('originalUrl')
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Enter a valid URL, including https://'),
  body('customAlias')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Custom alias must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Custom alias can only contain letters, numbers, hyphens and underscores'),
  body('password').optional({ checkFalsy: true }).isLength({ min: 4, max: 64 }),
  body('expiresAt').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid expiry date'),
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 140 }),
];

export const updateLinkValidator = [
  param('id').isMongoId().withMessage('Invalid link id'),
  body('title').optional({ checkFalsy: true }).trim().isLength({ max: 140 }),
  body('originalUrl').optional({ checkFalsy: true }).isURL({ require_protocol: true }),
  body('active').optional().isBoolean(),
  body('favorite').optional().isBoolean(),
  body('archived').optional().isBoolean(),
  body('expiresAt').optional({ checkFalsy: true, nullable: true }).isISO8601(),
];

export const idParamValidator = [param('id').isMongoId().withMessage('Invalid id')];
